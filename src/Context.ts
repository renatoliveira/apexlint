import { RuleViolation } from "./RuleViolation"
import { Rules } from "./Rules"
import chalk from "chalk";

export enum ContextType {
    CLASS,
    METHOD,
    LOOP
}

export enum LoopType {
    DO_WHILE,
    WHILE,
    FOR_CONDITION,
    FOR_ARRAY,
    FOR_SOQL
}

/**
 * The Context class represents code inside brackets.
 * Valid contexts are represented on the enumerator above.
 */
export class Context {
    private content: Array<string>
    private contexts: Array<Context>
    private errors: Array<RuleViolation>
    private ignoredErrors: Array<RuleViolation>
    private startLine: number
    private endline: number
    private kind: ContextType
    private skipThisContext: boolean
    private soqlQueriesCount: number
    private todos: number

    private parentContext: Context
    private loop: Loop

    constructor (lines?: Array<string>) {
        this.content = new Array<string>()
        this.contexts = new Array<Context>()
        this.errors = new Array<RuleViolation>()
        this.ignoredErrors = new Array<RuleViolation>()
        this.todos = 0
        if (lines) {
            this.startLine = 1
            this.endline = lines.length
            this.init(lines)
        }
    }

    public init (lines: Array<string>) {
        this.content = lines
        this.validateContext()
        if (!this.skipThisContext) {
            this.getInnerContexts()
            this.getKind()
        }
        this.sortContexts()
        this.analyze()
    }

    public analyze (): void {
        this.findQueries(this.content)
        this.runRules();
        this.contexts.forEach(ctx => {
            ctx.analyze()
        })
    }

    /** 
     * Detects and stores the inner contexts (methods inside a class
     * are inner contexts of said class, for example).
     */
    public getInnerContexts (): void {
        var newcontexts = new Array<Context>()
        var counter: number = 0
        while (true) {
            var line = this.content[counter]
            if (!line || !this.hasInnerContexts()) {
                break
            } else if (line == '' || this.isInlineContext(line)) {
                counter++
                continue
            } else if (line.search('{') != -1 && counter !== this.startLine - 1) {
                var ctx = new Context()
                ctx.startLine = counter + 1
                newcontexts.push(ctx)
            } else if (line.search('}') != -1 && newcontexts[newcontexts.length - 1] !== undefined) {
                var ctx = newcontexts[newcontexts.length - 1]
                ctx.endline = counter + 1
                if (ctx.startLine > this.startLine) {
                    let ctxLines = this.content.slice(ctx.startLine - 1, ctx.endline)
                    ctx.init(ctxLines)
                }
                if (ctx.isValid()) {
                    this.contexts.push(ctx)
                    newcontexts.pop()
                }
            }
            counter++
        }
        this.setContextStartAndEnd()
    }

    private hasInnerContexts (): boolean {
        let bracketCount = this.content.join('').match(/\{/g)
        return bracketCount !== null
            ? bracketCount.length > 1
            : false
    }

    private setContextStartAndEnd (): void {
        if (this.startLine == undefined && this.endline == undefined) {
            this.startLine = 1
            this.endline = this.content.length
        }
    }

    /**
     * Detects if the line contains an inline context, like a small map/list being
     * set up for a method.
     * 
     * E.g:
     *      someMethod(new List<String>{'hello', 'world'}) at a line would start
     * a new context because of the brackets, but it is just a list assignment,
     * not worthy of a context analysis at this moment.
     * 
     * @param line file line
     */
    private isInlineContext (line: string) {
        let rightBracketMatches = line.match(/{/g)
        let leftBracketMatches = line.match(/}/g)
        var rightBrackets: number = rightBracketMatches != null ? line.match(/{/g).length : 0
        var leftBrackets: number = leftBracketMatches != null ? line.match(/}/g).length : 0
        if (leftBrackets != 0 && rightBrackets == leftBrackets) {
            return true
        }
        return false
    }
    
    /** 
     * Sorts the contexts into parent-children. This will probably ease the
     * organization for methods inside classes, for example.
     */
    public sortContexts() {
        var counter = 0
        while (true) {
            var ctxA = this.contexts[counter]
            var ctxB = this.contexts[counter+1]
            if (!ctxB)
                break
            if (ctxA.isParent(ctxB)) {
                ctxA.contexts.push(ctxB)
                ctxB.parentContext = ctxA
                this.contexts.splice(counter+1, 1)
            } else if (ctxA.isChild(ctxB)) {
                ctxB.contexts.push(ctxA)
                ctxA.parentContext = ctxB
                this.contexts.splice(counter, 1)
            }
            counter++
        }
        this.contexts.forEach(childContext => {
            if (childContext.parentContext === undefined) {
                childContext.parentContext = this
            }
        })
    }

    /**
     * Indicates if this context is a child of the other context.
     * @param otherContext context to compare
     */
    public isChild (otherContext: Context): boolean {
        if (otherContext.startLine < this.startLine
                && otherContext.endline > this.endline) {
            return true
        }
        return false
    }

    /**
     * Indicates if this context is a parent of the other context.
     * @param otherContext context to compare
     */
    public isParent (otherContext: Context): boolean {
        if (otherContext.startLine > this.startLine &&
            otherContext.startLine < this.endline &&
            otherContext.endline < this.endline &&
            otherContext.endline > this.startLine) {
            return true
        }
        return false
    }

    /**
     * Validates the context. Any valid class should have the same amount
     * of brackets.
     */
    private validateContext (): void {
        this.skipThisContext = !this.isValid()
    }

    public isValid (): boolean {
        var ctx = this.content.join('')
        var leftBrackets = ctx.match(/{/g)
        var rightBrackets = ctx.match(/}/g)
        if (leftBrackets !== null && rightBrackets !== null
                && leftBrackets.length != rightBrackets.length) {
            Rules.bracketsDontMatch(-1, this)
            return false
        } else if (leftBrackets === null || rightBrackets === null) {
            Rules.invalidClass(-1, this)
            return false
        }
        return true
    }

    /**
     * Adds a new error to the context's array of errors.
     * 
     * @param err new error to the error array
     */
    public addError (err: RuleViolation): void {
        this.errors.push(err)
    }

    /**
     * Adds a new error to the context's array of ignored errors. Those won't
     * be reported at the end.
     * 
     * @param err new ignored error
     */
    public addIgnoredError (err: RuleViolation): void {
        this.ignoredErrors.push(err)
    }

    /**
     * Returns the errors found in this context and its children.
     */
    public getErrors (): Array<RuleViolation> {
        var errors = Array<RuleViolation>()
        if (this.errors === undefined) {
            this.errors = new Array<RuleViolation>()
        }
        if (this.contexts) {
            this.contexts.forEach(ctx => {
                errors.concat(ctx.getErrors())
            })
        }
        return this.errors.concat(errors)
    }

    /**
     * Returns the ignored errors found in this context and its children.
     */
    public getIgnoredErrors (): Array<RuleViolation> {
        var errors = Array<RuleViolation>()
        if (this.ignoredErrors === undefined) {
            this.ignoredErrors = new Array<RuleViolation>()
        }
        if (this.contexts) {
            this.contexts.forEach(ctx => {
                errors.concat(ctx.getIgnoredErrors())
            })
        }
        return this.ignoredErrors.concat(errors)
    }

    /**
     * Tries to get the context type based on its first line.
     */
    public getKind (): void {
        var startLine: string = this.content[0]
        if (startLine != undefined) {
            if (startLine.toLowerCase().search('class') != -1) {
                this.kind = ContextType.CLASS
            } else if (startLine.toLowerCase().match(/(public|private|global)\s?(override|static)?/g) != null) {
                this.kind = ContextType.METHOD
            } else if (startLine.toLowerCase().match(/((for|while)\s+?\(|do\s+?\{)/g) != null) {
                this.kind = ContextType.LOOP
                this.loop = new Loop(this)
            }
        }
    }

    public runRules (): void {
        Rules.run(this)
    }

    /** 
     * If the context contains any SOQL query inside of it, this should return
     * the number of detected queries found in the context.
     */
    public getSOQLCount (): number {
        return this.soqlQueriesCount
    }

    /**
     * Return the line count in this context.
     */
    public getLineCount (): number {
        return this.endline - this.startLine
    }

    /**
     * Detects SOQL queries inside the context.
     * @param lines context content
     */
    private findQueries (lines: Array<string>): void {
        var fileAsString = lines.join('')
        let matches = fileAsString.match(/\[(\n?\s+?\t?)?SELECT/gi)
        this.soqlQueriesCount = matches != null ? matches.length : 0
    }

    /**
     * When a TODO comment is found, increase the counter for this
     * context.
     */
    public foundTodo (): void {
        this.todos++
    }

    /**
     * Return the number of TODOs found in this context.
     */
    public getTodos (): number {
        return this.todos
    }

    /**
     * Returns this context type
     */
    public getContextType (): ContextType {
        return this.kind
    }

    /**
     * Returns this context's parent.
     */
    public getParentContext (): Context {
        return this.parentContext
    }

    /**
     * Return the file content.
     */
    public getContent (): Array<string> {
        return this.content
    }

    /**
     * Return the child contexts
     */
    public getChildContexts (): Array<Context> {
        return this.contexts
    }

    public getStartLine (): string {
        if (this.content) {
            return this.content[0]
        }
        return ''
    }

    public getLoopType (): LoopType {
        if (this.kind == ContextType.LOOP) {
            return this.loop.getKind()
        }
    }

    public getStartLineNumber (): number {
        return this.startLine
    }

    public toString (): string {
        if (this.isValid()) {
            let firstLine: string = this.content[0].substr(0, 32)
            let lastLine: string = this.content[this.content.length - 1].substr(0, 32)
            let parentContext: string = this.parentContext != undefined
                ? this.parentContext.toString()
                : 'none'
            return `${this.startLine} ${firstLine} ...\n${this.endline} ${lastLine} ...\nParent: ${chalk.reset(parentContext)}`
        }
    }
}

export class Loop {
    private booleanCondition: string
    private initialization: string
    private increment: string
    private inlineQuery: string
    private ctx: Context
    private kind: LoopType

    constructor (context: Context) {
        this.ctx = context
        this.parse()
    }

    private parse (): void {
        let startLine = this.ctx.getStartLine()
        if (startLine.search(';') != -1) {
            this.kind = LoopType.FOR_CONDITION
        } else if (startLine.search(':') > -1) {
            if (startLine.match(/(:\s+\w+\))|(:\s+(\w+\.*){1,}\(\)\))/g) != null) {
                this.kind = LoopType.FOR_ARRAY
            } else if (startLine.toLowerCase().search('select') != -1) {
                this.kind = LoopType.FOR_SOQL
                Rules.inlineSOQLInsideLoop(startLine, this.ctx.getStartLineNumber(), this.ctx)
            }
        } else if (startLine.match(/do\s+?\{/i) != null) {
            this.kind = LoopType.DO_WHILE
        }
    }

    public getKind (): LoopType {
        return this.kind
    }
}