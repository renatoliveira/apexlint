public without sharing class SomeWithoutSharingClass {
    private static Map<String, SomeObject__c> privateStaticStringToObjectMap;
    public static Map<String, SomeObject__c> publicStaticStringToObjectMap;

    public static void staticMethodWithoutReturnAndArgs () {
        // no args to see here
    }

    public void methodWithoutReturnAndArgs () {
        // no args to see here
    }

    public static void staticMethodWithoutReturn (String stringArg) {
        // no args to see here
    }

    public void methodWithoutReturn (String stringArg) {
        // no args to see here
    }

    public void methodWithLoop () {
        for (Object o : OtherClass.getObjects()) {
            methodWithoutReturnAndArgs();
            SomeWithoutSharingClass.staticMethodWithoutReturnAndArgs();
        }
    }

    public List<Account> methodWithOneLineSOQL () {
        return [SELECT Id FROM Account];
    }

    public List<Account> methodWithMultipleLinesSOQL () {
        return [
            SELECT
            Id
            ,Name
            FROM Account
        ];
    }

    public void someMethodWithSOQLInsideLoop () {
        for (Object__c variable : [SELECT Id, Field__c FROM Object__c WHERE Something__c = 'none']) {
            something(variable);
        }
    }

    // TODO: Create methods with return
}