import fs from "fs-extra";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.copySync(path.join(__dirname, "../LICENSE"), "./LICENSE");
