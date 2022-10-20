import {Category} from "./Category";
import {Note} from "./Note";

let notesDiv = document.getElementById('notesDiv') as Element;
let catDiv = document.getElementById('categoriesDiv') as Element;

let writeNoteButton = document.getElementById('writeNoteButton') as HTMLButtonElement;
writeNoteButton.addEventListener('click', createNote);

let updateNoteButton = document.getElementById('updateNoteButton') as HTMLButtonElement;
updateNoteButton.addEventListener('click', updateNote);

let newCategoryButton = document.getElementById('newCategoryButton') as HTMLButtonElement;
newCategoryButton.addEventListener('click', createCategory);

let openNewNoteButton = document.getElementById('openNewNoteButton') as HTMLButtonElement;
openNewNoteButton.addEventListener('click', openNewNotePopup);

let closeNewNoteButton = document.getElementById('closeNewNoteButton') as HTMLButtonElement;
closeNewNoteButton.addEventListener('click',closeNewNotePopup);

let openUpdateNoteButton = document.getElementById('openUpdateNoteButton') as HTMLButtonElement;
openUpdateNoteButton.addEventListener('click', openUpdateNotePopup);

let closeUpdateNoteButton = document.getElementById('closeUpdateNoteButton') as HTMLButtonElement;
closeUpdateNoteButton.addEventListener('click',closeUpdateNotePopup);

let newNotePopup = document.getElementById('newNoteDiv') as HTMLElement;
let updateNotePopup = document.getElementById('updateNoteDiv') as HTMLElement;
let overlay = document.getElementById('overlay') as HTMLElement;

function openNewNotePopup() {
    newNotePopup.classList.add('active');
    overlay.classList.add('active');
}

function closeNewNotePopup() {
    newNotePopup.classList.remove('active');
    overlay.classList.remove('active');
}

function openUpdateNotePopup(event: Event) {
    updateNotePopup.classList.add('active');
    const item = event.target as Element;

    let note = item.parentElement as HTMLElement;

    let oldNoteName = (note.querySelector('.noteTitle') as HTMLElement).innerText;
    let oldNoteContent = (note.querySelector('.noteContent') as HTMLElement).innerText;
    
    (updateNotePopup.querySelector('#updateNoteNameHidden') as HTMLInputElement).value = oldNoteName;
    (updateNotePopup.querySelector('#updateNoteTitle') as HTMLInputElement).value = oldNoteName;
    (updateNotePopup.querySelector('#updateNoteContentArea') as HTMLInputElement).value = oldNoteContent;
    overlay.classList.add('active');
}

function closeUpdateNotePopup() {
    updateNotePopup.classList.remove('active');
    overlay.classList.remove('active');
}

let categories: Category[] = getCategories();
let selectedCategory: Category;

renderCategories(categories);
selectCategory(categories[0]);
// @ts-ignore
renderNotes(selectedCategory);


function createNote() {

    if(selectedCategory !== undefined) {

        let noteTitleInput = document.getElementById('newNoteTitle') as HTMLInputElement
        let noteContentInput = document.getElementById('noteContentArea') as HTMLInputElement

        if (noteTitleInput.value.trim().length  && noteContentInput.value.trim().length) {

            let newNoteTitle: string = (document.getElementById('newNoteTitle') as HTMLInputElement).value;
            (document.getElementById('newNoteTitle') as HTMLInputElement).value = '';
            let newNoteContent: string = (document.getElementById('noteContentArea') as HTMLInputElement).value;
            (document.getElementById('noteContentArea') as HTMLInputElement).value = '';
            let newNote = new Note(newNoteTitle, newNoteContent, selectedCategory.name);

            saveNote(newNote);
        }
    }
}

function updateNote(event: Event) {
    const item = event.target as Element;
    let updateNoteDiv = item.parentElement?.parentElement as HTMLElement;
    let oldName = (updateNoteDiv.querySelector('#updateNoteNameHidden') as HTMLInputElement).value;

    if(selectedCategory !== undefined) {

        let noteTitleInput = document.getElementById('updateNoteTitle') as HTMLInputElement
        let noteContentInput = document.getElementById('updateNoteContentArea') as HTMLInputElement

        if (noteTitleInput.value.trim().length  && noteContentInput.value.trim().length) {

            let updateNoteTitle: string = noteTitleInput.value;
            let updateNoteContent: string = noteContentInput.value;
            
            selectedCategory.notes.forEach(note => {
                    if(note.title === oldName) {
                        note.title = updateNoteTitle;
                        note.content = updateNoteContent;
                    }
            });
        }
        localStorage.setItem('categories',JSON.stringify(categories));
        
        reRenderNotes(selectedCategory);
        reRenderCategories();
    }
}

function createCategory() {
    let catNameInput = document.getElementById('newCategoryName')as HTMLInputElement;
    let categoryName: string = catNameInput.value;

    if(categoryName.trim().length) {

        catNameInput.value = '';

        let notes: Note[] = [];

        let newCategory: Category = new Category(categoryName, notes);

        selectedCategory = newCategory;

        saveCategory(newCategory);

        selectCategory(newCategory);
    }

}

function updateNoteCount(category: Category) {

    let catElms = catDiv.children;

    for (let i = 0; i < catElms.length; i++) {

        let categoryName  = (catElms[i].querySelector('.categoryName') as HTMLElement).innerText;

        if(category.name === categoryName) {

            (catElms[i].querySelector('.noteCount') as HTMLElement).innerText = String(category.notes.length);

        }
    }

}

function saveCategory(category: Category) {
    categories.push(category);
    localStorage.setItem('categories', JSON.stringify(categories));
    reRenderCategories();
    reRenderNotes(selectedCategory);
}

function saveNote(newNote: Note) {

    selectedCategory.notes.push(newNote);

    localStorage.setItem('categories',JSON.stringify(categories));

    updateNoteCount(selectedCategory);

    reRenderNotes(selectedCategory);

}

function getCategories(): Category[] {

    if(localStorage.length !== 0) {
        let cats: any = localStorage.getItem('categories');
        return JSON.parse(cats);
    }else {
        return []
    }

}

function renderCategories(categories: Category[]){


    categories.forEach(cat => {

        let categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');

        let categoryName = document.createElement('h3');
        categoryName.classList.add('categoryName');
        categoryName.innerText = cat.name;

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

        catDiv.appendChild(categoryDiv);
        updateCategoryDiv.hidden = true;

        categoryDiv.addEventListener('click',clickCategory);
    });
}

function renderNotes(category: Category) {

    if(category !== undefined) {
        let notes = category.notes;

        notes.forEach(note => {

            let noteDiv = document.createElement('div');
            noteDiv.classList.add('note');

            let noteTitle = document.createElement('h3');
            noteTitle.classList.add('noteTitle');
            noteTitle.innerText = note.title;

            let noteContent = document.createElement('p');
            noteContent.classList.add('noteContent');
            noteContent.innerText = note.content;

            let deleteNoteButton = document.createElement('button');
            deleteNoteButton.classList.add('deleteNoteButton');
            deleteNoteButton.innerHTML = '<i class="fa fa-light fa-trash"></i>'
            deleteNoteButton.addEventListener('click', deleteNote);

            let updateNoteButton = document.createElement('button');
            updateNoteButton.classList.add('updateNoteButton');
            updateNoteButton.innerHTML = '<i class="fa fa-edit"></i>'
            updateNoteButton.addEventListener('click', openUpdateNotePopup);

            noteDiv.appendChild(noteTitle);
            noteDiv.appendChild(noteContent);
            noteDiv.appendChild(deleteNoteButton);
            noteDiv.appendChild(updateNoteButton);
            notesDiv.appendChild(noteDiv);


        });
    }

}

function clickCategory(e: Event){

    let clickedCategory = e.target as Element;

    let categoryName = (clickedCategory.querySelector('.categoryName') as HTMLElement).innerText;

    categories.forEach(cat => {
        if(categoryName == cat.name){
            selectedCategory = cat;
        }

    });
    toggleCategories(clickedCategory);
    reRenderNotes(selectedCategory);
}

function toggleCategories(categoryElm: Element){

    let categories = catDiv.children;

    for (let i = 0; i < categories.length; i++) {
        if(categoryElm === categories[i]) {

            categories[i].classList.add('selectedCategory');
        }else {
            categories[i].classList.remove('selectedCategory');
        }
    }


}

function deleteCategory(event: Event) {

    const item = event.target as Element;

    if(item.classList[0] === 'deleteCatButton') {

        let category = item.parentElement as HTMLElement;
        let categoryName: string = (category.querySelector('.categoryName') as HTMLElement).innerText;
        category.remove();



        categories.forEach(cat => {
            if(cat.name === categoryName){
                categories.splice(categories.indexOf(cat),1);
            }
        });

        localStorage.setItem('categories',JSON.stringify(categories));

        if(selectedCategory.name === categoryName) {


            deSelectedCategory();

        }

        reRenderNotes(selectedCategory);

    }


}

function updateCategory(event: Event) {

    const item = event.target as Element;

    if(item.classList[0] === 'updateCatButton') {

        let category = item.parentElement as HTMLElement;
        (category.querySelector('.categoryName') as HTMLElement).hidden = true;
        (category.querySelector('.noteCount') as HTMLElement).hidden = true;
        (category.querySelector('.updateCategoryDiv') as HTMLElement).hidden = false;
    }
}

function updateNameCategory(event: Event) {

    const item = event.target as Element;
    if(item.classList[0] === 'categoryUpdateButton') {

        let category = item.parentElement?.parentElement as HTMLElement;

        let oldCategory = (category.querySelector('.categoryName') as HTMLElement);
        let oldCategoryName: string = oldCategory.innerText;
        let categoryUpdateDiv = (category.querySelector('.updateCategoryDiv') as HTMLElement);
        let categoryName = (categoryUpdateDiv.querySelector('.categoryTextInput') as HTMLInputElement).value;
        oldCategory.innerText = categoryName;
        
        categories.forEach(cat => {
            if(cat.name === oldCategoryName){
                cat.name = categoryName;
            }
        });

        localStorage.setItem('categories',JSON.stringify(categories));

        reRenderNotes(selectedCategory);
        reRenderCategories();
    }
}

function deleteNote(event: Event) {
    const item = event.target as Element;

    if(item.classList[0] === 'deleteNoteButton') {
        const note = item.parentElement as HTMLElement;
        let noteTitle: string = (note.querySelector('.noteTitle') as HTMLElement).innerText;

        let notes = selectedCategory.notes;

        notes.forEach(note => {
            if(noteTitle == note.title) {
                notes.splice(notes.indexOf(note),1);
            }
        });
        localStorage.setItem('categories', JSON.stringify(categories));
        updateNoteCount(selectedCategory);
        reRenderNotes(selectedCategory);

    }
}

function deSelectedCategory(){
    // @ts-ignore
    selectedCategory = undefined;

    let categories = catDiv.children;

    for (let i = 0; i < categories.length; i++) {
            categories[i].classList.remove('selectedCategory');

    }

}

function selectCategory(category: Category) {

    selectedCategory = category;

    let catElms = catDiv.children;

    for (let i = 0; i < catElms.length; i++) {
        let catTitle = (catElms[i].querySelector('.categoryName') as HTMLElement).innerText;

        if(catTitle === category.name) {
            toggleCategories(catElms[i]);
        }
    }
}

function reRenderNotes(cat: Category){
    notesDiv.innerHTML = '';
    renderNotes(cat);
}

function reRenderCategories(){
    catDiv.innerHTML = '';
    renderCategories(categories);
}


