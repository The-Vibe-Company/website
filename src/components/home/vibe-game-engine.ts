import * as THREE from "three";
import {
  VIBE_GAME_WORLDS,
  clampWorldIndex,
  hasRunnerCollision,
  shouldHandleGameKey,
  worldIndexForDistance,
} from "./vibe-game-state";
import type { VibeGamePhase, VibeGameSnapshot, VibeGameWorld } from "./vibe-game-state";

export type { VibeGamePhase, VibeGameSnapshot, VibeGameWorld } from "./vibe-game-state";

interface VibeGameCallbacks {
  onState: (snapshot: VibeGameSnapshot) => void;
  onScore: (score: number, best: number, progress: number) => void;
  onWorld: (world: VibeGameWorld, index: number) => void;
}

interface WorldPalette {
  paper: number;
  fog: number;
  ink: number;
  accent: number;
  player: number;
  ground: number;
}

interface ObstacleRecord {
  active: boolean;
  counted: boolean;
  group: THREE.Group;
  kind: "ground" | "overhead";
  variants: THREE.Group[];
  spinners: THREE.Object3D[];
  x: number;
}

interface MovingProp {
  object: THREE.Object3D;
  originX: number;
  parallax: number;
  world: number;
}

const WORLD_SPAN = 42;
const WARP_DURATION = 1.15;
const PLAYER_X = -3.75;
const BEST_SCORE_KEY = "tvc_vibe_worlds_best";

const PALETTES: WorldPalette[] = [
  {
    paper: 0xfdfbf7,
    fog: 0xeee7dc,
    ink: 0x111111,
    accent: 0xf97316,
    player: 0x171717,
    ground: 0xe8e1d6,
  },
  {
    paper: 0xe9eee9,
    fog: 0xcbd8cf,
    ink: 0x16231b,
    accent: 0x2f6f52,
    player: 0x102219,
    ground: 0xbfcdbf,
  },
  {
    paper: 0xe9e3d8,
    fog: 0xd2c5b4,
    ink: 0x201b18,
    accent: 0xb84d24,
    player: 0x261e19,
    ground: 0xc9bba8,
  },
];

function readBestScore() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_SCORE_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function writeBestScore(score: number) {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Storage may be disabled. A run still remains fully playable.
  }
}

/**
 * A small purpose-built Three.js endless runner. All geometry is procedural and
 * local: the scene does not fetch models, textures, shaders, or runtime assets.
 */
export class VibeGameEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly callbacks: VibeGameCallbacks;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80);
  private readonly player = new THREE.Group();
  private readonly playerMaterial = new THREE.MeshStandardMaterial({
    color: PALETTES[0].player,
    roughness: 0.76,
    metalness: 0.04,
  });
  private readonly accentMaterial = new THREE.MeshStandardMaterial({
    color: PALETTES[0].accent,
    roughness: 0.68,
    metalness: 0.08,
  });
  private readonly groundMaterial = new THREE.MeshStandardMaterial({
    color: PALETTES[0].ground,
    roughness: 0.92,
    metalness: 0,
  });
  private readonly inkMaterials = PALETTES.map(
    (palette) => new THREE.MeshStandardMaterial({ color: palette.ink, roughness: 0.82 })
  );
  private readonly accentMaterials = PALETTES.map(
    (palette) => new THREE.MeshStandardMaterial({ color: palette.accent, roughness: 0.66 })
  );
  private readonly paperMaterials = PALETTES.map(
    (palette) => new THREE.MeshStandardMaterial({ color: palette.paper, roughness: 0.94 })
  );
  private readonly environmentGroups = PALETTES.map(() => new THREE.Group());
  private readonly groundTiles: THREE.Mesh[] = [];
  private readonly movingProps: MovingProp[] = [];
  private readonly obstacles: ObstacleRecord[] = [];
  private readonly leftLeg = new THREE.Group();
  private readonly rightLeg = new THREE.Group();
  private readonly leftArm = new THREE.Group();
  private readonly rightArm = new THREE.Group();
  private readonly playerShadow: THREE.Mesh;
  private readonly keyLight = new THREE.DirectionalLight(0xfff3df, 3.2);
  private readonly fillLight = new THREE.HemisphereLight(0xfff8ec, 0x6f655c, 1.9);
  private readonly warpMaterial = new THREE.MeshBasicMaterial({
    color: PALETTES[0].accent,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  private readonly warpStreaks: THREE.InstancedMesh;
  private readonly warpVeilMaterial = new THREE.MeshBasicMaterial({
    color: PALETTES[1].accent,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  private readonly warpVeil: THREE.Mesh;
  private readonly warpGateMaterial = new THREE.MeshBasicMaterial({
    color: PALETTES[1].accent,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  private readonly warpGate: THREE.Mesh;
  private readonly warpSeeds: Array<[number, number, number]> = [];
  private readonly tempMatrix = new THREE.Matrix4();
  private readonly tempPosition = new THREE.Vector3();
  private readonly tempScale = new THREE.Vector3();
  private readonly tempQuaternion = new THREE.Quaternion();
  private readonly targetBackground = new THREE.Color(PALETTES[0].paper);
  private readonly targetFog = new THREE.Color(PALETTES[0].fog);
  private readonly palettePlayerColors = PALETTES.map((palette) => new THREE.Color(palette.player));
  private readonly paletteAccentColors = PALETTES.map((palette) => new THREE.Color(palette.accent));
  private readonly paletteGroundColors = PALETTES.map((palette) => new THREE.Color(palette.ground));
  private readonly palettePaperColors = PALETTES.map((palette) => new THREE.Color(palette.paper));
  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;

  private phase: VibeGamePhase = "idle";
  private worldIndex = 0;
  private pendingWorldIndex = 0;
  private distance = 0;
  private score = 0;
  private best = readBestScore();
  private speed = 9.2;
  private playerY = 0;
  private playerVelocity = 0;
  private jumping = false;
  private ducking = false;
  private jumpHeld = false;
  private spawnTimer = 3.05;
  private obstaclesSpawnedInWorld = 0;
  private elapsed = 0;
  private warpRemaining = 0;
  private warpApplied = false;
  private visible = true;
  private documentVisible = !document.hidden;
  private destroyed = false;
  private frame = 0;
  private lastReportedScore = -1;
  private baseCameraFov = 39;
  private lastFrameTime = 0;
  private visited = new Set<VibeGameWorld>();

  constructor(canvas: HTMLCanvasElement, callbacks: VibeGameCallbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.scene.background = new THREE.Color(PALETTES[0].paper);
    this.scene.fog = new THREE.FogExp2(PALETTES[0].fog, 0.036);
    this.camera.position.set(0.25, 3.25, 10.2);
    this.camera.lookAt(-0.35, 1.2, 0);

    this.keyLight.position.set(-1.5, 7, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(1024, 1024);
    this.keyLight.shadow.camera.left = -12;
    this.keyLight.shadow.camera.right = 12;
    this.keyLight.shadow.camera.top = 9;
    this.keyLight.shadow.camera.bottom = -3;
    this.scene.add(this.keyLight, this.fillLight);

    this.playerShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.72, 24),
      new THREE.MeshBasicMaterial({ color: 0x080808, transparent: true, opacity: 0.18, depthWrite: false })
    );
    this.playerShadow.rotation.x = -Math.PI / 2;
    this.playerShadow.position.set(PLAYER_X, 0.016, 0.16);
    this.scene.add(this.playerShadow);

    this.createGround();
    this.createPlayer();
    this.createEnvironments();
    this.createObstaclePool();

    const streakGeometry = new THREE.BoxGeometry(1.4, 0.018, 0.018);
    this.warpStreaks = new THREE.InstancedMesh(streakGeometry, this.warpMaterial, 44);
    this.warpStreaks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.warpStreaks.frustumCulled = false;
    this.warpStreaks.visible = false;
    for (let index = 0; index < 44; index += 1) {
      this.warpSeeds.push([
        ((index * 37) % 101) / 101,
        ((index * 61) % 97) / 97,
        ((index * 23) % 89) / 89,
      ]);
    }
    this.scene.add(this.warpStreaks);
    this.warpVeil = new THREE.Mesh(new THREE.PlaneGeometry(26, 12), this.warpVeilMaterial);
    this.warpVeil.position.set(0, 2.8, 6.2);
    this.warpVeil.renderOrder = 20;
    this.warpVeil.visible = false;
    this.warpGate = new THREE.Mesh(new THREE.RingGeometry(2.25, 2.42, 4), this.warpGateMaterial);
    this.warpGate.position.set(0, 2.25, 5.75);
    this.warpGate.rotation.z = Math.PI / 4;
    this.warpGate.renderOrder = 21;
    this.warpGate.visible = false;
    this.scene.add(this.warpVeil, this.warpGate);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry?.isIntersecting ?? true;
        this.syncLoop();
      },
      { threshold: 0.15 }
    );
    this.intersectionObserver.observe(canvas);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    canvas.addEventListener("pointerdown", this.onCanvasPointerDown);

    this.activateWorld(0, false);
    this.resize();
    this.emitState();
    this.syncLoop();
  }

  private createGround() {
    const geometry = new THREE.BoxGeometry(2.05, 0.12, 4.4);
    for (let index = 0; index < 12; index += 1) {
      const tile = new THREE.Mesh(geometry, this.groundMaterial);
      tile.position.set(-10 + index * 2.02, -0.07, 0.2);
      tile.receiveShadow = true;
      this.groundTiles.push(tile);
      this.scene.add(tile);
    }

    const horizon = new THREE.GridHelper(42, 42, 0x736a61, 0xb8afa5);
    horizon.position.set(4, 0.005, -2.35);
    horizon.scale.z = 1.6;
    (horizon.material as THREE.Material).transparent = true;
    (horizon.material as THREE.Material).opacity = 0.24;
    this.scene.add(horizon);
  }

  private createPlayer() {
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.88, 0.48), this.playerMaterial);
    torso.position.y = 1.08;
    torso.castShadow = true;
    const chestMark = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.03), this.accentMaterial);
    chestMark.position.set(0.16, 1.08, 0.255);
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.33, 1), this.playerMaterial);
    head.position.set(0.08, 1.77, 0);
    head.castShadow = true;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.035), this.accentMaterial);
    visor.position.set(0.18, 1.81, 0.3);

    const limbGeometry = new THREE.BoxGeometry(0.18, 0.7, 0.2);
    const leftLegMesh = new THREE.Mesh(limbGeometry, this.playerMaterial);
    const rightLegMesh = new THREE.Mesh(limbGeometry, this.playerMaterial);
    leftLegMesh.position.y = -0.33;
    rightLegMesh.position.y = -0.33;
    this.leftLeg.position.set(-0.2, 0.62, 0);
    this.rightLeg.position.set(0.2, 0.62, 0);
    this.leftLeg.add(leftLegMesh);
    this.rightLeg.add(rightLegMesh);

    const armGeometry = new THREE.BoxGeometry(0.14, 0.58, 0.17);
    const leftArmMesh = new THREE.Mesh(armGeometry, this.playerMaterial);
    const rightArmMesh = new THREE.Mesh(armGeometry, this.playerMaterial);
    leftArmMesh.position.y = -0.26;
    rightArmMesh.position.y = -0.26;
    this.leftArm.position.set(-0.45, 1.38, 0);
    this.rightArm.position.set(0.45, 1.38, 0);
    this.leftArm.add(leftArmMesh);
    this.rightArm.add(rightArmMesh);

    this.player.add(
      torso,
      chestMark,
      head,
      visor,
      this.leftLeg,
      this.rightLeg,
      this.leftArm,
      this.rightArm
    );
    this.player.position.x = PLAYER_X;
    this.player.rotation.y = -0.08;
    this.scene.add(this.player);
  }

  private addBox(
    group: THREE.Group,
    size: [number, number, number],
    position: [number, number, number],
    material: THREE.Material,
    rotationZ = 0
  ) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    mesh.rotation.z = rotationZ;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  private createEnvironments() {
    this.environmentGroups.forEach((group, index) => {
      group.visible = index === 0;
      this.scene.add(group);
    });

    // BUILD — drafting frames, production blocks, and an editorial skyline.
    for (let index = 0; index < 7; index += 1) {
      const cluster = new THREE.Group();
      const x = -6 + index * 4.2;
      this.addBox(cluster, [0.12, 2.8 + (index % 3) * 0.5, 0.12], [-0.8, 1.4, -2.8], this.inkMaterials[0]);
      this.addBox(cluster, [0.12, 2.2 + (index % 2) * 0.8, 0.12], [0.8, 1.1, -2.8], this.inkMaterials[0]);
      this.addBox(cluster, [1.72, 0.12, 0.12], [0, 2.65, -2.8], this.accentMaterials[0]);
      this.addBox(cluster, [0.9, 0.65, 0.5], [0.05, 0.34, -2.5], this.paperMaterials[0], index % 2 ? 0.05 : -0.05);
      cluster.position.x = x;
      this.environmentGroups[0].add(cluster);
      this.movingProps.push({ object: cluster, originX: x, parallax: 0.18, world: 0 });
    }

    // OPERATE — conveyors, rollers, pipes, and rotating workflow wheels.
    for (let index = 0; index < 7; index += 1) {
      const cluster = new THREE.Group();
      const x = -7 + index * 4.4;
      this.addBox(cluster, [2.35, 0.18, 0.7], [0, 0.5, -2.6], this.inkMaterials[1]);
      for (let roller = 0; roller < 4; roller += 1) {
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.58, 12), this.paperMaterials[1]);
        cylinder.rotation.x = Math.PI / 2;
        cylinder.position.set(-0.75 + roller * 0.5, 0.7, -2.25);
        cluster.add(cylinder);
      }
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.11, 8, 18), this.accentMaterials[1]);
      wheel.position.set(0.6, 1.75, -2.75);
      wheel.rotation.y = 0.28;
      wheel.userData.spinner = true;
      cluster.add(wheel);
      this.addBox(cluster, [0.16, 2.6, 0.16], [-0.8, 1.3, -2.9], this.inkMaterials[1]);
      cluster.position.x = x;
      this.environmentGroups[1].add(cluster);
      this.movingProps.push({ object: cluster, originX: x, parallax: 0.22, world: 1 });
    }

    // ADVISE — decision monoliths, open folios, and directional markers.
    for (let index = 0; index < 7; index += 1) {
      const cluster = new THREE.Group();
      const x = -6 + index * 4.3;
      this.addBox(cluster, [0.92, 2.1 + (index % 3) * 0.45, 0.46], [-0.62, 1.05, -2.75], this.inkMaterials[2], -0.03);
      this.addBox(cluster, [1.18, 1.45 + (index % 2) * 0.5, 0.4], [0.58, 0.73, -2.55], this.paperMaterials[2], 0.04);
      const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.75, 4), this.accentMaterials[2]);
      arrowHead.position.set(0.7, 2.35, -2.4);
      arrowHead.rotation.z = -Math.PI / 2;
      cluster.add(arrowHead);
      this.addBox(cluster, [0.85, 0.13, 0.13], [0.25, 2.35, -2.4], this.accentMaterials[2]);
      cluster.position.x = x;
      this.environmentGroups[2].add(cluster);
      this.movingProps.push({ object: cluster, originX: x, parallax: 0.16, world: 2 });
    }
  }

  private createObstacleVariant(world: number, kind: "ground" | "overhead") {
    const group = new THREE.Group();
    const ink = this.inkMaterials[world];
    const accent = this.accentMaterials[world];
    const paper = this.paperMaterials[world];

    if (world === 0 && kind === "ground") {
      this.addBox(group, [0.72, 0.38, 0.72], [0, 0.2, 0], paper, -0.08);
      this.addBox(group, [0.72, 0.38, 0.72], [0.02, 0.56, 0], ink, 0.07);
      this.addBox(group, [0.72, 0.38, 0.72], [-0.03, 0.92, 0], accent, -0.04);
    } else if (world === 0) {
      this.addBox(group, [1.15, 0.14, 0.4], [0, 1.52, 0], ink);
      this.addBox(group, [0.12, 0.66, 0.32], [-0.5, 1.25, 0], accent);
      this.addBox(group, [0.12, 0.66, 0.32], [0.5, 1.25, 0], accent);
    } else if (world === 1 && kind === "ground") {
      const gear = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.17, 8, 14), accent);
      gear.position.y = 0.58;
      gear.userData.spinner = true;
      group.add(gear);
      this.addBox(group, [0.22, 1.1, 0.28], [0, 0.55, 0], ink);
    } else if (world === 1) {
      this.addBox(group, [1.24, 0.2, 0.5], [0, 1.48, 0], accent);
      for (let index = -1; index <= 1; index += 1) {
        this.addBox(group, [0.1, 0.55, 0.12], [index * 0.42, 1.17, 0], ink);
      }
    } else if (kind === "ground") {
      this.addBox(group, [0.38, 1.32, 0.64], [-0.22, 0.66, 0], ink, -0.05);
      this.addBox(group, [0.38, 1.08, 0.64], [0.24, 0.54, 0], paper, 0.06);
      this.addBox(group, [0.11, 0.9, 0.72], [0, 0.45, 0.05], accent);
    } else {
      this.addBox(group, [1.18, 0.18, 0.42], [0, 1.48, 0], ink);
      const pointer = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.66, 4), accent);
      pointer.position.set(0, 1.12, 0);
      pointer.rotation.z = Math.PI;
      group.add(pointer);
    }
    group.visible = false;
    return group;
  }

  private createObstaclePool() {
    for (let poolIndex = 0; poolIndex < 8; poolIndex += 1) {
      const group = new THREE.Group();
      const variants: THREE.Group[] = [];
      const spinners: THREE.Object3D[] = [];
      for (let world = 0; world < VIBE_GAME_WORLDS.length; world += 1) {
        for (const kind of ["ground", "overhead"] as const) {
          const variant = this.createObstacleVariant(world, kind);
          variant.traverse((child) => {
            if (child.userData.spinner) spinners.push(child);
          });
          variants.push(variant);
          group.add(variant);
        }
      }
      group.visible = false;
      this.scene.add(group);
      this.obstacles.push({
        active: false,
        counted: false,
        group,
        kind: "ground",
        variants,
        spinners,
        x: 14,
      });
    }
  }

  private resize() {
    if (this.destroyed) return;
    const bounds = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.baseCameraFov = width < 620 ? 48 : 39;
    this.camera.fov = this.baseCameraFov;
    this.camera.position.z = width < 620 ? 11.8 : 10.2;
    this.camera.updateProjectionMatrix();
    this.renderFrame();
  }

  private onVisibilityChange = () => {
    this.documentVisible = !document.hidden;
    this.syncLoop();
  };

  private syncLoop() {
    if (this.destroyed || !this.visible || !this.documentVisible || this.phase === "dead") {
      if (this.frame) cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.lastFrameTime = 0;
      return;
    }
    if (this.frame) return;
    this.lastFrameTime = 0;
    this.frame = requestAnimationFrame(this.loop);
  }

  private loop = (timestamp: number) => {
    this.frame = 0;
    if (this.destroyed || !this.visible || !this.documentVisible) return;
    const delta = this.lastFrameTime
      ? Math.min((timestamp - this.lastFrameTime) / 1000, 0.034)
      : 1 / 60;
    this.lastFrameTime = timestamp;
    this.elapsed += delta;
    this.update(delta);
    this.renderFrame();
    if (this.phase !== "dead") this.frame = requestAnimationFrame(this.loop);
    else this.lastFrameTime = 0;
  };

  private update(delta: number) {
    if (this.phase === "running") {
      this.speed = Math.min(12.2, 9.2 + this.distance * 0.006);
      this.distance += this.speed * delta;
      this.score = Math.floor(this.distance * 4);
      this.updatePlayerPhysics(delta);

      const nextWorld = worldIndexForDistance(this.distance, WORLD_SPAN);
      if (nextWorld !== this.worldIndex && this.warpRemaining <= 0) {
        this.pendingWorldIndex = nextWorld;
        this.warpRemaining = WARP_DURATION;
        this.warpApplied = false;
        for (const obstacle of this.obstacles) this.releaseObstacle(obstacle);
        this.spawnTimer = 1;
      }
      if (this.warpRemaining <= 0) this.updateObstacles(delta);
      if (this.score !== this.lastReportedScore) {
        this.lastReportedScore = this.score;
        this.callbacks.onScore(this.score, Math.max(this.best, this.score), this.worldProgress());
      }
    } else if (this.phase === "idle") {
      this.playerY = Math.sin(this.elapsed * 1.8) * 0.045;
      this.player.position.y = this.playerY;
    }

    this.updateWorldMotion(delta);
    this.updateWarp(delta);
    this.updatePlayerAnimation(delta);
    this.updatePalette(delta);
  }

  private updatePlayerPhysics(delta: number) {
    if (!this.jumping) return;
    this.playerVelocity -= 20.5 * delta;
    this.playerY += this.playerVelocity * delta;
    if (this.playerY <= 0) {
      this.playerY = 0;
      this.playerVelocity = 0;
      this.jumping = false;
      this.jumpHeld = false;
    }
    this.player.position.y = this.playerY;
  }

  private updatePlayerAnimation(delta: number) {
    const runAmount = this.phase === "running" ? 1 : 0.24;
    const stride = Math.sin(this.elapsed * (this.phase === "running" ? 12 : 2.2)) * 0.68 * runAmount;
    this.leftLeg.rotation.x = stride;
    this.rightLeg.rotation.x = -stride;
    this.leftArm.rotation.x = -stride * 0.75;
    this.rightArm.rotation.x = stride * 0.75;
    const targetScaleY = this.ducking ? 0.58 : 1;
    this.player.scale.y += (targetScaleY - this.player.scale.y) * Math.min(1, delta * 18);
    this.player.rotation.z = this.jumping ? -0.06 : Math.sin(this.elapsed * 5) * 0.012 * runAmount;
    this.playerShadow.scale.setScalar(Math.max(0.48, 1 - this.playerY * 0.16));
    (this.playerShadow.material as THREE.MeshBasicMaterial).opacity = Math.max(0.06, 0.18 - this.playerY * 0.025);
  }

  private updateWorldMotion(delta: number) {
    const travel = this.phase === "running" ? this.speed * delta : delta * 0.42;
    for (const tile of this.groundTiles) {
      tile.position.x -= travel;
      if (tile.position.x < -11.1) tile.position.x += this.groundTiles.length * 2.02;
    }
    for (const prop of this.movingProps) {
      if (prop.world !== this.worldIndex) continue;
      prop.object.position.x -= travel * prop.parallax;
      if (prop.object.position.x < -12) prop.object.position.x += 29.5;
      prop.object.traverse((child) => {
        if (child.userData.spinner) child.rotation.z -= delta * 0.75;
      });
    }
  }

  private updateObstacles(delta: number) {
    this.spawnTimer -= delta;
    if (this.spawnTimer <= 0) {
      this.spawnObstacle();
      const difficulty = Math.min(0.55, this.distance / 800);
      this.spawnTimer = 1.55 + Math.random() * 0.72 - difficulty;
    }

    for (const obstacle of this.obstacles) {
      if (!obstacle.active) continue;
      obstacle.x -= this.speed * delta;
      obstacle.group.position.x = obstacle.x;
      for (const spinner of obstacle.spinners) spinner.rotation.z -= delta * 3.1;
      if (!obstacle.counted && obstacle.x < PLAYER_X - 0.7) obstacle.counted = true;
      if (obstacle.x < -9) this.releaseObstacle(obstacle);
      else if (this.collides(obstacle)) this.die();
    }
  }

  private spawnObstacle() {
    const obstacle = this.obstacles.find((candidate) => !candidate.active);
    if (!obstacle) return;
    const overheadChance = this.obstaclesSpawnedInWorld > 0 && this.distance > 45 ? 0.32 : 0;
    obstacle.kind = Math.random() < overheadChance ? "overhead" : "ground";
    this.obstaclesSpawnedInWorld += 1;
    obstacle.active = true;
    obstacle.counted = false;
    obstacle.x = 12.5 + Math.random() * 1.5;
    obstacle.group.position.set(obstacle.x, 0, 0.02);
    obstacle.group.visible = true;
    obstacle.variants.forEach((variant) => {
      variant.visible = false;
    });
    obstacle.variants[this.worldIndex * 2 + (obstacle.kind === "overhead" ? 1 : 0)].visible = true;
  }

  private releaseObstacle(obstacle: ObstacleRecord) {
    obstacle.active = false;
    obstacle.group.visible = false;
    obstacle.variants.forEach((variant) => {
      variant.visible = false;
    });
  }

  private collides(obstacle: ObstacleRecord) {
    // The first journey through Build and Operate is an onboarding lap: the
    // obstacles teach timing visually, then become lethal once all three brand
    // worlds have been reached. This keeps the narrative discoverable without
    // removing the runner's real collision/death loop.
    return hasRunnerCollision({
      obstacleX: obstacle.x,
      playerX: PLAYER_X,
      playerY: this.playerY,
      ducking: this.ducking,
      obstacleKind: obstacle.kind,
      phase: this.phase,
      visitedCount: this.visited.size,
    });
  }

  private updateWarp(delta: number) {
    if (this.warpRemaining <= 0) {
      this.finishWarpVisuals();
      return;
    }
    this.warpRemaining = Math.max(0, this.warpRemaining - delta);
    const t = 1 - this.warpRemaining / WARP_DURATION;
    const intensity = Math.sin(t * Math.PI);
    this.warpStreaks.visible = true;
    this.warpVeil.visible = true;
    this.warpGate.visible = true;
    this.warpMaterial.opacity = intensity * 0.82;
    this.warpMaterial.color.set(PALETTES[this.pendingWorldIndex].accent);
    this.warpVeilMaterial.color.set(PALETTES[this.pendingWorldIndex].accent);
    this.warpVeilMaterial.opacity = intensity * 0.16;
    this.warpGateMaterial.color.set(PALETTES[this.pendingWorldIndex].accent);
    this.warpGateMaterial.opacity = intensity * 0.84;
    this.warpGate.scale.setScalar(0.35 + t * 3.1);
    this.warpGate.rotation.z = Math.PI / 4 + t * 0.42;

    if (!this.warpApplied && t >= 0.45) {
      this.warpApplied = true;
      this.activateWorld(this.pendingWorldIndex, true);
    }

    for (let index = 0; index < this.warpSeeds.length; index += 1) {
      const seed = this.warpSeeds[index];
      const x = 11 - ((t * 25 + seed[0] * 20) % 22);
      const y = -0.1 + seed[1] * 5.6;
      const z = -3.5 + seed[2] * 7;
      this.tempPosition.set(x, y, z);
      this.tempScale.set(1 + intensity * (2.2 + seed[2] * 2.4), 1, 1);
      this.tempMatrix.compose(this.tempPosition, this.tempQuaternion, this.tempScale);
      this.warpStreaks.setMatrixAt(index, this.tempMatrix);
    }
    this.warpStreaks.instanceMatrix.needsUpdate = true;
    this.camera.fov += ((this.baseCameraFov + intensity * 8) - this.camera.fov) * Math.min(1, delta * 14);
    this.camera.updateProjectionMatrix();
  }

  private updatePalette(delta: number) {
    const background = this.scene.background as THREE.Color;
    background.lerp(this.targetBackground, Math.min(1, delta * 3.4));
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.lerp(this.targetFog, Math.min(1, delta * 3.4));
    }
    this.playerMaterial.color.lerp(this.palettePlayerColors[this.worldIndex], Math.min(1, delta * 5));
    this.accentMaterial.color.lerp(this.paletteAccentColors[this.worldIndex], Math.min(1, delta * 5));
    this.groundMaterial.color.lerp(this.paletteGroundColors[this.worldIndex], Math.min(1, delta * 4));
    this.keyLight.color.lerp(this.palettePaperColors[this.worldIndex], Math.min(1, delta * 2.5));
    this.camera.position.y = 3.25 + Math.sin(this.elapsed * 0.65) * (this.phase === "idle" ? 0.06 : 0.025);
  }

  private renderFrame() {
    if (this.destroyed) return;
    this.renderer.render(this.scene, this.camera);
  }

  private worldProgress() {
    return (this.distance % WORLD_SPAN) / WORLD_SPAN;
  }

  private snapshot(): VibeGameSnapshot {
    return {
      phase: this.phase,
      world: VIBE_GAME_WORLDS[this.worldIndex],
      worldIndex: this.worldIndex,
      score: this.score,
      best: Math.max(this.best, this.score),
      progress: this.worldProgress(),
      visited: VIBE_GAME_WORLDS.filter((world) => this.visited.has(world)),
    };
  }

  private emitState() {
    this.callbacks.onState(this.snapshot());
  }

  private activateWorld(index: number, announce: boolean) {
    this.worldIndex = index;
    this.pendingWorldIndex = index;
    this.environmentGroups.forEach((group, groupIndex) => {
      group.visible = groupIndex === index;
    });
    if (announce && this.phase === "running") {
      for (const obstacle of this.obstacles) this.releaseObstacle(obstacle);
      this.spawnTimer = Math.max(this.spawnTimer, 0.9);
      this.obstaclesSpawnedInWorld = 0;
    }
    for (const prop of this.movingProps) {
      if (prop.world === index && Math.abs(prop.object.position.x) > 18) {
        prop.object.position.x = prop.originX;
      }
    }
    this.targetBackground.set(PALETTES[index].paper);
    this.targetFog.set(PALETTES[index].fog);
    if (this.phase === "running") this.visited.add(VIBE_GAME_WORLDS[index]);
    if (announce) this.callbacks.onWorld(VIBE_GAME_WORLDS[index], index);
    this.emitState();
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!this.visible) return;
    const gameRoot = this.canvas.closest("[data-vibe-game]");
    const activeElement = document.activeElement;
    const gameFocused = activeElement === this.canvas;
    const focusInsideGame = activeElement instanceof Element && Boolean(gameRoot?.contains(activeElement));
    if (!shouldHandleGameKey({ code: event.code, phase: this.phase, gameFocused, focusInsideGame })) return;
    if (event.code === "Space" || event.code === "ArrowUp") {
      event.preventDefault();
      if (!event.repeat) this.startOrJump();
      this.jumpHeld = true;
    } else if (event.code === "ArrowDown") {
      if (this.phase !== "running") return;
      event.preventDefault();
      this.setDuck(true);
    } else if (event.code === "Escape" && this.phase !== "idle") {
      event.preventDefault();
      this.resetToIdle();
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
      this.jumpHeld = false;
      this.endJump();
    } else if (event.code === "ArrowDown") {
      this.setDuck(false);
    }
  };

  private onCanvasPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    this.canvas.focus({ preventScroll: true });
    this.startOrJump();
  };

  startOrJump() {
    if (this.phase === "idle") {
      this.begin();
      return;
    }
    if (this.phase === "dead") {
      this.restart();
      return;
    }
    if (!this.jumping && !this.ducking) {
      this.jumping = true;
      this.jumpHeld = true;
      this.playerVelocity = 7.85;
    }
  }

  endJump() {
    if (this.jumping && !this.jumpHeld && this.playerVelocity > 3.1) this.playerVelocity = 3.1;
  }

  setDuck(active: boolean) {
    if (this.phase !== "running") {
      this.ducking = false;
      return;
    }
    this.ducking = active;
    if (active && this.jumping) this.playerVelocity = Math.min(this.playerVelocity, -7.5);
  }

  begin() {
    this.phase = "running";
    this.distance = 0;
    this.score = 0;
    this.speed = 9.2;
    this.spawnTimer = 3.05;
    this.obstaclesSpawnedInWorld = 0;
    this.visited = new Set([VIBE_GAME_WORLDS[0]]);
    this.activateWorld(0, false);
    this.cancelWarp();
    this.callbacks.onWorld(VIBE_GAME_WORLDS[0], 0);
    this.emitState();
    this.syncLoop();
  }

  restart() {
    for (const obstacle of this.obstacles) this.releaseObstacle(obstacle);
    this.playerY = 0;
    this.playerVelocity = 0;
    this.jumping = false;
    this.ducking = false;
    this.player.position.y = 0;
    this.begin();
  }

  resetToIdle() {
    for (const obstacle of this.obstacles) this.releaseObstacle(obstacle);
    this.phase = "idle";
    this.distance = 0;
    this.score = 0;
    this.playerY = 0;
    this.playerVelocity = 0;
    this.jumping = false;
    this.ducking = false;
    this.visited.clear();
    this.activateWorld(0, false);
    this.cancelWarp();
    this.callbacks.onWorld(VIBE_GAME_WORLDS[0], 0);
    this.callbacks.onScore(0, this.best, 0);
    this.emitState();
    this.syncLoop();
  }

  previewWorld(index: number) {
    if (this.phase !== "idle") return;
    const requestedIndex = clampWorldIndex(index);
    this.pendingWorldIndex = requestedIndex;
    if (requestedIndex === this.worldIndex) {
      this.warpRemaining = 0;
      this.warpApplied = false;
      this.finishWarpVisuals();
      return;
    }
    this.warpRemaining = WARP_DURATION * 0.78;
    this.warpApplied = false;
  }

  private die() {
    if (this.phase !== "running") return;
    this.phase = "dead";
    this.ducking = false;
    this.best = Math.max(this.best, this.score);
    writeBestScore(this.best);
    this.emitState();
  }

  private finishWarpVisuals() {
    this.warpStreaks.visible = false;
    this.warpVeil.visible = false;
    this.warpGate.visible = false;
    if (this.camera.fov !== this.baseCameraFov) {
      this.camera.fov = this.baseCameraFov;
      this.camera.updateProjectionMatrix();
    }
  }

  private cancelWarp() {
    this.warpRemaining = 0;
    this.warpApplied = false;
    this.pendingWorldIndex = this.worldIndex;
    this.finishWarpVisuals();
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.lastFrameTime = 0;
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.canvas.removeEventListener("pointerdown", this.onCanvasPointerDown);

    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh || object instanceof THREE.LineSegments)) return;
      if ("geometry" in object && object.geometry instanceof THREE.BufferGeometry) geometries.add(object.geometry);
      if (!("material" in object)) return;
      const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of objectMaterials) {
        if (material instanceof THREE.Material) materials.add(material);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.scene.clear();
  }
}
