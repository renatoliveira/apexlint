import * as fs from "fs"
import { ApexFile } from "./ApexFile"
import { Results } from "./Results"
import { LinterError } from "./LinterError";

if (process.argv.length < 3) {
    console.error("❗️ Should specify which file or folder to run.")
}

var mode: String = null
var pathString: fs.PathLike = process.argv[2]

Results.errors = new Array<LinterError>()

if (fs.lstatSync(pathString).isDirectory()) {
    console.log("📂 Running on folder " + process.argv[2] + "...")
    fs.readdir(pathString, (err, files) => {
        files.forEach(fileOnFolder => {
            var apexfile = new ApexFile(pathString + '/' + fileOnFolder)
            Results.errors.concat(apexfile.report())
        })
    })
} else {
    console.log("📄 Running on file " + process.argv[2] + "...")
    var apexfile = new ApexFile(pathString)
    Results.errors.concat(apexfile.report())
}

Results.report()
