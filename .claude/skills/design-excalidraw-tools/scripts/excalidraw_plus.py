"""excalidraw_plus — publish and screenshot through the Excalidraw+ MCP HTTP endpoint.

Works when the MCP tools are not exposed in the host. The API key is read from the EXCALIDRAW_API_KEY environment
variable (never pass it on the command line, never commit it).

    python excalidraw_plus.py collections
    python excalidraw_plus.py create --collection <id> --name "Process map V1"
    python excalidraw_plus.py push diagram.excalidraw --scene <id> [--replace]
    python excalidraw_plus.py screenshot --scene <id> --out shot.png [--max-width 1920]

Options: --endpoint (default https://api.excalidraw.com/api/v1/mcp). Retries on HTTP 429 with backoff.
"""
import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request

DROP = {"id", "index", "seed", "version", "versionNonce", "updated", "boundElements", "frameId", "link", "locked",
        "autoResize", "lastCommittedPoint", "isDeleted", "containerId", "elbowed", "baseFontSize", "labelPosition",
        "polygon"}
CHUNK = 90


class Client:
    def __init__(self, endpoint):
        self.endpoint = endpoint
        self.key = os.environ.get("EXCALIDRAW_API_KEY")
        if not self.key:
            sys.exit("EXCALIDRAW_API_KEY is not set")
        self.rid = 0

    def call(self, name, args):
        self.rid += 1
        body = json.dumps({"jsonrpc": "2.0", "id": self.rid, "method": "tools/call",
                           "params": {"name": name, "arguments": args}}).encode()
        for attempt in range(6):
            req = urllib.request.Request(self.endpoint, data=body, method="POST", headers={
                "Authorization": f"Bearer {self.key}", "Content-Type": "application/json",
                "Accept": "application/json, text/event-stream"})
            try:
                with urllib.request.urlopen(req, timeout=180) as r:
                    raw = r.read().decode()
                break
            except urllib.error.HTTPError as e:
                if e.code == 429 and attempt < 5:
                    time.sleep(2 * (attempt + 1))
                    continue
                raise
        if raw.startswith("event:") or "\ndata:" in raw or raw.startswith("data:"):
            datas = [l[5:].strip() for l in raw.splitlines() if l.startswith("data:")]
            raw = datas[-1] if datas else raw
        res = json.loads(raw)
        if res.get("error") or (res.get("result", {}).get("isError")):
            raise RuntimeError(json.dumps(res, ensure_ascii=False)[:1500])
        time.sleep(0.5)
        return res["result"]


def text_of(result):
    return next((c.get("text", "") for c in result.get("content", []) if c.get("type") == "text"), "")


def clean(elements):
    out = []
    for e in elements:
        if e.get("isDeleted"):
            continue
        c = {k: v for k, v in e.items() if k not in DROP and v is not None}
        if c.get("type") == "text":
            c.pop("originalText", None)
        out.append(c)
    return out


def wipe(cl, scene):
    doc = json.loads(text_of(cl.call("get_scene_content", {"sceneId": scene})))
    ids = [e["id"] for e in doc.get("elements", []) if not e.get("isDeleted")]
    for i in range(0, len(ids), CHUNK):
        part = ids[i:i + CHUNK]
        try:
            cl.call("edit_scene_content", {"sceneId": scene, "delete": part})
        except RuntimeError as err:
            if "ound" not in str(err):          # "Bound arrow …" : stale bindings left by an earlier edit
                raise
            patches = [{"id": x, "boundElements": [], "containerId": None} for x in part]
            cl.call("edit_scene_content", {"sceneId": scene, "update": json.dumps(patches)})
            cl.call("edit_scene_content", {"sceneId": scene, "delete": part})
    return len(ids)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("command", choices=["collections", "create", "push", "screenshot"])
    ap.add_argument("file", nargs="?")
    ap.add_argument("--scene")
    ap.add_argument("--collection")
    ap.add_argument("--name")
    ap.add_argument("--replace", action="store_true")
    ap.add_argument("--out")
    ap.add_argument("--max-width", type=int, default=1920)
    ap.add_argument("--endpoint", default="https://api.excalidraw.com/api/v1/mcp")
    a = ap.parse_args()
    cl = Client(a.endpoint)

    if a.command == "collections":
        print(text_of(cl.call("list_collections", {})))
    elif a.command == "create":
        if not (a.collection and a.name):
            sys.exit("create needs --collection and --name")
        res = json.loads(text_of(cl.call("create_scene", {"name": a.name, "collectionId": a.collection, "pinned": False})))
        sid = res.get("sceneId") or res.get("id") or res.get("metadata", {}).get("id")
        print(json.dumps({"sceneId": sid, "url": res.get("url")}, ensure_ascii=False))
    elif a.command == "push":
        if not (a.file and a.scene):
            sys.exit("push needs a file and --scene")
        els = clean(json.load(open(a.file, encoding="utf-8"))["elements"])
        if a.replace:
            print("deleted", wipe(cl, a.scene), "existing elements")
        for i in range(0, len(els), CHUNK):
            cl.call("edit_scene_content", {"sceneId": a.scene, "add": json.dumps(els[i:i + CHUNK], ensure_ascii=False)})
        print("pushed", len(els), "elements")
    elif a.command == "screenshot":
        if not (a.scene and a.out):
            sys.exit("screenshot needs --scene and --out")
        res = cl.call("take_screenshot", {"sceneId": a.scene, "maxWidth": a.max_width})
        img = next((c for c in res.get("content", []) if c.get("type") == "image"), None)
        if not img:
            sys.exit("no image returned: " + text_of(res)[:300])
        with open(a.out, "wb") as f:
            f.write(base64.b64decode(img["data"]))
        print("saved", a.out)


if __name__ == "__main__":
    main()
