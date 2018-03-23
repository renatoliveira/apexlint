#! /usr/local/bin/node
import * as fs from "fs"
import { ApexFile } from "./ApexFile"
import { LinterError } from "./LinterError";

var mode: String = null
var pathString: fs.PathLike = process.argv[2]
var processedFiles: Array<ApexFile> = new Array<ApexFile>()
var filesWithErrorsCount: number = 0

if (process.argv.length < 3) {
    console.error("❗️  Should specify which file or folder to run.")
    process.exit()
}
if (fs.lstatSync(pathString).isDirectory()) {
    console.log("📂  - Running on folder " + process.argv[2] + "...")
    fs.readdirSync(pathString).forEach(file => {
        if (file.match(/\.cls$/i)) {
            let classFile = new ApexFile(file, pathString + '/' + file)
            processedFiles.push(classFile)
        }
    })
} else {
    console.log("📄  - Running on file " + process.argv[2] + "...")
    var apexfile = new ApexFile(process.argv[2], pathString)
    processedFiles.push(apexfile)
}
processedFiles.forEach(file => {
    if (file.getErrorCount() > 0) {
        filesWithErrorsCount++
    }
    file.printReport()
})

if (processedFiles.length > 1) {
    let passingFiles: number = processedFiles.length - filesWithErrorsCount
    let passingPercentage: number = (filesWithErrorsCount * 100) / processedFiles.length
    console.log(`\n\t${processedFiles.length - filesWithErrorsCount}/${processedFiles.length} (${passingPercentage}%) passing\n`)
}
