#!/usr/bin/env node
import * as fs from "fs"
import { ApexFile } from "./ApexFile"
import { LinterError } from "./RuleViolation";
import chalk from "chalk";

var mode: String = null
var pathString: fs.PathLike = process.argv[2]
var processedFiles: Array<ApexFile> = new Array<ApexFile>()
var filesWithErrorsCount: number = 0

if (process.argv.length < 3) {
    console.log(chalk.yellow('\n\tShould specify a file or folder.') + '\n\n\tUsage:\n\t\t\'apexlint <folder/file>\'\n')
    process.exit()
}
try {
    if (fs.lstatSync(pathString).isDirectory()) {
        console.log("Running on folder " + process.argv[2] + "...")
        fs.readdirSync(pathString).forEach(file => {
            if (file.match(/\.cls$/i)) {
                let classFile = new ApexFile(file, pathString + '/' + file)
                processedFiles.push(classFile)
            }
        })
    } else {
        console.log("Running on file " + process.argv[2] + "...")
        var apexfile = new ApexFile(process.argv[2], pathString)
        processedFiles.push(apexfile)
    }
} catch (error) {
    console.log(chalk.red(error))
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
    console.log(`\n\t${processedFiles.length - filesWithErrorsCount}/${processedFiles.length} (${passingPercentage.toFixed(2)}%) passing\n`)
}
