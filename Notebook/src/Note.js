"use strict";
exports.__esModule = true;
exports.Note = void 0;
var Note = /** @class */ (function () {
    function Note(title, content, categoryName) {
        this.title = title;
        this.content = content;
        this.categoryName = categoryName;
    }
    Note.prototype.getTitle = function () {
        return this.title;
    };
    Note.prototype.setTitle = function (title) {
        this.title = title;
    };
    Note.prototype.getContent = function () {
        return this.content;
    };
    Note.prototype.setContent = function (content) {
        this.content = content;
    };
    Note.prototype.getCategoryName = function () {
        return this.categoryName;
    };
    Note.prototype.setCategoryName = function (categoryName) {
        this.categoryName = categoryName;
    };
    return Note;
}());
exports.Note = Note;
