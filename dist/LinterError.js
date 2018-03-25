"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinterError = (function () {
    function LinterError(lineNumber, errorMessage, content) {
        if (lineNumber) {
            this.lineNumber = lineNumber;
        }
        if (errorMessage) {
            this.errorMessage = errorMessage;
        }
        if (content) {
            this.lineContent = content;
        }
    }
    LinterError.prototype.toString = function () {
        return this.lineNumber + ": " + this.errorMessage;
    };
    LinterError.prototype.getLineNumber = function () {
        return this.lineNumber;
    };
    LinterError.prototype.getLineContent = function () {
        return this.lineContent;
    };
    return LinterError;
}());
exports.LinterError = LinterError;
