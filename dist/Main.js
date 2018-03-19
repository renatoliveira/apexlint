#! /usr/local/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var ApexFile_1 = require("./ApexFile");
var mode = null;
var pathString = process.argv[2];
var processedFiles = new Array();
if (process.argv.length < 3) {
    console.error("❗️  Should specify which file or folder to run.");
    process.exit();
}
if (fs.lstatSync(pathString).isDirectory()) {
    console.log("📂  - Running on folder " + process.argv[2] + "...");
    fs.readdirSync(pathString).forEach(function (file) {
        var classFile = new ApexFile_1.ApexFile(file, pathString + '/' + file);
        processedFiles.push(classFile);
    });
}
else {
    console.log("📄  - Running on file " + process.argv[2] + "...");
    var apexfile = new ApexFile_1.ApexFile(process.argv[2], pathString);
    processedFiles.push(apexfile);
}
processedFiles.forEach(function (file) {
    file.printReport();
});
