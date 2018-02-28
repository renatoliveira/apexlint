import * as fs from "fs"
import * as file from "./file"

if (process.argv.length < 3) {
    console.error("❗️ Should specify which file or folder to run.")
}

var mode: String = null
var pathString: fs.PathLike = process.argv[2]

if (fs.lstatSync(pathString).isDirectory()) {
    console.log("📂 Running on folder " + process.argv[2] + "...")
    fs.readdir(pathString, (err, files) => {
        files.forEach(fileOnFolder => {
            var apexfile = new file.ApexFile(pathString + '/' + fileOnFolder)
        })
    })
} else {
    console.log("📄 Running on file " + process.argv[2] + "...")
    var apexfile = new file.ApexFile(pathString)
}
