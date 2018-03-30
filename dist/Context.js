"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rules_1 = require("./Rules");
var chalk_1 = require("chalk");
var ContextType;
(function (ContextType) {
    ContextType[ContextType["CLASS"] = 0] = "CLASS";
    ContextType[ContextType["METHOD"] = 1] = "METHOD";
    ContextType[ContextType["LOOP"] = 2] = "LOOP";
})(ContextType = exports.ContextType || (exports.ContextType = {}));
var LoopType;
(function (LoopType) {
    LoopType[LoopType["DO_WHILE"] = 0] = "DO_WHILE";
    LoopType[LoopType["WHILE"] = 1] = "WHILE";
    LoopType[LoopType["FOR_CONDITION"] = 2] = "FOR_CONDITION";
    LoopType[LoopType["FOR_ARRAY"] = 3] = "FOR_ARRAY";
    LoopType[LoopType["FOR_SOQL"] = 4] = "FOR_SOQL";
})(LoopType = exports.LoopType || (exports.LoopType = {}));
var Context = (function () {
    function Context(lines) {
        this.content = new Array();
        this.contexts = new Array();
        this.errors = new Array();
        this.ignoredErrors = new Array();
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
        this.sortContexts();
        this.analyze();
    };
    Context.prototype.analyze = function () {
        this.findQueries(this.content);
        this.runRules();
        this.contexts.forEach(function (ctx) {
            ctx.analyze();
        });
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
                if (ctx.isValid()) {
                    this.contexts.push(ctx);
                    newcontexts.pop();
                }
            }
            counter++;
        }
        this.setContextStartAndEnd();
    };
    Context.prototype.hasInnerContexts = function () {
        var bracketCount = this.content.join('').match(/\{/g);
        return bracketCount !== null
            ? bracketCount.length > 1
            : false;
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
        var _this = this;
        var counter = 0;
        while (true) {
            var ctxA = this.contexts[counter];
            var ctxB = this.contexts[counter + 1];
            if (!ctxB)
                break;
            if (ctxA.isParent(ctxB)) {
                ctxA.contexts.push(ctxB);
                ctxB.parentContext = ctxA;
                this.contexts.splice(counter + 1, 1);
            }
            else if (ctxA.isChild(ctxB)) {
                ctxB.contexts.push(ctxA);
                ctxA.parentContext = ctxB;
                this.contexts.splice(counter, 1);
            }
            counter++;
        }
        this.contexts.forEach(function (childContext) {
            if (childContext.parentContext === undefined) {
                childContext.parentContext = _this;
            }
        });
    };
    Context.prototype.isChild = function (otherContext) {
        if (otherContext.startLine < this.startLine
            && otherContext.endline > this.endline) {
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
        this.skipThisContext = !this.isValid();
    };
    Context.prototype.isValid = function () {
        var ctx = this.content.join('');
        var leftBrackets = ctx.match(/{/g);
        var rightBrackets = ctx.match(/}/g);
        if (leftBrackets !== null && rightBrackets !== null
            && leftBrackets.length != rightBrackets.length) {
            Rules_1.Rules.bracketsDontMatch(-1, this);
            return false;
        }
        else if (leftBrackets === null || rightBrackets === null) {
            Rules_1.Rules.invalidClass(-1, this);
            return false;
        }
        return true;
    };
    Context.prototype.addError = function (err) {
        this.errors.push(err);
    };
    Context.prototype.addIgnoredError = function (err) {
        this.ignoredErrors.push(err);
    };
    Context.prototype.getErrors = function () {
        var errors = Array();
        if (this.errors === undefined) {
            this.errors = new Array();
        }
        if (this.contexts) {
            this.contexts.forEach(function (ctx) {
                errors.concat(ctx.getErrors());
            });
        }
        return this.errors.concat(errors);
    };
    Context.prototype.getIgnoredErrors = function () {
        var errors = Array();
        if (this.ignoredErrors === undefined) {
            this.ignoredErrors = new Array();
        }
        if (this.contexts) {
            this.contexts.forEach(function (ctx) {
                errors.concat(ctx.getIgnoredErrors());
            });
        }
        return this.ignoredErrors.concat(errors);
    };
    Context.prototype.getKind = function () {
        var startLine = this.content[0];
        if (startLine != undefined) {
            if (startLine.toLowerCase().search('class') != -1) {
                this.kind = ContextType.CLASS;
            }
            else if (startLine.toLowerCase().match(/(public|private|global)\s?(override|static)?/g) != null) {
                this.kind = ContextType.METHOD;
            }
            else if (startLine.toLowerCase().match(/((for|while)\s+?\(|do\s+?\{)/g) != null) {
                this.kind = ContextType.LOOP;
                this.loop = new Loop(this);
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
    Context.prototype.getContextType = function () {
        return this.kind;
    };
    Context.prototype.getParentContext = function () {
        return this.parentContext;
    };
    Context.prototype.getContent = function () {
        return this.content;
    };
    Context.prototype.getChildContexts = function () {
        return this.contexts;
    };
    Context.prototype.getStartLine = function () {
        if (this.content) {
            return this.content[0];
        }
        return '';
    };
    Context.prototype.getLoopType = function () {
        if (this.kind == ContextType.LOOP) {
            return this.loop.getKind();
        }
    };
    Context.prototype.getStartLineNumber = function () {
        return this.startLine;
    };
    Context.prototype.toString = function () {
        if (this.isValid()) {
            var firstLine = this.content[0].substr(0, 32);
            var lastLine = this.content[this.content.length - 1].substr(0, 32);
            var parentContext = this.parentContext != undefined
                ? this.parentContext.toString()
                : 'none';
            return this.startLine + " " + firstLine + " ...\n" + this.endline + " " + lastLine + " ...\nParent: " + chalk_1.default.reset(parentContext);
        }
    };
    return Context;
}());
exports.Context = Context;
var Loop = (function () {
    function Loop(context) {
        this.ctx = context;
        this.parse();
    }
    Loop.prototype.parse = function () {
        var startLine = this.ctx.getStartLine();
        if (startLine.search(';') != -1) {
            this.kind = LoopType.FOR_CONDITION;
        }
        else if (startLine.search(':') > -1) {
            if (startLine.match(/(:\s+\w+\))|(:\s+(\w+\.*){1,}\(\)\))/g) != null) {
                this.kind = LoopType.FOR_ARRAY;
            }
            else if (startLine.toLowerCase().search('select') != -1) {
                this.kind = LoopType.FOR_SOQL;
                Rules_1.Rules.inlineSOQLInsideLoop(startLine, this.ctx.getStartLineNumber(), this.ctx);
            }
        }
        else if (startLine.match(/do\s+?\{/i) != null) {
            this.kind = LoopType.DO_WHILE;
        }
    };
    Loop.prototype.getKind = function () {
        return this.kind;
    };
    return Loop;
}());
exports.Loop = Loop;
