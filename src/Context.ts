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

    public startLine: number
    public endline: number

    constructor (lines?: Array<String>) {
        this.content = new Array<String>()
        this.contexts = new Array<Context>()
        if (lines) {
            this.content = lines
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
        if (this.contexts.length)
            console.log(this.contexts)
        this.sortContexts();
    }
    
    private sortContexts() {
        var counter = 0
        while (true) {
            var otherContext = this.contexts[counter + 1];
            if (this.contexts[counter] && otherContext) {
                if (this.isParent(otherContext)) {
                    this.contexts.push(otherContext)
                } else if (this.isChild(otherContext)) {
                    // ...
                }
            }
            counter++
            if (!otherContext)
                break
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
}