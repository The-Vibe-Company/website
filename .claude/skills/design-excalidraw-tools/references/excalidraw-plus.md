# Publishing and screenshots

Contents: with the MCP · without the MCP (HTTP) · scenes and versions · pitfalls · without Excalidraw+.

## With the Excalidraw+ MCP

Useful tools: `list_collections` (a scene needs a `collectionId`), `create_scene`, `edit_scene_content`, `get_scene_content`, `take_screenshot`, `delete_scene`. Read the server's `read_freeform_format` guide once if you hand-edit elements; for generated diagrams the push script does the work.

`create_scene` needs `collectionId`; some servers also require `pinned` (pass `false`).

## Without the MCP tools (HTTP fallback)

Some hosts show the server as connected but expose zero tools. The same server answers JSON-RPC over HTTP:

```
POST <endpoint>   (default https://api.excalidraw.com/api/v1/mcp)
Authorization: Bearer $EXCALIDRAW_API_KEY
Accept: application/json, text/event-stream
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"take_screenshot","arguments":{"sceneId":"…"}}}
```

`scripts/excalidraw_plus.py` wraps this:

```bash
export EXCALIDRAW_API_KEY=…            # never write the key into the skill or the repo
python scripts/excalidraw_plus.py collections
python scripts/excalidraw_plus.py create --collection <id> --name "Process map V1"
python scripts/excalidraw_plus.py push diagram.excalidraw --scene <id> [--replace]
python scripts/excalidraw_plus.py screenshot --scene <id> --out shot.png
```

`push` strips volatile fields, sends elements in chunks of 90, and with `--replace` deletes the existing elements first so the URL stays the same.

## Scenes and versions

- One scene per version (V1, V2…); republish in place while iterating on that version; never overwrite the one shown in a meeting.
- A temporary draft scene is fine for render checks; delete it when done, but only scenes you created in this session, and say so.
- Sharing (`share_scene`) creates a link anyone can open: only on explicit request, and say that it is public.

## Pitfalls

- **429 Too Many Requests** after a few back-to-back calls: space calls by 2–4 s (the script retries with backoff).
- **Stale bindings**: deleting an element whose `boundElements` points to an already-deleted arrow is refused. Update the element with `boundElements: []` (and `containerId: null` for its text), then delete. The script does this automatically on `--replace`.
- **Images referencing missing files** block every edit on the scene: update the image element with `fileId: null`, then retry.
- **Unbound arrows** are fine for generated diagrams (they are regenerated, not dragged); bind them only for scenes humans will rearrange.
- **Text widths** are estimated by the generator and drawn as stored: neither Excalidraw+ nor the local renderer re-measures them. Keep 10–15 % slack in cards, and use `render_scene.mjs --text-report` to see where the estimate is far from the real font.
- **Local previews** that need a dev server may be blocked in some hosts; the Excalidraw+ screenshot is the reliable render.

## Without Excalidraw+

Write the `.excalidraw` file, tell the user to drag it onto excalidraw.com or open it in an Excalidraw editor plugin. Do not upload it to a public share service without asking: share links are public.
