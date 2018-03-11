"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Results = (function () {
    function Results() {
        this.errors = new Array();
    }
    Results.prototype.addErrors = function (errors) {
        this.errors = this.errors.concat(errors);
    };
    Results.prototype.report = function () {
        if (this.errors.length == 0) {
            console.log('✅ No errors found.');
        }
        this.errors.forEach(function (err) {
            console.error('❌ ' + err);
        });
    };
    return Results;
}());
exports.Results = Results;
