import * as fs from "fs"

export class File {
    loadFile (filePath: String) {
        try {
            var fileToRead = fs.readFileSync(process.argv[2], 'utf-8')
        } catch (e) {
            console.error("❗️ File couldn't be read.")
            process.exit()
        }
    }
}