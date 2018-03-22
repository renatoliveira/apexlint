export class LinterError {
    private lineError: number
    private message: string

    constructor (lineNumber?: number, message?: string) {
        if (lineNumber) {
            this.lineError = lineNumber
        }
        if (message) {
            this.message = message
        }
    }

    public toString (): string {
        return `${this.lineError}: ${this.message}`
    }

    public getLine (): number {
        return this.lineError
    }
}