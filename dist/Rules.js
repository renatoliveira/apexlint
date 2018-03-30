"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RuleViolation_1 = require("./RuleViolation");
var Rules = (function () {
    function Rules() {
    }
    Rules.run = function (ctx) {
        ctx.getContent().forEach(function (line, index) {
            Rules.lineLimit(line, index, ctx);
            Rules.queryStructure(line, index, ctx);
            Rules.lineWithTODO(line, index, ctx);
            Rules.queryWithoutCondition(line, index, ctx);
            Rules.whiteSpace(line, index, ctx);
        });
    };
    Rules.queryStructure = function (line, index, ctx) {
        if (line.match(/(where.+)?(and|limit).*\]/i) || line.match(/,\s*\w+(\s+)?(\n*)?from/i)) {
            if (this.isIgnored(ctx, index, 'W0001'))
                return;
            ctx.addError(new RuleViolation_1.RuleViolation('W0001', 'SOQL query with more than one condition and/or field being searched should be splitted into multiple lines.', index + 1, line));
        }
    };
    Rules.queryWithoutCondition = function (line, index, ctx) {
        if (ctx.getSOQLCount() > 0) {
            if (line.match(/from \w+\s*\]/i)) {
                if (this.isIgnored(ctx, index, 'W0002'))
                    return;
                ctx.addError(new RuleViolation_1.RuleViolation('W0002', 'SOQL query without condition.', index + 1, line));
            }
        }
    };
    Rules.lineWithTODO = function (line, index, ctx) {
        if (line.match(/\/\/\s?TODO\s?:/gi)) {
            ctx.foundTodo();
            if (!this.isIgnored(ctx, index, 'W0003')) {
                ctx.addError(new RuleViolation_1.RuleViolation('W0003', 'TODO found, with missing feature.', index + 1, line));
            }
        }
    };
    Rules.whiteSpace = function (line, index, ctx) {
        if (line.search('if\\(') != -1) {
            if (this.isIgnored(ctx, index, 'W0004'))
                return;
            ctx.addError(new RuleViolation_1.RuleViolation('W0004', 'Missing space between "if" and "(".', index + 1, line));
        }
        if (line.search('for\\(') != -1) {
            if (this.isIgnored(ctx, index, 'W0005'))
                return;
            ctx.addError(new RuleViolation_1.RuleViolation('W0005', 'Missing space between "for" and "(".', index + 1, line));
        }
        if (line.search('else\\{') != -1) {
            if (this.isIgnored(ctx, index, 'W0006'))
                return;
            ctx.addError(new RuleViolation_1.RuleViolation('W0006', 'Missing space between "else" and "{".', index + 1, line));
        }
        if (line.search('\\}else') != -1) {
            if (this.isIgnored(ctx, index, 'W0007'))
                return;
            ctx.addError(new RuleViolation_1.RuleViolation('W0007', 'Missing space between "}" and "else".', index + 1, line));
        }
    };
    Rules.bracketsDontMatch = function (index, ctx) {
        if (this.isIgnored(ctx, index, 'E0001'))
            return;
        ctx.addError(new RuleViolation_1.RuleViolation('E0001', 'Brackets ("{" and "}") count don\'t match.', index + 1, ctx.getContent()[index]));
    };
    Rules.invalidClass = function (index, ctx) {
        ctx.addError(new RuleViolation_1.RuleViolation('E0002', 'Class is invalid.', index + 1, ctx.getContent()[index]));
    };
    Rules.lineLimit = function (line, index, ctx) {
        if (this.isIgnored(ctx, index, 'E0003'))
            return;
        if (line.length > 120) {
            ctx.addError(new RuleViolation_1.RuleViolation('E0003', 'Line exceeds the limit of 120 characters.', index + 1, line));
        }
    };
    Rules.inlineSOQLInsideLoop = function (line, index, ctx) {
        if (this.isIgnored(ctx, index, 'E0004'))
            return;
        ctx.addError(new RuleViolation_1.RuleViolation('E0004', 'SOQL inside loops are not allowed.', index + 1, line));
    };
    Rules.isIgnored = function (ctx, lineNumber, errorCode) {
        var lineAbove = this.getLineAboveCurrentScope(ctx)
            || ctx.getContent()[lineNumber - 1];
        if (lineAbove !== undefined
            && lineAbove.toLowerCase().match(/\/\/\s*linter-ignore-((W|E)\d{4},?\s?)*/g) !== null) {
            var codes = lineAbove.toLowerCase().match(/(W|E)\d{4}/gi);
            if (codes) {
                for (var _i = 0, codes_1 = codes; _i < codes_1.length; _i++) {
                    var code = codes_1[_i];
                    if (code.toLowerCase() === errorCode.toLowerCase()) {
                        ctx.addIgnoredError(new RuleViolation_1.RuleViolation(errorCode, '', lineNumber));
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Rules.getLineAboveCurrentScope = function (ctx) {
        var parentContext = ctx.getParentContext();
        var currentStartLine = ctx.getStartLineNumber();
        return parentContext !== undefined
            ? getLine(parentContext, currentStartLine)
            : undefined;
    };
    return Rules;
}());
exports.Rules = Rules;
function getLine(parentContext, currentStartLine) {
    var line = parentContext.getContent()[currentStartLine - 1];
    return line;
}
