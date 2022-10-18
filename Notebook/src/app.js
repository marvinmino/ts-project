"use strict";
exports.__esModule = true;
var Category_1 = require("./Category");
var Note_1 = require("./Note");
var notesDiv = document.getElementById('notesDiv');
var catDiv = document.getElementById('categoriesDiv');
var writeNoteButton = document.getElementById('writeNoteButton');
writeNoteButton.addEventListener('click', createNote);
var newCategoryButton = document.getElementById('newCategoryButton');
newCategoryButton.addEventListener('click', createCategory);
var openNewNoteButton = document.getElementById('openNewNoteButton');
openNewNoteButton.addEventListener('click', openNewNotePopup);
var closeNewNoteButton = document.getElementById('closeNewNoteButton');
closeNewNoteButton.addEventListener('click', closeNewNotePopup);
var newNotePopup = document.getElementById('newNoteDiv');
var overlay = document.getElementById('overlay');
function openNewNotePopup() {
    newNotePopup.classList.add('active');
    overlay.classList.add('active');
}
function closeNewNotePopup() {
    newNotePopup.classList.remove('active');
    overlay.classList.remove('active');
}
var categories = getCategories();
var selectedCategory;
renderCategories(categories);
selectCategory(categories[0]);
// @ts-ignore
renderNotes(selectedCategory);
function createNote() {
    if (selectedCategory !== undefined) {
        var noteTitleInput = document.getElementById('newNoteTitle');
        var noteContentInput = document.getElementById('noteContentArea');
        if (noteTitleInput.value.trim().length && noteContentInput.value.trim().length) {
            var newNoteTitle = document.getElementById('newNoteTitle').value;
            document.getElementById('newNoteTitle').value = '';
            var newNoteContent = document.getElementById('noteContentArea').value;
            document.getElementById('noteContentArea').value = '';
            var newNote = new Note_1.Note(newNoteTitle, newNoteContent, selectedCategory.name);
            saveNote(newNote);
        }
    }
}
function createCategory() {
    var catNameInput = document.getElementById('newCategoryName');
    var categoryName = catNameInput.value;
    if (categoryName.trim().length) {
        catNameInput.value = '';
        var notes = [];
        var newCategory = new Category_1.Category(categoryName, notes);
        selectedCategory = newCategory;
        saveCategory(newCategory);
        selectCategory(newCategory);
    }
}
function updateNoteCount(category) {
    var catElms = catDiv.children;
    for (var i = 0; i < catElms.length; i++) {
        var categoryName = catElms[i].querySelector('.categoryName').innerText;
        if (category.name === categoryName) {
            catElms[i].querySelector('.noteCount').innerText = String(category.notes.length);
        }
    }
}
function saveCategory(category) {
    categories.push(category);
    localStorage.setItem('categories', JSON.stringify(categories));
    reRenderCategories();
    reRenderNotes(selectedCategory);
}
function saveNote(newNote) {
    selectedCategory.notes.push(newNote);
    localStorage.setItem('categories', JSON.stringify(categories));
    updateNoteCount(selectedCategory);
    reRenderNotes(selectedCategory);
}
function getCategories() {
    if (localStorage.length !== 0) {
        var cats = localStorage.getItem('categories');
        return JSON.parse(cats);
    }
    else {
        return [];
    }
}
function renderCategories(categories) {
    categories.forEach(function (cat) {
        var categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        var categoryName = document.createElement('h3');
        categoryName.classList.add('categoryName');
        categoryName.innerText = cat.name;
        var notesCount = document.createElement('p');
        notesCount.classList.add('noteCount');
        notesCount.innerText = String(cat.notes.length);
        var selectedIndicatorDiv = document.createElement('div');
        selectedIndicatorDiv.classList.add('selectedIndicator');
        var deleteCatButton = document.createElement('button');
        deleteCatButton.classList.add('deleteCatButton');
        deleteCatButton.innerHTML = '<i class="fa fa-light fa-trash"></i>';
        deleteCatButton.addEventListener('click', deleteCategory);
        var updateCatButton = document.createElement('button');
        updateCatButton.classList.add('updateCatButton');
        updateCatButton.innerHTML = '<i class="fa fa-edit"></i>';
        updateCatButton.addEventListener('click', updateCategory);
        categoryDiv.appendChild(selectedIndicatorDiv);
        categoryDiv.appendChild(updateCatButton);
        categoryDiv.appendChild(deleteCatButton);
        categoryDiv.appendChild(categoryName);
        categoryDiv.appendChild(notesCount);
        catDiv.appendChild(categoryDiv);
        categoryDiv.addEventListener('click', clickCategory);
    });
}
function renderNotes(category) {
    if (category !== undefined) {
        var notes = category.notes;
        notes.forEach(function (note) {
            var noteDiv = document.createElement('div');
            noteDiv.classList.add('note');
            var noteTitle = document.createElement('h3');
            noteTitle.classList.add('noteTitle');
            noteTitle.innerText = note.title;
            var noteContent = document.createElement('p');
            noteContent.classList.add('noteContent');
            noteContent.innerText = note.content;
            var deleteNoteButton = document.createElement('button');
            deleteNoteButton.classList.add('deleteNoteButton');
            deleteNoteButton.innerHTML = '<i class="fa fa-light fa-trash"></i>';
            deleteNoteButton.addEventListener('click', deleteNote);
            noteDiv.appendChild(noteTitle);
            noteDiv.appendChild(noteContent);
            noteDiv.appendChild(deleteNoteButton);
            notesDiv.appendChild(noteDiv);
        });
    }
}
function clickCategory(e) {
    var clickedCategory = e.target;
    var categoryName = clickedCategory.querySelector('.categoryName').innerText;
    categories.forEach(function (cat) {
        if (categoryName == cat.name) {
            selectedCategory = cat;
        }
    });
    toggleCategories(clickedCategory);
    reRenderNotes(selectedCategory);
}
function toggleCategories(categoryElm) {
    var categories = catDiv.children;
    for (var i = 0; i < categories.length; i++) {
        if (categoryElm === categories[i]) {
            categories[i].classList.add('selectedCategory');
        }
        else {
            categories[i].classList.remove('selectedCategory');
        }
    }
}
function deleteCategory(event) {
    var item = event.target;
    if (item.classList[0] === 'deleteCatButton') {
        var category = item.parentElement;
        var categoryName_1 = category.querySelector('.categoryName').innerText;
        category.remove();
        categories.forEach(function (cat) {
            if (cat.name === categoryName_1) {
                categories.splice(categories.indexOf(cat), 1);
            }
        });
        localStorage.setItem('categories', JSON.stringify(categories));
        if (selectedCategory.name === categoryName_1) {
            deSelectedCategory();
        }
        reRenderNotes(selectedCategory);
    }
}
function updateCategory(event) {
    var item = event.target;
    if (item.classList[0] === 'updateCatButton') {
        var category = item.parentElement;
        var categoryName_2 = category.querySelector('.categoryName').innerText;
        category.remove();
        categories.forEach(function (cat) {
            if (cat.name === categoryName_2) {
                categories.splice(categories.indexOf(cat), 1);
            }
        });
        localStorage.setItem('categories', JSON.stringify(categories));
        if (selectedCategory.name === categoryName_2) {
            deSelectedCategory();
        }
        reRenderNotes(selectedCategory);
    }
}
function deleteNote(event) {
    var item = event.target;
    if (item.classList[0] === 'deleteNoteButton') {
        var note = item.parentElement;
        var noteTitle_1 = note.querySelector('.noteTitle').innerText;
        var notes_1 = selectedCategory.notes;
        notes_1.forEach(function (note) {
            if (noteTitle_1 == note.title) {
                notes_1.splice(notes_1.indexOf(note), 1);
            }
        });
        localStorage.setItem('categories', JSON.stringify(categories));
        updateNoteCount(selectedCategory);
        reRenderNotes(selectedCategory);
    }
}
function deSelectedCategory() {
    // @ts-ignore
    selectedCategory = undefined;
    var categories = catDiv.children;
    for (var i = 0; i < categories.length; i++) {
        categories[i].classList.remove('selectedCategory');
    }
}
function selectCategory(category) {
    selectedCategory = category;
    var catElms = catDiv.children;
    for (var i = 0; i < catElms.length; i++) {
        var catTitle = catElms[i].querySelector('.categoryName').innerText;
        if (catTitle === category.name) {
            toggleCategories(catElms[i]);
        }
    }
}
function reRenderNotes(cat) {
    notesDiv.innerHTML = '';
    renderNotes(cat);
}
function reRenderCategories() {
    catDiv.innerHTML = '';
    renderCategories(categories);
}
