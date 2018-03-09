import { expect } from 'chai'
import { Rules } from "../src/Rules"
import { Context } from "../src/Context"

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
    }),
    describe("Assingment on the same line.", () => {
        it("Should log an error when line assignments are done in multiple lines.", () => {
            let erroredContextEqualSignOnSameLine = new Context(new Array<string>(
                'global class AClass {',
                '    global void randomMethod () {',
                '        global static variable = ',
                '            \'FOO\';',
                '    }',
                '}'
            ))
            let erroredContextEqualSignOnLineBelow = new Context(new Array<string>(
                'global class AClass {',
                '    global void randomMethod () {',
                '        global static variable = ',
                '            \'FOO\';',
                '    }',
                '}'
            ))
            expect(erroredContextEqualSignOnSameLine.getErrors().length).to.equal(1)
            expect(erroredContextEqualSignOnLineBelow.getErrors().length).to.equal(1)
        }),
        it("Should NOT log an error otherwise.", () => {
            let clearContext = new Context(new Array<string>(
                'global class AClass {',
                '    global void randomMethod () {',
                '        String variable = \'FOO\';',
                '    }',
                '}'
            ))
            expect(clearContext.getErrors().length).to.equal(0)
        })
    })
})

describe("SOQL queries.", () => {
    describe("Should know when the context has a SOQL query", () => {
        it("Should indicate that the provided context has SOQL query inside of it.", () => {
            let queryContext1 = new Context(new Array<string>(
                'private class QueryClass {',
                '    public List<Account> getAccounts() {',
                '        return [SELECT Id FROM Account];',
                '    }',
                '}'
            ))
            let queryContext2 = new Context(new Array<string>(
                'public List<Account> methodWithMultipleLinesSOQL () {',
                '    return [',
                '        SELECT',
                '        Id',
                '        ,Name',
                '        FROM Account',
                '    ];',
                '}'
            ))
            expect(queryContext1.getSOQLCount()).to.equal(1)
            expect(queryContext2.getSOQLCount()).to.equal(1)
        }),
        it("Should be able to tell when there is more than one query inside the context.", () => {
            let queryContext = new Context(new Array<string>(
                'private class QueryClass {',
                '    public List<Account> getAccounts() {',
                '        List<Case> cases = [SELECT Id FROM Case];',
                '        return [SELECT Id FROM Account];',
                '    }',
                '}'
            ))
            expect(queryContext.getSOQLCount()).to.equal(2)
        }),
        it("Should NOT indicate that the provided context has a SOQL query inside of it.", () => {
            let queryContext = new Context(new Array<string>(
                'public class QuerylessClass {',
                '    public List<Account> getAccounts () {',
                '        return new List<Account>();',
                '    }',
                '}'
            ))
            expect(queryContext.getSOQLCount()).to.equal(0)
        })
    }),
    describe("About queries on a single line.", () => {
        it("Should give an error about one-liners with more than one field on the query.", () => {
            let queryContext = new Context(new Array<string>(
                'private class QueryClass {',
                '    public List<Account> getAccounts() {',
                '        List<Case> cases = [SELECT Id, Subject FROM Case];',
                '    }',
                '}'
            ))
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
            expect(queryContext.getErrors().length).to.equal(1)
        })
    })
})