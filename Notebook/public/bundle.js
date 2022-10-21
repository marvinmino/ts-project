System.register("Note", [], function (exports_1, context_1) {
    "use strict";
    var Note;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Note = class Note {
                constructor(title, content, categoryName, order = 0) {
                    this.title = title;
                    this.content = content;
                    this.categoryName = categoryName;
                    this.order = order;
                }
                getTitle() {
                    return this.title;
                }
                setTitle(title) {
                    this.title = title;
                }
                getOrder() {
                    return this.order;
                }
                setOrder(order) {
                    this.order = order;
                }
                getContent() {
                    return this.content;
                }
                setContent(content) {
                    this.content = content;
                }
                getCategoryName() {
                    return this.categoryName;
                }
                setCategoryName(categoryName) {
                    this.categoryName = categoryName;
                }
            };
            exports_1("Note", Note);
        }
    };
});
System.register("Category", [], function (exports_2, context_2) {
    "use strict";
    var Category;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Category = class Category {
                constructor(name, notes, order = 0) {
                    this.name = name;
                    this.order = order;
                    this.notes = notes;
                }
                getName() {
                    return this.name;
                }
                setName(name) {
                    this.name = name;
                }
                getOrder() {
                    return this.order;
                }
                setOrder(order) {
                    this.order = order;
                }
                getNotes() {
                    return this.notes;
                }
                setNotes(notes) {
                    this.notes = notes;
                }
            };
            exports_2("Category", Category);
        }
    };
});
System.register("app", ["Category", "Note"], function (exports_3, context_3) {
    "use strict";
    var Category_1, Note_1, notesDiv, catDiv, writeNoteButton, updateNoteButton, newCategoryButton, openNewNoteButton, closeNewNoteButton, openUpdateNoteButton, closeUpdateNoteButton, newNotePopup, updateNotePopup, overlay, categories, selectedCategory;
    var __moduleName = context_3 && context_3.id;
    function openNewNotePopup() {
        newNotePopup.classList.add('active');
        overlay.classList.add('active');
    }
    function closeNewNotePopup() {
        newNotePopup.classList.remove('active');
        overlay.classList.remove('active');
    }
    function openUpdateNotePopup(event) {
        updateNotePopup.classList.add('active');
        const item = event.target;
        let note = item.parentElement;
        let oldNoteName = note.querySelector('.noteTitle').innerText;
        let oldNoteContent = note.querySelector('.noteContent').innerText;
        updateNotePopup.querySelector('#updateNoteNameHidden').value = oldNoteName;
        updateNotePopup.querySelector('#updateNoteTitle').value = oldNoteName;
        updateNotePopup.querySelector('#updateNoteContentArea').value = oldNoteContent;
        overlay.classList.add('active');
    }
    function closeUpdateNotePopup() {
        updateNotePopup.classList.remove('active');
        overlay.classList.remove('active');
    }
    function createNote() {
        if (selectedCategory !== undefined) {
            let noteTitleInput = document.getElementById('newNoteTitle');
            let noteContentInput = document.getElementById('noteContentArea');
            if (noteTitleInput.value.trim().length && noteContentInput.value.trim().length) {
                let newNoteTitle = document.getElementById('newNoteTitle').value;
                document.getElementById('newNoteTitle').value = '';
                let newNoteContent = document.getElementById('noteContentArea').value;
                document.getElementById('noteContentArea').value = '';
                let newNote = new Note_1.Note(newNoteTitle, newNoteContent, selectedCategory.name);
                if (selectedCategory.notes.length === 0) {
                    newNote.order = 1;
                }
                else {
                    newNote.order = selectedCategory.notes[selectedCategory.notes.length - 1].order + 1;
                }
                saveNote(newNote);
            }
        }
    }
    function updateNote(event) {
        var _a;
        const item = event.target;
        let updateNoteDiv = (_a = item.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        let oldName = updateNoteDiv.querySelector('#updateNoteNameHidden').value;
        if (selectedCategory !== undefined) {
            let noteTitleInput = document.getElementById('updateNoteTitle');
            let noteContentInput = document.getElementById('updateNoteContentArea');
            if (noteTitleInput.value.trim().length && noteContentInput.value.trim().length) {
                let updateNoteTitle = noteTitleInput.value;
                let updateNoteContent = noteContentInput.value;
                selectedCategory.notes.forEach(note => {
                    if (note.title === oldName) {
                        note.title = updateNoteTitle;
                        note.content = updateNoteContent;
                    }
                });
            }
            localStorage.setItem('categories', JSON.stringify(categories));
            reRenderNotes(selectedCategory);
            reRenderCategories();
        }
    }
    function createCategory() {
        let catNameInput = document.getElementById('newCategoryName');
        let categoryName = catNameInput.value;
        let order;
        if (categories.length === 0) {
            order = 1;
        }
        else {
            order = categories[categories.length - 1].order + 1;
        }
        if (categoryName.trim().length) {
            catNameInput.value = '';
            let notes = [];
            let newCategory = new Category_1.Category(categoryName, notes, order);
            selectedCategory = newCategory;
            saveCategory(newCategory);
            selectCategory(newCategory);
        }
    }
    function updateNoteCount(category) {
        let catElms = catDiv.children;
        for (let i = 0; i < catElms.length; i++) {
            let categoryName = catElms[i].querySelector('.categoryName').innerText;
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
            let cats = localStorage.getItem('categories');
            return JSON.parse(cats);
        }
        else {
            return [];
        }
    }
    function renderCategories(categories) {
        for (let i = 1; i <= categories.length + 1; i++) {
            categories.forEach(cat => {
                if (cat.order === i) {
                    let categoryDiv = document.createElement('div');
                    categoryDiv.classList.add('category');
                    let categoryName = document.createElement('h3');
                    categoryName.classList.add('categoryName');
                    categoryName.innerText = cat.name;
                    let order = document.createElement('input');
                    order.classList.add('order');
                    order.value = '' + cat.order;
                    order.hidden = true;
                    let notesCount = document.createElement('p');
                    notesCount.classList.add('noteCount');
                    notesCount.innerText = String(cat.notes.length);
                    let selectedIndicatorDiv = document.createElement('div');
                    selectedIndicatorDiv.classList.add('selectedIndicator');
                    let deleteCatButton = document.createElement('button');
                    deleteCatButton.classList.add('deleteCatButton');
                    deleteCatButton.innerHTML = '<i class="fa fa-light fa-trash"></i>';
                    deleteCatButton.addEventListener('click', deleteCategory);
                    let updateCatButton = document.createElement('button');
                    updateCatButton.classList.add('updateCatButton');
                    updateCatButton.innerHTML = '<i class="fa fa-edit"></i>';
                    updateCatButton.addEventListener('click', updateCategory);
                    let categoryTextInput = document.createElement('input');
                    categoryTextInput.classList.add('categoryTextInput');
                    categoryTextInput.setAttribute('type', 'text');
                    categoryTextInput.setAttribute('value', cat.name);
                    let categoryUpdateButton = document.createElement('button');
                    categoryUpdateButton.classList.add('categoryUpdateButton');
                    categoryUpdateButton.innerHTML = 'Submit';
                    categoryUpdateButton.addEventListener('click', updateNameCategory);
                    let updateCategoryDiv = document.createElement('div');
                    updateCategoryDiv.classList.add('updateCategoryDiv');
                    updateCategoryDiv.appendChild(categoryTextInput);
                    updateCategoryDiv.appendChild(categoryUpdateButton);
                    categoryDiv.appendChild(selectedIndicatorDiv);
                    categoryDiv.appendChild(updateCatButton);
                    categoryDiv.appendChild(deleteCatButton);
                    categoryDiv.appendChild(categoryName);
                    categoryDiv.appendChild(notesCount);
                    categoryDiv.appendChild(updateCategoryDiv);
                    categoryDiv.appendChild(order);
                    catDiv.appendChild(categoryDiv);
                    updateCategoryDiv.hidden = true;
                    categoryDiv.addEventListener('click', clickCategory);
                }
            });
        }
    }
    function renderNotes(category) {
        if (category !== undefined) {
            let notes = category.notes;
            for (let i = 1; i <= notes.length + 1; i++) {
                notes.forEach(note => {
                    if (note.order === i) {
                        let noteDiv = document.createElement('div');
                        noteDiv.classList.add('note');
                        let noteTitle = document.createElement('h3');
                        noteTitle.classList.add('noteTitle');
                        noteTitle.innerText = note.title;
                        let noteContent = document.createElement('p');
                        noteContent.classList.add('noteContent');
                        noteContent.innerText = note.content;
                        let categoryContent = document.createElement('input');
                        categoryContent.type = 'text';
                        categoryContent.value = note.categoryName;
                        categoryContent.classList.add('categoryName');
                        categoryContent.hidden = true;
                        let deleteNoteButton = document.createElement('button');
                        deleteNoteButton.classList.add('deleteNoteButton');
                        deleteNoteButton.innerHTML = '<i class="fa fa-light fa-trash"></i>';
                        deleteNoteButton.addEventListener('click', deleteNote);
                        let updateNoteButton = document.createElement('button');
                        updateNoteButton.classList.add('updateNoteButton');
                        updateNoteButton.innerHTML = '<i class="fa fa-edit"></i>';
                        updateNoteButton.addEventListener('click', openUpdateNotePopup);
                        noteDiv.appendChild(noteTitle);
                        noteDiv.appendChild(categoryContent);
                        noteDiv.appendChild(noteContent);
                        noteDiv.appendChild(deleteNoteButton);
                        noteDiv.appendChild(updateNoteButton);
                        notesDiv.appendChild(noteDiv);
                    }
                });
            }
        }
    }
    function clickCategory(e) {
        let clickedCategory = e.target;
        let categoryName = clickedCategory.querySelector('.categoryName').innerText;
        categories.forEach(cat => {
            if (categoryName == cat.name) {
                selectedCategory = cat;
            }
        });
        toggleCategories(clickedCategory);
        reRenderNotes(selectedCategory);
    }
    function toggleCategories(categoryElm) {
        let categories = catDiv.children;
        for (let i = 0; i < categories.length; i++) {
            if (categoryElm === categories[i]) {
                categories[i].classList.add('selectedCategory');
            }
            else {
                categories[i].classList.remove('selectedCategory');
            }
        }
    }
    function deleteCategory(event) {
        const item = event.target;
        if (item.classList[0] === 'deleteCatButton') {
            let category = item.parentElement;
            let categoryName = category.querySelector('.categoryName').innerText;
            category.remove();
            categories.forEach(cat => {
                if (cat.name === categoryName) {
                    categories.splice(categories.indexOf(cat), 1);
                }
            });
            let index = 1;
            categories.forEach(cat => {
                cat.order = index;
                index++;
            });
            localStorage.setItem('categories', JSON.stringify(categories));
            if (selectedCategory.name === categoryName) {
                deSelectedCategory();
            }
            reRenderNotes(selectedCategory);
            reRenderCategories();
        }
    }
    function updateCategory(event) {
        const item = event.target;
        if (item.classList[0] === 'updateCatButton') {
            let category = item.parentElement;
            category.querySelector('.categoryName').hidden = true;
            category.querySelector('.noteCount').hidden = true;
            category.querySelector('.noteCount').hidden = true;
            category.querySelector('.updateCategoryDiv').hidden = false;
        }
    }
    function updateNameCategory(event) {
        var _a;
        const item = event.target;
        if (item.classList[0] === 'categoryUpdateButton') {
            let category = (_a = item.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
            let oldCategory = category.querySelector('.categoryName');
            let oldCategoryName = oldCategory.innerText;
            let categoryUpdateDiv = category.querySelector('.updateCategoryDiv');
            let categoryName = categoryUpdateDiv.querySelector('.categoryTextInput').value;
            oldCategory.innerText = categoryName;
            categories.forEach(cat => {
                if (cat.name === oldCategoryName) {
                    cat.name = categoryName;
                }
            });
            localStorage.setItem('categories', JSON.stringify(categories));
            reRenderNotes(selectedCategory);
            reRenderCategories();
        }
    }
    function deleteNote(event) {
        const item = event.target;
        if (item.classList[0] === 'deleteNoteButton') {
            const note = item.parentElement;
            let noteTitle = note.querySelector('.noteTitle').innerText;
            let notes = selectedCategory.notes;
            notes.forEach(note => {
                if (noteTitle == note.title) {
                    notes.splice(notes.indexOf(note), 1);
                }
            });
            let index = 1;
            notes.forEach(note => {
                note.order = index;
                index++;
            });
            localStorage.setItem('categories', JSON.stringify(categories));
            updateNoteCount(selectedCategory);
            reRenderNotes(selectedCategory);
        }
    }
    function deSelectedCategory() {
        // @ts-ignore
        selectedCategory = undefined;
        let categories = catDiv.children;
        for (let i = 0; i < categories.length; i++) {
            categories[i].classList.remove('selectedCategory');
        }
    }
    function selectCategory(category) {
        selectedCategory = category;
        let catElms = catDiv.children;
        for (let i = 0; i < catElms.length; i++) {
            let catTitle = catElms[i].querySelector('.categoryName').innerText;
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
    return {
        setters: [
            function (Category_1_1) {
                Category_1 = Category_1_1;
            },
            function (Note_1_1) {
                Note_1 = Note_1_1;
            }
        ],
        execute: function () {
            notesDiv = document.getElementById('notesDiv');
            catDiv = document.getElementById('categoriesDiv');
            writeNoteButton = document.getElementById('writeNoteButton');
            writeNoteButton.addEventListener('click', createNote);
            updateNoteButton = document.getElementById('updateNoteButton');
            updateNoteButton.addEventListener('click', updateNote);
            newCategoryButton = document.getElementById('newCategoryButton');
            newCategoryButton.addEventListener('click', createCategory);
            openNewNoteButton = document.getElementById('openNewNoteButton');
            openNewNoteButton.addEventListener('click', openNewNotePopup);
            closeNewNoteButton = document.getElementById('closeNewNoteButton');
            closeNewNoteButton.addEventListener('click', closeNewNotePopup);
            openUpdateNoteButton = document.getElementById('openUpdateNoteButton');
            openUpdateNoteButton.addEventListener('click', openUpdateNotePopup);
            closeUpdateNoteButton = document.getElementById('closeUpdateNoteButton');
            closeUpdateNoteButton.addEventListener('click', closeUpdateNotePopup);
            newNotePopup = document.getElementById('newNoteDiv');
            updateNotePopup = document.getElementById('updateNoteDiv');
            overlay = document.getElementById('overlay');
            categories = getCategories();
            renderCategories(categories);
            selectCategory(categories[0]);
            // @ts-ignore
            renderNotes(selectedCategory);
        }
    };
});
//# sourceMappingURL=bundle.js.map