"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RuleViolation = (function () {
    function RuleViolation(errorCode, errorMessage, lineNumber, content) {
        if (lineNumber) {
            this.lineNumber = lineNumber;
        }
        if (content) {
            this.lineContent = content;
        }
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
    }
    RuleViolation.prototype.toString = function () {
        return this.errorCode + " at " + this.lineNumber + ": " + this.errorMessage;
    };
    RuleViolation.prototype.getLineNumber = function () {
        return this.lineNumber;
    };
    RuleViolation.prototype.getLineContent = function () {
        return this.lineContent;
    };
    return RuleViolation;
}());
exports.RuleViolation = RuleViolation;
