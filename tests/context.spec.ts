import { expect } from 'chai'
import { Context } from "../src/Context"
import { ContextType } from "../src/Context"
import { LinterError } from '../src/LinterError';

describe("Scope context detection.", () => {
    it("Should detect the class context.", () => {
        let testContext = new Context(new Array<string>(
            'private class MyClass {',
            '    // ...',
            '}'
        ))
        expect(testContext.getContext()).to.equal(ContextType.CLASS)
    }),
    it("Should detect the method context.", () => {
        let testContext = new Context(new Array<string>(
            '    public void doSomething() {',
            '        empty();',
            '    }',
        ))
        expect(testContext.getContext()).to.equal(ContextType.METHOD)
    }),
    it("Should detect the class and method contexts.", () => {
        let fileContext = new Context(new Array<string>(
            'private class MyClass {',
            '    public void doSomething() {',
            '        empty();',
            '    }',
            '}'
        ))
        expect(fileContext.getContext()).to.equal(ContextType.CLASS)
        // the class context should contain the method context
        let fileContextChildren = fileContext.getChildContexts()
        
        // should get the method context
        expect(fileContextChildren.length).to.equal(1)

        // the method context should not have children
        expect(fileContextChildren[0].getChildContexts().length).to.equal(0)

        // the method context should have be flagged accordingly
        expect(fileContextChildren[0].getContext()).to.equal(ContextType.METHOD)
    })
})

describe("Context sorting/nesting", () => {
    it("Should correctly nest methods inside classes when analyzing contexts.", () => {
        let classContext = new Context(new Array<string>(
            'private class QueryClass {',
            '    public List<Account> getAccounts() {',
            '        return [SELECT Id FROM Account];',
            '    }',
            '}'
        ))
        expect(classContext.getChildContexts().length).to.equal(1)
    }),
    it("Should not set any child context.", () => {
        let classContext = new Context(new Array<string>(
            'private class QueryClass {',
            '    // hello! ignore me',
            '}'
        ))
        expect(classContext.getChildContexts().length).to.equal(0)
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
    })
})