import * as fs from "fs"
import { start } from "repl";
import { Context } from "./Context"
import { LinterError } from "./LinterError"

export class ApexFile {

    public filePath: fs.PathLike
    private mainContext: Context
    private errors: Array<LinterError>

    constructor (filePath: fs.PathLike) {
        this.filePath = filePath
        this.analyze(this.loadFile())
        this.report()
    }

    private loadFile () {
        try {
            var fileToRead = fs.readFileSync(this.filePath, 'utf-8')
            return fileToRead
        } catch (e) {
            console.error("❗️ File couldn't be read.")
            process.exit()
        }
        return ''
    }

    private analyze(fileAsString: String): void {
        this.mainContext = new Context(fileAsString.split('\n'))
    }

    private report (): void {
        var errors = this.mainContext.getErrors()
        for (const err of errors) {
            console.error(err+'')
        }
    }
}
