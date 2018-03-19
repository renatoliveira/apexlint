"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinterError_1 = require("./LinterError");
var Rules_1 = require("./Rules");
var ContextType;
(function (ContextType) {
    ContextType[ContextType["CLASS"] = 0] = "CLASS";
    ContextType[ContextType["METHOD"] = 1] = "METHOD";
})(ContextType = exports.ContextType || (exports.ContextType = {}));
var Context = (function () {
    function Context(lines) {
        this.content = new Array();
        this.contexts = new Array();
        this.errors = new Array();
        this.todos = 0;
        if (lines) {
            this.startLine = 1;
            this.endline = lines.length;
            this.init(lines);
        }
    }
    Context.prototype.init = function (lines) {
        this.content = lines;
        this.validateContext();
        if (!this.skipThisContext) {
            this.getInnerContexts();
            this.getKind();
        }
        this.findQueries(this.content);
        this.runRules();
    };
    Context.prototype.getInnerContexts = function () {
        var newcontexts = new Array();
        var counter = 0;
        while (true) {
            var line = this.content[counter];
            if (!line || !this.hasInnerContexts()) {
                break;
            }
            else if (line == '' || this.isInlineContext(line)) {
                counter++;
                continue;
            }
            else if (line.search('{') != -1 && counter !== this.startLine - 1) {
                var ctx = new Context();
                ctx.startLine = counter + 1;
                newcontexts.push(ctx);
            }
            else if (line.search('}') != -1 && newcontexts[newcontexts.length - 1] !== undefined) {
                var ctx = newcontexts[newcontexts.length - 1];
                ctx.endline = counter + 1;
                if (ctx.startLine > this.startLine) {
                    var ctxLines = this.content.slice(ctx.startLine - 1, ctx.endline);
                    ctx.init(ctxLines);
                }
                this.contexts.push(ctx);
                newcontexts.pop();
            }
            counter++;
        }
        this.sortContexts();
        this.setContextStartAndEnd();
    };
    Context.prototype.hasInnerContexts = function () {
        return this.content.join('').match(/\{/g).length > 1;
    };
    Context.prototype.setContextStartAndEnd = function () {
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
        var startLine = this.content[0];
        if (startLine != undefined) {
            if (startLine.toLowerCase().search('class') != -1) {
                this.kind = ContextType.CLASS;
            }
            else if (startLine.toLowerCase().search('class') == -1 && startLine.toLowerCase().match(/(public|private|global)\s?(override|static)?/g) != null) {
                this.kind = ContextType.METHOD;
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
    Context.prototype.foundTodo = function () {
        this.todos++;
    };
    Context.prototype.getTodos = function () {
        return this.todos;
    };
    Context.prototype.getContext = function () {
        return this.kind;
    };
    Context.prototype.getContent = function () {
        return this.content;
    };
    Context.prototype.getChildContexts = function () {
        return this.contexts;
    };
    return Context;
}());
exports.Context = Context;
