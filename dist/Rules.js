"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinterError_1 = require("./LinterError");
var Rules = (function () {
    function Rules() {
    }
    Rules.run = function (ctx) {
        ctx.content.forEach(function (line, index) {
            Rules.lineLimit(line, index, ctx);
            Rules.assignmentOnSameLine(line, index, ctx);
            Rules.queryStructure(line, index, ctx);
            Rules.queryWithoutCondition(line, index, ctx);
        });
    };
    Rules.lineLimit = function (line, index, ctx) {
        if (line.length > 120) {
            ctx.addError(new LinterError_1.LinterError(index + 1, 'Line exceeds the limit of 120 characters.'));
        }
    };
    Rules.assignmentOnSameLine = function (line, index, ctx) {
        if (line.match(/^(\t+|\s+)=/g) || line.match(/=(\s|\t)*$/g)) {
            ctx.addError(new LinterError_1.LinterError(index + 1, 'Assignments must be on the same line.'));
        }
    };
    Rules.queryStructure = function (line, index, ctx) {
        if (line.match(/(where.+)?(and|limit).*\]/i) || line.match(/,\s*\w+(\s+)?(\n*)?from/i)) {
            ctx.addError(new LinterError_1.LinterError(index + 1, 'SOQL query with more than one condition and/or field being searched should be splitted into multiple lines.'));
        }
    };
    Rules.queryWithoutCondition = function (line, index, ctx) {
        if (ctx.getSOQLCount() > 0) {
            if (line.match(/from \w+\s*\]/i)) {
                ctx.addError(new LinterError_1.LinterError(index + 1, 'SOQL query without condition.'));
            }
        }
    };
    return Rules;
}());
exports.Rules = Rules;
