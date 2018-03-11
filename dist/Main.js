#! /usr/local/bin/node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var ApexFile_1 = require("./ApexFile");
var Results_1 = require("./Results");
if (process.argv.length < 3) {
    console.error("❗️ Should specify which file or folder to run.");
    process.exit();
}
var mode = null;
var pathString = process.argv[2];
var errors = new Results_1.Results();
if (fs.lstatSync(pathString).isDirectory()) {
    console.log("📂 Running on folder " + process.argv[2] + "...");
    fs.readdir(pathString, function (err, files) {
        files.forEach(function (fileOnFolder) {
            if (fileOnFolder.match(/cls$/g)) {
                var apexfile = new ApexFile_1.ApexFile(pathString + '/' + fileOnFolder);
                errors.addErrors(apexfile.report());
            }
        });
    });
}
else {
    console.log("📄 Running on file " + process.argv[2] + "...");
    var apexfile = new ApexFile_1.ApexFile(pathString);
    errors.addErrors(apexfile.report());
}
errors.report();
