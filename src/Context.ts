import { LinterError } from "./LinterError"

enum ContextType {
    FUNCTION,
    METHOD,
    ACCESSOR,
    CLASS,
    ITERATOR
}

export class Context {
    public content: Array<String>
    public contexts: Array<Context>
    public errors: Array<LinterError>

    public startLine: number
    public endline: number

    private skip: boolean

    constructor (lines?: Array<String>) {
        this.content = new Array<String>()
        this.contexts = new Array<Context>()
        this.errors = new Array<LinterError>()
        if (lines) {
            this.content = lines
            this.validateContext()
            if (!this.skip)
                this.getInnerContexts()
        }
    }

    public getInnerContexts (): void {
        var newcontexts = new Array<Context>()
        var hasInnerContext: boolean = false
        var lastContextLine: number = undefined

        var counter: number = 0
        while (true) {
            var line = this.content[counter]
            if (line == '') {
                counter++
                continue
            }
            if (!line)
                break
            if (line.search('{') != -1) {
                var ctx = new Context()
                ctx.startLine = counter + 1
                newcontexts.push(ctx)
            }
            if (line.search('}') != -1) {
                var ctx = newcontexts[newcontexts.length-1]
                ctx.endline = counter + 1
                this.contexts.push(ctx)
                newcontexts.pop()
            }
            counter++
        }
        this.sortContexts();
        if (this.contexts.length)
            console.log(this.contexts)
    }
    
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

    public isChild (otherContext: Context): boolean {
        if (otherContext.startLine < this.startLine &&
            otherContext.endline > this.endline) {
            return true
        }
        return false
    }

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
     * TODO: Escape string literals.
     */
    private validateContext (): void {
        var ctx = this.content.join('')
        var leftBrackets = ctx.match(/{/g).length
        var rightBrackets = ctx.match(/}/g).length

        if (leftBrackets != rightBrackets) {
            this.errors.push(new LinterError(-1, 'Brackets ("{" and "}") count don\'t match.'))
            this.skip = true
        }
    }

    public getErrors (): Array<LinterError> {
        var errors = Array<LinterError>()
        if (this.contexts) {
            this.contexts.forEach(ctx => {
                errors.concat(ctx.getErrors())
            });
        }
        return this.errors.concat(errors)
    }
}