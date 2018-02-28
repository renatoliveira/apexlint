/*
Easy test. Should output 2 contexts (class and method)
And should ignore the bracket inside the System.debug statement.
*/
public class SomeClass {
    public static void someStaticMethod () {
        System.debug('This loose bracket { should be ignored by the linter, since it is a string.')
    }
}