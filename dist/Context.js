"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinterError_1 = require("./LinterError");
var Rules_1 = require("./Rules");
var ContextType;
(function (ContextType) {
    ContextType[ContextType["FUNCTION"] = 0] = "FUNCTION";
    ContextType[ContextType["METHOD"] = 1] = "METHOD";
    ContextType[ContextType["ACCESSOR"] = 2] = "ACCESSOR";
    ContextType[ContextType["CLASS"] = 3] = "CLASS";
    ContextType[ContextType["ITERATOR"] = 4] = "ITERATOR";
})(ContextType || (ContextType = {}));
var Context = (function () {
    function Context(lines) {
        this.content = new Array();
        this.contexts = new Array();
        this.errors = new Array();
        if (lines) {
            this.content = lines;
            this.validateContext();
            if (!this.skipThisContext) {
                this.getInnerContexts();
            }
            this.findQueries(this.content);
            this.runRules();
        }
    }
    Context.prototype.getInnerContexts = function () {
        var newcontexts = new Array();
        var counter = 0;
        while (true) {
            var line = this.content[counter];
            if (!line)
                break;
            if (line == '' || this.isInlineContext(line)) {
                counter++;
                continue;
            }
            if (line.search('{') != -1) {
                var ctx = new Context();
                ctx.startLine = counter + 1;
                newcontexts.push(ctx);
            }
            if (line.match(/(.+)?}$(\n|\r|\S)?/g)) {
                var ctx = newcontexts[newcontexts.length - 1];
                ctx.endline = counter + 1;
                this.contexts.push(ctx);
                newcontexts.pop();
            }
            counter++;
        }
        this.sortContexts();
        this.getKind();
        this.setLines();
    };
    Context.prototype.setLines = function () {
        if (this.startLine == undefined && this.endline == undefined) {
            this.startLine = 1;
            this.endline = this.content.length;
        }
    };
    Context.prototype.isInlineContext = function (line) {
        var rightBracketMatches = line.match(/{/g);
        var leftBracketMatches = line.match(/}/g);
        var rightBrackets = rightBracketMatches != null ? line.match(/{/g).length : 0;
        var leftBrackets = leftBracketMatches != null ? line.match(/}/g).length : 0;
        if (leftBrackets != 0 && rightBrackets == leftBrackets) {
            return true;
        }
        return false;
    };
    Context.prototype.sortContexts = function () {
        var counter = 0;
        while (true) {
            var ctxA = this.contexts[counter];
            var ctxB = this.contexts[counter + 1];
            if (!ctxB)
                break;
            if (ctxA.isParent(ctxB)) {
                ctxA.contexts.push(ctxB);
                this.contexts.splice(counter + 1, 1);
            }
            else if (ctxA.isChild(ctxB)) {
                ctxB.contexts.push(ctxA);
                this.contexts.splice(counter, 1);
            }
            counter++;
        }
    };
    Context.prototype.isChild = function (otherContext) {
        if (otherContext.startLine < this.startLine &&
            otherContext.endline > this.endline) {
            return true;
        }
        return false;
    };
    Context.prototype.isParent = function (otherContext) {
        if (otherContext.startLine > this.startLine &&
            otherContext.startLine < this.endline &&
            otherContext.endline < this.endline &&
            otherContext.endline > this.startLine) {
            return true;
        }
        return false;
    };
    Context.prototype.validateContext = function () {
        var ctx = this.content.join('');
        var leftBrackets = ctx.match(/{/g).length;
        var rightBrackets = ctx.match(/}/g).length;
        if (leftBrackets != rightBrackets) {
            this.errors.push(new LinterError_1.LinterError(-1, 'Brackets ("{" and "}") count don\'t match.'));
            this.skipThisContext = true;
        }
    };
    Context.prototype.addError = function (err) {
        if (this.errors == undefined) {
            this.errors = new Array();
        }
        this.errors.push(err);
    };
    Context.prototype.getErrors = function () {
        var errors = Array();
        if (this.contexts) {
            this.contexts.forEach(function (ctx) {
                errors.concat(ctx.getErrors());
            });
        }
        return this.errors.concat(errors);
    };
    Context.prototype.getKind = function () {
        var startLine = this.content[this.startLine];
        if (startLine != undefined) {
            if (startLine.match(/class/g)) {
                this.kind = ContextType.CLASS;
            }
        }
    };
    Context.prototype.runRules = function () {
        Rules_1.Rules.run(this);
    };
    Context.prototype.getSOQLCount = function () {
        return this.soqlQueriesCount;
    };
    Context.prototype.getLineCount = function () {
        return this.endline - this.startLine;
    };
    Context.prototype.findQueries = function (lines) {
        var fileAsString = lines.join('');
        var matches = fileAsString.match(/\[(\n?\s+?\t?)?SELECT/gi);
        this.soqlQueriesCount = matches != null ? matches.length : 0;
    };
    return Context;
}());
exports.Context = Context;
