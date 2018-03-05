import { expect } from 'chai'
import { Rules } from "../src/Rules"
import { Context } from "../src/Context"

describe("Context rules", () => {
    describe("Line length.", () => {
        it("Should not log an error because there is no line with more than 120 characters.", () => {
            let clearContext = new Context(new Array<string>(
                'global class AClass {',
                '    global static variable = \'FOO\';',
                '}'
            ))
            expect(clearContext.getErrors().length).to.equal(0)
        }),
        it("Should log an error because there is a line with more than 120 characters.", () => {
            let erroredContext = new Context(new Array<string>(
                'global class BClass {',
                '    global static variableThatHasAReallyRandomLongNameWhichIsOfcourseUnacceptableByThisLinterStandardsAndShouldBeMarkedAsAnError = \'FOO\';',
                '}'
            ))
            expect(erroredContext.getErrors().length).to.equal(1)
        })
    })
})