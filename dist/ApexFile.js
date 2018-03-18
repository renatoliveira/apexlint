"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Context_1 = require("./Context");
var ApexFile = (function () {
    function ApexFile(filePath) {
        this.filePath = filePath;
        this.analyze(this.loadFile());
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
    };
    ApexFile.prototype.report = function () {
        return this.mainContext.getErrors();
    };
    ApexFile.prototype.replaceStrings = function (fileAsString) {
        return fileAsString.replace(/'.{1,}'/g, '');
    };
    return ApexFile;
}());
exports.ApexFile = ApexFile;
