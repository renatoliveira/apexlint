"use strict";
exports.__esModule = true;
var fs = require("fs");
if (process.argv.length < 3) {
    console.error("❗️ Should specify which file or folder to run.");
}
console.log(process.argv);
// if (process.argv[2].charAt(process.argv[2].length) == '/') {
//     console.log("Running on folder...")
// } else
if (process.argv[2].search('\\.cls')) {
    console.log("Running on file.");
}
try {
    var fileToRead = fs.readFileSync(process.argv[2], 'utf-8');
}
catch (e) {
    console.error("❗️ File couldn't be read.");
    process.exit();
}
