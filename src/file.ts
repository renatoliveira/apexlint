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
    }

    /** 
     * Loads the file from disk. Prints error message if the file can't
     * be read.
     */
    private loadFile () {
        try {
            var fileToRead = fs.readFileSync(this.filePath, 'utf-8')
            return fileToRead
        } catch (e) {
            console.error("❗️ File '" + this.filePath + "' couldn't be read.")
        }
        return ''
    }

    /**
     * Analyze the file, passing it to the Context class which will
     * handle the analysis.
     * 
     * @param fileAsString file as string
     */
    private analyze(fileAsString: string): void {
        fileAsString = this.replaceStrings(fileAsString)
        this.mainContext = new Context(fileAsString.split('\n'))
    }

    /**
     * Return the errors found on the screen.
     */
    public report (): Array<LinterError> {
        return this.mainContext.getErrors()
    }

    /**
     * Replace the strings inside the file, for example the strings
     * inside System.debug() statements.
     * 
     * @param fileAsString file string
     */
    private replaceStrings (fileAsString: string): string {
        return fileAsString.replace(/'.{1,}'/g, '')
    }
}
