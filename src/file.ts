import * as fs from "fs"
import { start } from "repl";
import { Context } from "./Context"

export class ApexFile {

    public filePath: fs.PathLike
    private mainContext: Context

    constructor (filePath: fs.PathLike) {
        this.filePath = filePath
        this.analyze(this.loadFile())
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

    private analyze(fileAsString: String) {
        this.mainContext = new Context(fileAsString.split('\n'))
    }
}
