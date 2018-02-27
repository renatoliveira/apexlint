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
        }
    }

    // TODO: Create methods with return
}