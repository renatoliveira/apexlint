export class LinterError {
    private lineNumber: number
    private lineContent: string
    private errorMessage: string

    constructor (lineNumber?: number, errorMessage?: string, content?: string) {
        if (lineNumber) {
            this.lineNumber = lineNumber
        }
        if (errorMessage) {
            this.errorMessage = errorMessage
        }
        if (content) {
            this.lineContent = content
        }
    }

    public toString (): string {
        return `${this.lineNumber}: ${this.errorMessage}`
    }

    public getLineNumber (): number {
        return this.lineNumber
    }
    
    public getLineContent (): string {
        return this.lineContent
    }
}