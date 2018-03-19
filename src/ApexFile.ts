import * as fs from "fs"
import { start } from "repl";
import { Context } from "./Context"
import { LinterError } from "./LinterError"

export class ApexFile {

    private filePath: fs.PathLike
    private fileName: string
    private mainContext: Context
    private errors: Array<LinterError>

    constructor (fileName: string, filePath: fs.PathLike) {
        this.errors = new Array<LinterError>()
        this.fileName = fileName
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
     * Replace the strings inside the file, for example the strings
     * inside System.debug() statements.
     * 
     * @param fileAsString file string
     */
    private replaceStrings (fileAsString: string): string {
        return fileAsString.replace(/'.{1,}'/g, '')
    }

    /**
     * Returns the file name.
     */
    public getName (): string {
        return this.fileName
    }

    /**
     * Prints the errors on
     */
    public printReport (): void {
        this.errors = this.mainContext.getErrors()
        if (this.errors.length > 0 && process.exitCode != -1) {
            process.exitCode = -1
        }
        if (this.errors.length == 0) {
            console.log(this.fileName + ' ✅  No errors found.')
        } else {
            console.log('\n' + this.fileName + ':\n')
            this.errors.forEach(error => {
                console.log('\t❌  ' + error)
            });
            console.log('\n')
        }
    }
}
