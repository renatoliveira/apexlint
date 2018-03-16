import { LinterError } from "./LinterError"

export class Results {
    public errors: Array<LinterError>

    constructor () {
        this.errors = new Array<LinterError>()
    }

    public addErrors (errors: Array<LinterError>): void {
        this.errors = this.errors.concat(errors)
    }

    public report (): number {
        if (this.errors.length == 0) {
            console.log('✅ - No errors found.')
            return 0
        }
        this.errors.forEach(err => {
            console.error('❌ - ' + err)
        })
        return -1
    }
}