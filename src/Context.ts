enum ContextType {
    FUNCTION,
    METHOD,
    ACCESSOR,
    CLASS,
    ITERATOR
}

export class Context {
    public kind: ContextType
    public startLine: number
    public endLine: number
    public content: Array<String>
    public contexts: Array<Context>

    public toString () {
        return `Context (S:${this.startLine}, E:${this.endLine}, count: ${this.content.length})`
    }
}