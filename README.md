# apexlint

[![npm version](https://badge.fury.io/js/apexlint.svg)](https://badge.fury.io/js/apexlint) [![travis-ci](https://travis-ci.org/renatoliveira/apexlint.svg?branch=master)](https://travis-ci.org/renatoliveira/apexlint)

An Apex linter written in TypeScript (work in progress)

## About this repository

As the title says, this is a work in progress linter for the Apex language.

I'm building this to assist me with writing better code for the Salesforce ☁ platform. Think about simple stuff like line length, method names, and some styling. I do plan, in the long run, if everything I mentioned before works, to make this work for checking types and references (even though those are caught at compile-time by the platform, for some of us it would be nice to have those errors handled before sending the files to the platform's servers).

Other reasons to create this thing is to learn how to write a linter, because there are no How To's online (at least not as of 4 Mar 2018).

## Some things that are nice and would be nice to have

* [ ] Be able to run the linter from the command line (should be a priority when getting more items done in this list)
* [x] Make the linter read and sort the code by contexts.
* [ ] Make the linter able to distinguish between context types (class scope, method scope, etc).
* [x] Basic rules with error outputs, like maximum line length.
* [x] Detect SOQL statements used in one line
* [ ] Detect SOQL statements inside `for` loops as list variable.
* [ ] Basic detection of SOQL statements inside loop structures.
* and more...

## Installation

This tool can be installed with npm or yarn, and you should link it for it to be available globally.

Like this on npm:

```npm install apexlint -g```

Or this with yarn:

```yarn global add apexlint```

## Uninstall

Using npm, you can uninstall it by issuing the same install command, but r
replacing `install` with `uninstall`:

```npm uninstall apexlint -g```

or, with yarn:

```yarn global remove apexlint```

## License

Copyright 2018 Renato Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
