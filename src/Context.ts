import { LinterError } from "./LinterError"
import { Rules } from "./Rules"

export enum ContextType {
    CLASS,
    METHOD
}

/**
 * The Context class represents code inside brackets.
 * Valid contexts are represented on the enumerator above.
 */
export class Context {
    private content: Array<string>
    private contexts: Array<Context>
    private errors: Array<LinterError>
    private startLine: number
    private endline: number
    private kind: ContextType
    private skipThisContext: boolean
    private soqlQueriesCount: number
    private todos: number

    constructor (lines?: Array<string>) {
        this.content = new Array<string>()
        this.contexts = new Array<Context>()
        this.errors = new Array<LinterError>()
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
        this.findQueries(this.content)
        this.runRules();
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
                this.contexts.push(ctx)
                newcontexts.pop()
            }
            counter++
        }
        this.sortContexts()
        this.setContextStartAndEnd()
    }

    private hasInnerContexts (): boolean {
        return this.content.join('').match(/\{/g).length > 1
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
    private sortContexts() {
        var counter = 0
        while (true) {
            var ctxA = this.contexts[counter]
            var ctxB = this.contexts[counter+1]
            if (!ctxB)
                break
            if (ctxA.isParent(ctxB)) {
                ctxA.contexts.push(ctxB)
                this.contexts.splice(counter+1, 1)
            } else if (ctxA.isChild(ctxB)) {
                ctxB.contexts.push(ctxA)
                this.contexts.splice(counter, 1)
            }
            counter++
        }
    }

    /**
     * Indicates if this context is a child of the other context.
     * @param otherContext context to compare
     */
    public isChild (otherContext: Context): boolean {
        if (otherContext.startLine < this.startLine &&
            otherContext.endline > this.endline) {
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
        var ctx = this.content.join('')
        var leftBrackets = ctx.match(/{/g).length
        var rightBrackets = ctx.match(/}/g).length

        if (leftBrackets != rightBrackets) {
            this.errors.push(new LinterError(-1, 'Brackets ("{" and "}") count don\'t match.'))
            this.skipThisContext = true
        }
    }

    /**
     * Adds a new error to the context's array of errors.
     * 
     * @param err new error to the error array
     */
    public addError (err: LinterError): void {
        this.errors.push(err)
    }

    /**
     * Returns the errors found in this context and its children.
     */
    public getErrors (): Array<LinterError> {
        var errors = Array<LinterError>()
        if (this.contexts) {
            this.contexts.forEach(ctx => {
                errors.concat(ctx.getErrors())
            })
        }
        return this.errors.concat(errors)
    }

    /**
     * Tries to get the context type based on its first line.
     */
    public getKind (): void {
        var startLine: string = this.content[0]
        if (startLine != undefined) {
            if (startLine.toLowerCase().search('class') != -1) {
                this.kind = ContextType.CLASS
            } else if (startLine.toLowerCase().search('class') == -1 && startLine.toLowerCase().match(/(public|private|global)\s?(override|static)?/g) != null) {
                this.kind = ContextType.METHOD
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
    public getContext (): ContextType {
        return this.kind
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
}