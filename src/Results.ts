import { LinterError } from "./LinterError"

export class Results {
    public errors: Array<LinterError>

    constructor () {
        this.errors = new Array<LinterError>()
    }

    public addErrors (errors: Array<LinterError>): void {
        this.errors = this.errors.concat(errors)
    }

    public report (): void {
        if (this.errors.length == 0) {
            console.log('✅ No errors found.')
        }
        this.errors.forEach(err => {
            console.error('❌ ' + err)
        })
    }
}