import { expect } from 'chai'
import { ApexFile } from "../src/ApexFile"

describe("Apexfile", () => {
    it("Should return the error count.", () => {
        let file: ApexFile = new ApexFile()
        file.analyze('private InvalidClass () {')
        expect(file.getErrorCount()).to.equal(1)
    })
})
