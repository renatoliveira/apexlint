#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var ApexFile_1 = require("./ApexFile");
var mode = null;
var pathString = process.argv[2];
var processedFiles = new Array();
var filesWithErrorsCount = 0;
if (process.argv.length < 3) {
    console.error("❗️  Should specify which file or folder to run.");
    process.exit();
}
if (fs.lstatSync(pathString).isDirectory()) {
    console.log("Running on folder " + process.argv[2] + "...");
    fs.readdirSync(pathString).forEach(function (file) {
        if (file.match(/\.cls$/i)) {
            var classFile = new ApexFile_1.ApexFile(file, pathString + '/' + file);
            processedFiles.push(classFile);
        }
    });
}
else {
    console.log("Running on file " + process.argv[2] + "...");
    var apexfile = new ApexFile_1.ApexFile(process.argv[2], pathString);
    processedFiles.push(apexfile);
}
processedFiles.forEach(function (file) {
    if (file.getErrorCount() > 0) {
        filesWithErrorsCount++;
    }
    file.printReport();
});
if (processedFiles.length > 1) {
    var passingFiles = processedFiles.length - filesWithErrorsCount;
    var passingPercentage = (filesWithErrorsCount * 100) / processedFiles.length;
    console.log("\n\t" + (processedFiles.length - filesWithErrorsCount) + "/" + processedFiles.length + " (" + passingPercentage + "%) passing\n");
}
