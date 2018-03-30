# apexlint

[![npm version](https://badge.fury.io/js/apexlint.svg)](https://badge.fury.io/js/apexlint) [![travis-ci](https://travis-ci.org/renatoliveira/apexlint.svg?branch=master)](https://travis-ci.org/renatoliveira/apexlint)

An Apex linter written in TypeScript (work in progress)

## About this repository

As the title says, this is a work in progress linter for the Apex language.

I'm building this to assist me with writing better code for the Salesforce ☁ platform. Think about simple stuff like line length, method names, and some styling. I do plan, in the long run, if everything I mentioned before works, to make this work for checking types and references (even though those are caught at compile-time by the platform, for some of us it would be nice to have those errors handled before sending the files to the platform's servers).

Other reasons to create this thing is to learn how to write a linter, because there are no How To's online (at least not as of 4 Mar 2018).

Check the project's [issue board](https://github.com/renatoliveira/apexlint/issues) board to see what's on the roadmap.

## Installation

This tool can be installed with npm or yarn, and you should link it for it to be available globally.

Like this on npm:

```npm install apexlint -g```

Or this with yarn:

```yarn global add apexlint```

## Uninstall

Using npm, you can uninstall it by issuing the same install command, but replacing `install` with `uninstall`:

```npm uninstall apexlint -g```

or, with yarn:

```yarn global remove apexlint```

## Error codes

This tool detects some undesired patterns in your Apex code. Sometimes the code is designed in a way which you can't really refactor it at the moment, or you simply don't want to. 

Each error detected has a different code, and you can supress those detections with comments in your Apex code, like the following:

```java
//linter-ignore-W0001
List<Object> aList = [SELECT Id, Field FROM Object];
```

This line would normally be detected by the tool as codes `W0001` and `W0002`, but now is detected only as `W0002`.

Comments to ignore errors should preferrably be made on the line above the error detection, so the following won't work, for example:

```java
// notice the extra line between the comment and the actual line:

//linter-ignore-W0001

List<Object> aList = [SELECT Id, Field FROM Object];

// comment on the same line as the error

List<Object> aList = [SELECT Id, Field FROM Object]; //linter-ignore-W0001
```

## License

Copyright 2018 Renato Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
