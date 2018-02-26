import * as fs from "fs"
import * as file from "./file"

if (process.argv.length < 3) {
    console.error("❗️ Should specify which file or folder to run.")
}
var mode: String = null;

if (process.argv[2].search('\\.cls') != -1) {
    console.log("📄 Running on " + process.argv[2] + "...")
    mode = 'file';
} else if (process.argv[2].charAt(process.argv[2].length-1) == '/') {
    console.log("📂 Running on folder " + process.argv[2] + "...")
    mode = 'folder';
}
