"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Context_1 = require("./Context");
var ApexFile = (function () {
    function ApexFile(fileName, filePath) {
        this.errors = new Array();
        if (fileName && filePath) {
            this.fileName = fileName;
            this.filePath = filePath;
            this.analyze(this.loadFile());
        }
    }
    ApexFile.prototype.loadFile = function () {
        try {
            var fileToRead = fs.readFileSync(this.filePath, 'utf-8');
            return fileToRead;
        }
        catch (e) {
            console.error("❗️ File '" + this.filePath + "' couldn't be read.");
        }
        return '';
    };
    ApexFile.prototype.analyze = function (fileAsString) {
        fileAsString = this.replaceStrings(fileAsString);
        this.mainContext = new Context_1.Context(fileAsString.split('\n'));
        this.errors = this.mainContext.getErrors();
    };
    ApexFile.prototype.replaceStrings = function (fileAsString) {
        return fileAsString.replace(/'.{1,}'/g, '');
    };
    ApexFile.prototype.getName = function () {
        return this.fileName;
    };
    ApexFile.prototype.printReport = function () {
        if (this.errors.length > 0 && process.exitCode != -1) {
            process.exitCode = -1;
        }
        if (this.errors.length == 0) {
            console.log(this.fileName + ' ✅  No errors found.');
        }
        else {
            console.log('\n' + this.fileName + ':\n');
            this.errors.forEach(function (error) {
                console.log('\t❌  ' + error);
            });
            console.log('\n');
        }
    };
    ApexFile.prototype.getErrorCount = function () {
        return this.errors.length;
    };
    return ApexFile;
}());
exports.ApexFile = ApexFile;
