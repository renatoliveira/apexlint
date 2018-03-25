import { expect } from 'chai'
import { Rules } from "../src/Rules"
import { Context } from "../src/Context"
import { ContextType } from "../src/Context"
import { LinterError } from "../src/LinterError"


describe("File validation", () => {
    it("Should raise errors when bracket count is incorrect.", () => {
        let fileString = 'private InvalidClass () {'
        let context = new Context(new Array<string>(fileString))
        expect(context.getErrors().length).to.equal(1)
    }),
    it("Should raise an error when there are no brackets in the class file.", () => {
        let fileString = 'private InvalidClass ()'
        let context = new Context(new Array<string>(fileString))
        expect(context.getErrors().length).to.equal(1)
    })
})

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
        }),
        it("Should not ignore strings or whitespaces when counting line length.", () => {
            let fileAsStrings: Array<string> = new Array<string>(
                'public class QuerylessClass {',
                '    public List<Account> getAccounts () {',
                '        sfab_FabricatedSObjectStub child1 = new sfab_FabricatedSObjectStub(Account.class, new Map<String, Object> { \'Name\' => \'Foo-1\' });',
                '        return new List<Account>();',
                '    }',
                '}'
            )
            let fileContext = new Context(fileAsStrings)
            let errors: Array<LinterError> = fileContext.getErrors()
            expect(errors.length).to.equal(1)
            expect(errors[0].getLineContent()).to.equal(fileAsStrings[2])
            expect(errors[0].getLineContent().length).to.equal(137)
            expect(errors[0].getLineNumber()).to.equal(3)
            expect(errors[0].toString()).to.contain('Line exceeds the limit of 120 characters')
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

describe("Whitespace", () => {
    describe("Should warn about missing whitespaces.", () => {
        it("Should't warn when there are no errors.", () => {
            let fileContext = new Context(new Array<string>(
                'private class MyClass {',
                '    public String returnString () {',
                '        if (condition) {',
                '            something;',
                '        }',
                '    }',
                '}'
            ))
            expect(fileContext.getErrors().length).to.equal(0)
        }),
        it("Should warn on 'if's.", () => {
            let fileContext = new Context(new Array<string>(
                'private class MyClass {',
                '    public String returnString () {',
                '        if(condition) {',
                '            something;',
                '        }',
                '    }',
                '}'
            ))
            expect(fileContext.getErrors().length).to.equal(1)
            expect(fileContext.getErrors()[0].getLineNumber()).to.equal(3)
        }),
        it("Should warn on 'for's.", () => {
            let fileContext = new Context(new Array<string>(
                'private class MyClass {',
                '    public String returnString () {',
                '        for(condition) {',
                '            something;',
                '        }',
                '    }',
                '}'
            ))
            expect(fileContext.getErrors().length).to.equal(1)
            expect(fileContext.getErrors()[0].getLineNumber()).to.equal(3)
        }),
        it("Should warn on 'else's.", () => {
            let fileContext = new Context(new Array<string>(
                'private class MyClass {',
                '    public String returnString () {',
                '        if (condition) {',
                '            something;',
                '        }else {',
                '            something;',
                '        }',
                '    }',
                '}'
            ))
            expect(fileContext.getErrors().length).to.equal(1)
            expect(fileContext.getErrors()[0].getLineNumber()).to.equal(5)
        }),
        it("Should warn on 'else's.", () => {
            let fileContext = new Context(new Array<string>(
                'private class MyClass {',
                '    public String returnString () {',
                '        if (condition) {',
                '            something;',
                '        } else{',
                '            something;',
                '        }',
                '    }',
                '}'
            ))
            expect(fileContext.getErrors().length).to.equal(1)
            expect(fileContext.getErrors()[0].getLineNumber()).to.equal(5)
        }),
        it("Should warn on 'else's.", () => {
            let fileContext = new Context(new Array<string>(
                'private class MyClass {',
                '    public String returnString () {',
                '        if (condition) {',
                '            something;',
                '        }else{',
                '            something;',
                '        }',
                '    }',
                '}'
            ))
            expect(fileContext.getErrors().length).to.equal(2)
            expect(fileContext.getErrors()[0].getLineNumber()).to.equal(5)
            expect(fileContext.getErrors()[1].getLineNumber()).to.equal(5)
        })
    })
})