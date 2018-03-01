import { LinterError } from "./LinterError"

export class Results {
    public static errors: Array<LinterError>

    public static report (): void {
        if (this.errors.length == 0) {
            console.log('✅ No errors found.')
        }
        this.errors.forEach(err => {
            console.error('❌ ' + err)
        })
    }
}