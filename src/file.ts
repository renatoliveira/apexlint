import * as fs from "fs"

export class ApexFile {

    public filePath: fs.PathLike

    constructor (filePath: fs.PathLike) {
        this.filePath = filePath
        this.loadFile()
    }

    loadFile () {
        try {
            var fileToRead = fs.readFileSync(this.filePath, 'utf-8')
            console.log(fileToRead)
        } catch (e) {
            console.error("❗️ File couldn't be read.")
            process.exit()
        }
    }
}