# apexlint
An Apex linter written in TypeScript (work in progress)

# About this repository

As the title says, this is a work in progress linter for the Apex language.

I'm building this to assist me with writing better code for the Salesforce ☁ platform. Think about simple stuff like line length, method names, and some styling. I do plan, in the long run, if everything I mentioned before works, to make this work for checking types and references (even though those are caught at compile-time by the platform, for some of us it would be nice to have those errors handled before sending the files to the platform's servers).

Other reasons to create this thing is to learn how to write a linter, because there are no How To's online (at least not as of 4 Mar 2018).

# Things that are nice and would be nice to have.

* [ ] Be able to run the linter from the command line (should be a priority when getting more items done in this list)
* [x] Make the linter read and sort the code by contexts.
* [ ] Make the linter able to distinguish between context types (class scope, method scope, etc).
* [x] Basic rules with error outputs, like maximum line length.
* [ ] Detect SOQL statements used in one line and inside `for` loops as list variable.
* [ ] Basic detection of SOQL statements inside loop structures.

# License

Copyright 2018 Renato Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
