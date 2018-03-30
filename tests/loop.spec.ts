import { expect } from 'chai'
import { LoopType, Loop, Context, ContextType } from "../src/Context"
import { RuleViolation } from '../src/RuleViolation';

describe("Loop Type", () => {
    it("Should detect the do-while kind.", () => {
        let loopContext: Loop = new Loop(new Context(new Array<string>(
            'do {',
            '    something();',
            '} while (true);'
        )))
        expect(loopContext.getKind()).to.equal(LoopType.DO_WHILE)
    }),
    it("Should detect the for kind with initialization.", () => {
        let loopContext: Loop = new Loop(new Context(new Array<string>(
            'for (Integer i = 0; i < 10; i++) {',
            '    something();',
            '}'
        )))
        expect(loopContext.getKind()).to.equal(LoopType.FOR_CONDITION)
    }),
    it("Should detect the for kind with array/set.", () => {
        let loopContext: Loop = new Loop(new Context(new Array<string>(
            'for (Object o : someList) {',
            '    something();',
            '}'
        )))
        expect(loopContext.getKind()).to.equal(LoopType.FOR_ARRAY)
    }),
    it("Should detect the for kind with inline SOQL.", () => {
        let loopContext: Loop = new Loop(new Context(new Array<string>(
            'for (Object o : [SELECT Id FROM Object]) {',
            '    something();',
            '}'
        )))
        expect(loopContext.getKind()).to.equal(LoopType.FOR_SOQL)
    })
})

describe("Find anonymous SOQL variable.", () => {
    it("Should detect the SOQL inside parenthesis.", () => {
        let methodContext: Context = new Context(new Array<string>(
            'for (Object__c variable : [SELECT Id, Field__c FROM Object__c WHERE Something__c = \'none\']) {',
            '    something(variable);',
            '}',
        ))
        let errors: Array<RuleViolation> = methodContext.getErrors()
        expect(methodContext.getContextType()).to.equal(ContextType.LOOP)
        expect(methodContext.getLoopType()).to.equal(LoopType.FOR_SOQL)
        expect(methodContext.getErrors().length).to.equal(2)
    })
})