# Apex Code Conventions

March 17, 2018

THIS DOCUMENT IS PROVIDED “AS IS” WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR
IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
THIS DOCUMENT COULD INCLUDE TECHNICAL INACCURACIES OR TYPOGRAPHICAL ERRORS.
CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN; THESE CHANGES WILL BE
INCORPORATED IN NEW EDITIONS OF THE DOCUMENT. SUN MICROSYSTEMS, INC. MAY MAKE
IMPROVEMENTS AND/OR CHANGES IN THE PRODUCT(S) AND/OR THE PROGRAM(S) DESCRIBED IN THIS
DOCUMENT AT ANY TIME.

## 1. Introduction

### 1.1 Why

Code Conventions are important because most of the cost of software is for maintenance, hardly a software will be maintained by the original author, conventiosns improve code readability and allow code written by many people to be standardized, which helps understanding of what it does.

### 1.2 Acknowledgements

This document reflects the Java coding standards presented in the Java Code Conventions, from Oracle Corporation, written in 1997, since Apex is so much similar to Java (syntax-wise).

For questions concerning adaptation, modification, or redistribution of this document, please open an issue on this repository. Comments on this document should be submited as issues on said repository as well.

## 2. File Names

### 2.1 File Suffixes

Apex source files should be saved with the prefix `.cls` for common classes and `.trigger.` for triggers.

| File type | Suffix   |
| --------- | -------- |
| Class     | .cls     |
| Trigger   | .trigger |

### 2.2 Common File Names

#### 2.2.1 Classes

It is very usual for a developer to work with both file types specified on 2.1. For classes, they should not be the same as standard or custom objects names. For instance, we have the `Account` standard object. One shouldn't create a class called `Account.cls`. If you need a wrapper class for your objects, consider adding "Wrapper" to its name, like `AccountWrapper.cls`.

#### 2.2.2 Triggers

For triggers, since they are separated from the common classes, it is acceptable to give it the name of your object.

## 3. File Organization

An Apex source file consists of sections that should be separated by blank lines with no empty strings, and an optional comment identifying each section.

Files longer than 2000 lines are cumbersome and should be avoided.

### 3.1 Apex Source Files

Each Apex source file contains a single class, trigger or interface.

Apex source files have the following ordering:

1. Beginning Comments
2. Class or interface declarations

#### 3.1.1 Beginning Comments

All source files should begin with a comment that lists the programmer(s), the date, a copyright notice, if applicable, and also a brief description of the purpose of the program.

For example:

```java
/*
 * Author(s):
 *  - John
 *  - Mary
 *  - Fernando
 *
 * Copyright (C) TheCompanyName, Inc
 *
 * March 2018
 *
 * This is a callable class, that should do this and that...
 */
```

#### 3.1.2 Class and Interface Declarations

|   | Part of Class/Interface declaration | Notes |
| - | ----------------------------------- | ----- |
| 1 | Class/interface documentation comment (/\*\*/) | - |
| 2 | `class` or `interface` statement | - |
| 3 | Class/interface implementation comment, if necessary | - |
| 4 | Class (static) variables | First the `public` class variables, then the `protected` and finally the `private`. |
| 5 | Instance variables | First `public`, then `protected` and finally `private` variables. |
| 6 | Constructors | - |
| 7 | Methods | - |

## 4. Indentation

Four spaces should be used as the unit of indentation. The exact construction of the indentation should be the space.

### 4.1 Line Length

Avoid lines longer than 100 characters, for consistency with IDEs and text editors. If a line exceeds 100 characters, it should be broken into two or more lines, depending on the situation (see below).

### 4.2 Wrapping Lines

#### 4.2.1 Principles

When an expression will not fit on a single line, break it according to these general principles:

- Break after a comma.
- Break before an operator.
- Prefer higher-level breaks to lower-level breaks.
- Align the new line with the beginning of the expression at the same level on the previous line.
- If the above rules lead to confusing code or to code that is squished up against the right margin, just indent 8 spaces (2 tabs) instead.

#### 4.2.2 Examples

##### 4.2.2.1 Method Signatures

```java
private class SomeClass {
    public static void doSomethingReallyComplicated(Integer sumOfSomething, Decimal anotherSum,
            String nameOfThatThing) {
        Object someObject = SomeOtherClass.getObject();
        // ...
    }
}
```

The method line above has 95 characters (counting the 4 whitespaces before `public`), and it applies the first principle of breaking after a comma. Note that by using an extra indentation on the signature on the lower line we avoid the confusion of where the scope actually starts.

##### 4.2.2.2 Instance Declarations

```java
public with sharing class SomeClass {
    // ...
    public void someMethod () {
        AnotherClass.AClassChildren bigVariableName
            = new AnotherClass.AClassChildren(this.someVariable);
    }
}
```

The instance declaration on line 3 would use 105 characters, but with the principle of breaing before an operator it will use 65 characters on the lower line.

##### 4.2.2.3 Conditionals

```java
// DON'T DO THIS
if ((condition1 && condition2)
    || (condition3 && ocndition4)
    || !(condition5 && condition6)) {
    doSomething();
}
```

```java
//DO THIS
if ((condition1 && condition2)
        || (condition3 && condition4)
        || !(condition5 && condition6)) {
    doSomething();
}
```

Bad wraps like the one on the first example make easy to miss the part where the method's signature ends and when the scope actually begins. Good wraps help to make those clearer, and not so easy to miss.

##### 4.2.2.4 Ternary Expressions

```java
// if it fits on the 100 character limit:
result = (aLongExpression) ? something : anotherThing;

// if it doesn't fit the 100 character limit use this:
result = (aLongExpression) ? something
                           : anotherThing;

// or this:
result = (aLongexpression)
         ? something
         : anotherThing;

```

As exemplified above, there are three ways to format ternary expressions.

### 5. Comments

Apex has only one type of comment, which can be written in two ways, using `/*..*/` (multi-line) and `//` (single-line).

Example:

```java
// this is a single line comment

/*
this is a multi-line comment
*/
```

Comments should be used to give an overview of the code, and provide additional information that is not explicit in the code itself. Comments should ideally contain only information that is relevant for that specific program. Information about what a class or method does which is not explicit by its name, for example.

Discussion of nontrivial or nonobvious design decisions is appropriate, but avoid duplicating information that is present in the code. It is easy to get redundant comments in the same file. In general, avoid any comments that are likely to get out of date as your application evolves.

The frequency of comments sometimes can reflect poor code quality. If you often feel the need of commenting code inside methods consider rewriting the code to make it clearer and the comment unecessary. Comments should ideally be used on top of classes and methods only.

Comments should not be enclosed in large boxes drawn with asterisks or other characters (ASCII Art). Comments should never include special characters such as form-feed and backspace, and they should respect the 100-charcter limit.

### 6. Declarations

#### 6.1 Placement

Put declarations only at the beginning of blocks/scopes. Don't wait to declare variables until their first use; it can confuse the unwary programmer and hamper code portability within the scope.

```java
public void doSomething () {
    Integer anInteger = 0;                  // beginning of the method scope

    //... code that doesn't actually use the variable, but we have it
    // declared already.

    if (condition) {
        Integer anotherInteger = anInteger; // beginning of the "if" scope
        ...
    }
}
```

#### 6.2 Initialization

Try to initialize local variables where they are declared. The only acceptable reason not to initialize a variable where it is declared is if the initial value depends on some computation.

#### 6.3 Class and Interface Declarations

The following formatting rules should be followed when coding Apex classes and interfaces:

- A single space between a method name and the parenthesis "(" starting its parameter list
- Open brace "{" appears at the end of the same line as the declaration statement
- Closing brace "}" starts a line by itself indented to match its corresponding opening statement, except when it is a null statement the "}" should appear immediately after the "{".

Class example:

```java
// class
public without sharing class MyClass {
    // method
    public static void myMethod () {
        ...
    }

    // null statement example
    public class CustomException extends Exception {}
}
```

### 7. Statements

#### 7.1 Simple Statements

Each line should contain at most one statement.

```java
// DON'T DO THIS
myInt++; otherInt--;

// DO THIS
myInt++;
otherInt++;
```

#### 7.2 Return Statements

A `return` statement with a value should not use parentheses unless they make the return value more obvious in some way.

```java
return;

return listOfRecords.size();

return (length ? length : defaultLength);
```

#### 7.3 If, If-else, If-else-if Statements

The `if-else` class of statements should have the following form:

```java
if (condition) {
    ...
}

if (condition) {
    statements;
} else {
    statements;
}

if (condition) {
    statements;
} else if (condition) {
    statements;
} else {
    statements;
}
```

Always avoid omitting the braces when using single-line statements inside a condition block, like this:

```java
if (condition) // PLEASE DON'T OMIT THE BRACES!
    statements;
```

#### 7.4 "for" Statements

A for statement should have one of the following forms:

##### 7.4.1 With indexes

If you need the index of the elements you are iterating with the `for` loop, ideally you should use the following syntax:

```java
for (Integer index = 0; index < myList.length(); index++) {
    statements
}
```

Avoid using more than three variables. If needed, use separate statements to compute the three variables before.

##### 7.4.2 Without indexes

On the Salesforce platform, most of the time this will be the syntax used. With this one you don't have easy access to the index, like in the previous example, but it is more readable:

```java
for (Object anObject : myListOfObject) {
    statements
}
```

#### 7.5 "while" Statements

A `while` statement should have the following form:

```java
while (condition) {
    statements;
}
```

#### 7.6 "do-while" Statements

A `do-while` statement should have the following form:

```java
do {
    statements
} while (condition);
```

#### 7.7 "try-catch" Statements

A `try-catch` statement should have the following format:

```java
try {
    statement;
} catch (Exception e) {
    statements;
}
```

### 8. White Space

Blank lines improve readability by setting off sections of code that are logically related.

Two blank lines should be used in the following:

- Between sections of a source file
- Between class and interface definitions

One blank line should be used in the following:

- Between methods
- Between the local variables in a method and its first statement
- Before a block or a single line comment

#### 8.2 Blank Spaces

Blank spaces should be used in the following circumstances:

- A keyword followed by a parenthesis should be separated by a single space.

```java
while(true){ // WRONG
    ...
}

while (true) { // CORRECT
    ...
}
```

- A blank space should appear after commas in argument lists.

```java
method(Object anObjectArg,Integer anIntegerArg){ // WRONG
    ...
}

method(Object anObjectArg, Integer anIntegerArg) { // CORRECT
    ...
}
```

- Expressions inside a `for` statement:

```java
for (Integer i=0;i<10;i++) { // WRONG
    ...
}

for (Integer i = 0; i < 10; i++) { // CORRECT
    ...
}
```

- Object casts:

```java
ObjectA objInstance = (ObjectA)anotherType; // WRONG

ObjectA objInstance = (ObjectA) anotherType; // CORRECT
```

### 9. Naming Conventions

Naming conventions make programs more understandable by making them easier to read. They can also give information about what they actually do (for example, whether it is a constant or class) which is helpful in understanding the code.

| Identifier Type | Rules for Naming | Examples |
| --------------- | ---------------- | -------- |
| Classes | Class names should be nouns, written in CamelCase. Avoid acronyms and abbreviations (unless the abbreviation is much more widely used than the long form, like "HTML" or "URL"). | `AccountWrapper`, `AttachmentHandler` |
| Interfaces | Same as classes, but starting with a capitalized "I" | `IAccountable`, `IHandler` |
| Methods | Methods should be verbs, in CamelCase with the first letter lowercase. | `run();`, `runFaster();`, `runInSomeParticularWay();` |
| Variables | Variable names should be short yet meaningful, except when they are "disposable", like inside loops. | `Integer maximumSize = 10;`, `for (Integer i = 0; i < 10; i++) {` |
| Constants | Names of variables declared as constants should be written in uppercase with words separated by underscores (`_`). | `MAX_WIDTH = 10` |

### 10. Programming Practices

#### 10.1 Providing Access to Instance and Class Variables

Don't make any instance or class variable public without a good reason. Those often don't need to be explicitly set or gotten as this often happens as a side effect of method calls.

One example of appropriate public instance variables is the case where the class is essentially a data structure, like a wrapper to an object, with no behaviour. If Apex supported `struct`, we could use that.

#### 10.2 Constants

Numerical constants (literals) should be coded directly only if they won't really be modified in the future. The first N numbers of Pi por example (3.14159265).

#### 10.3 Variable Assignments

Do not use embedded assignments in an attempt to improve run-time performance. This is the job of the compiler. Example:

```java
d = (a + b - c) / z; // NOT OK

// OK
d = a + b;
d -= c;
d /= z;
```

#### 10.4 Miscellaneous Practices

##### 10.4.1 Parentheses

It is a good idea to use parentheses liberally in expressions involving mixed operators to avoid operator precedence problems and to let the order clear for other programmers as well.

```java
if (a == b && c == d)    // NO

if ((a == b) && (c ==d)) // YES
```

##### 10.4.2 Returning Values

Try to make the structure of the program match the intent. Example:

```java
if (condition) {
    return true;
} else {
    retunr false;
}
```

can easily be written with:

```java
return condition;
```

In a similar way,

```java
if (condition) {
    return x;
}
return y;
```

should be written as:

```java
return (condition ? x : y)
```

##### 10.4.3 Expressions before "?" in the Ternary Operator

If an expression containing an operator before the `?` in the ternary operator, it should be parenthesized:

```java
(x == 0) ? a : b;
```

##### 10.4.4 Special Comments

If you find a code that requires your attention later, or someone else's, you should flag it accordingly.

| Case | Flag |
| ---- | ---- |
| Something is bogus but works | `// XXX` |
| Something is bogus and does not work | `// FIXME` |
| Something needs to be done, but you or your team don't have the necessary attention to do it right now. | `// TODO: <small description of what to do>` |
