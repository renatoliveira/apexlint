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
        if (lines)
            this.content = lines
        this.contexts = new Array<Context>()
        this.getInnerContexts()
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
    }
}