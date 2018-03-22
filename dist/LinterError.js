"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinterError = (function () {
    function LinterError(lineNumber, message) {
        if (lineNumber) {
            this.lineError = lineNumber;
        }
        if (message) {
            this.message = message;
        }
    }
    LinterError.prototype.toString = function () {
        return this.lineError + ": " + this.message;
    };
    LinterError.prototype.getLine = function () {
        return this.lineError;
    };
    return LinterError;
}());
exports.LinterError = LinterError;
