import { expect } from 'chai'
import { Rules } from "../src/Rules"
import { Context } from "../src/Context"
import { ContextType } from "../src/Context"

describe("Context rules", () => {
    describe("Comments", () => {
        it("Should ignore lines starting with '//'.", () => {
            let commentedContext = new Context(new Array<string>(
                'global class CommentedClass {',
                '    // this is a little comment',
                '}'
            ))
            expect(commentedContext.getLineCount()).to.equal(2)
        })
    }),
    describe("Line length", () => {
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

describe("SOQL queries.", () => {
    describe("About queries on a single line.", () => {
        it("Should give an error about one-liners with more than one field on the query.", () => {
            let queryContext = new Context(new Array<string>(
                'private class QueryClass {',
                '    public List<Account> getAccounts() {',
                '        List<Case> cases = [SELECT Id, Subject FROM Case WHERE Something__c = \'Email\'];',
                '    }',
                '}'
            ))
            expect(queryContext.getSOQLCount()).to.equal(1)
            expect(queryContext.getErrors().length).to.equal(1)
        }),
        it("Should give an error about one-liners with more than one condition on the query.", () => {
            let queryContext = new Context(new Array<string>(
                'private class QueryClass {',
                '    public List<Account> getAccounts() {',
                '        return [SELECT Id FROM Account WHERE Name = \'Account\' AND NumberField__c > 0];',
                '    }',
                '}'
            ))
            expect(queryContext.getSOQLCount()).to.equal(1)
            expect(queryContext.getErrors().length).to.equal(1)
        })
    }),
    describe("Queries without condition.", () => {
        it("Should accuse an error with a query without condition", () => {
            let queryContext = new Context(new Array<string>(
                'private class QueryClass {',
                '    public List<Account> getAccounts() {',
                '        return [SELECT Id FROM Account];',
                '    }',
                '}'
            ))
            expect(queryContext.getSOQLCount()).to.equal(1)
            expect(queryContext.getErrors().length).to.equal(1)
        })
    })
})

describe("'TODOS:'", () => {
    it("Should point to lines with 'TODO's.", () => {
        let fileContext = new Context(new Array<string>(
            'private class MyClass {',
            '    // TODO: do something',
            '    public Boolean something() {',
            '        return true;',
            '    }',
            '}'
        ))
        expect(fileContext.getTodos()).to.equal(1)
    })
})