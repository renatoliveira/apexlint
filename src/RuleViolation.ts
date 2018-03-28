export class LinterError {
    private lineNumber: number
    private lineContent: string
    private errorMessage: string
    private errorCode: string

    constructor (errorCode: string, errorMessage: string, lineNumber?: number, content?: string) {
        if (lineNumber) {
            this.lineNumber = lineNumber
        }
        if (content) {
            this.lineContent = content
        }
        this.errorMessage = errorMessage
        this.errorCode = errorCode
    }

    public toString (): string {
        return `${this.errorCode} at ${this.lineNumber}: ${this.errorMessage}`
    }

    public getLineNumber (): number {
        return this.lineNumber
    }
    
    public getLineContent (): string {
        return this.lineContent
    }
}