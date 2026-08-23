const fs = require("fs");
const path = require("path");

const JSON_ENDPOINTS = new Set([
  "info",
  "package",
  "posts/list",
  "posts/info",
  "playlists/list",
  "playlists/info",
  "levels/list",
  "levels/info",
  "levels/result/info",
  "skins/list",
  "skins/info",
  "backgrounds/list",
  "backgrounds/info",
  "effects/list",
  "effects/info",
  "particles/list",
  "particles/info",
  "engines/list",
  "engines/info",
  "replays/list",
  "replays/info"
]);

module.exports = (req, res) => {
  const raw = req.query.path;

  if (!raw) {
    return res.status(400).json({ error: "missing path" });
  }

  const relative = Array.isArray(raw) ? raw.join("/") : raw;
  const safe = path.normalize(relative).replace(/^(\.\.(\/|\\|$))+/, "");

  const file = path.join(process.cwd(), "sonolus", safe);

  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return res.status(404).json({ error: "not found" });
  }

  const data = fs.readFileSync(file);

  if (JSON_ENDPOINTS.has(safe)) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
  } else {
    res.setHeader("Content-Type", "application/octet-stream");
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).send(data);
};
