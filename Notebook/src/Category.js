"use strict";
exports.__esModule = true;
exports.Category = void 0;
var Category = /** @class */ (function () {
    function Category(name, notes) {
        this.name = name;
        this.notes = notes;
    }
    Category.prototype.getName = function () {
        return this.name;
    };
    Category.prototype.setName = function (name) {
        this.name = name;
    };
    Category.prototype.getNotes = function () {
        return this.notes;
    };
    Category.prototype.setNotes = function (notes) {
        this.notes = notes;
    };
    return Category;
}());
exports.Category = Category;
