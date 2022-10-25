let categories = JSON.parse(localStorage.getItem('categories'));
let oldCategory = localStorage.getItem('selectedCategory');
let notes = [];
for (let i = 0; i < categories.length; i++) {
  if (categories[i].name == oldCategory) {
    notes = categories[i].notes;
    break;
  };
}
console.log("selected category: " + oldCategory)
console.log("notes length: " + notes.length)
console.log("categories length: " + categories.length)
$(window).load(function () {
  var i = setInterval(function () {
    if (($('.category').length <= categories.length) && ($('.note').length <= notes.length)) {
      clearInterval(i);

      $('#loaderIcon').css('visibility', 'hidden');
      $('#loaderIcon').hide();

      $("#notesDiv").sortable(
        {
          update: function (event, ui) {
            categories = JSON.parse(localStorage.getItem('categories'));
            domNotes = $('.note');
            categoryName = domNotes[0].children[1].value;

            for (let i = 0; i < categories.length; i++) {
              if (categories[i].name == categoryName) {
                category = categories[i];
                notes = category.notes;
                key = i;
                break;
              }
            };

            let index = 1;
            for (let i = 0; i < domNotes.length; i++) {
              domName = domNotes[i].children[0].innerText;
              for (let j = 0; j < notes.length; j++)
                if (notes[j].title == domName) {
                  notes[j].order = index;
                  index++;
                }
            };
            category.notes = notes;
            categories[key] = category;

            localStorage.setItem('categories', JSON.stringify(categories));
          }
        }
      );

      $("#categoriesDiv").sortable({
        update: function (event, ui) {
          categories = JSON.parse(localStorage.getItem('categories'));
          domCategories = $('.category');

          let index = 1;
          for (let i = 0; i < domCategories.length; i++) {
            domName = domCategories[i].children[3].innerText;

            for (let j = 0; j < categories.length; j++)
              if (categories[j].name == domName) {
                categories[j].order = index;
                index++;
              }
          };
          localStorage.setItem('categories', JSON.stringify(categories));
        }


      });

      $(".category").droppable({
        drop: function (event, ui) {
          var classList = ui.draggable.attr("class");

          // Creating class array by splitting class list string
          var classArr = classList.split(/\s+/);
          if (!classArr.includes('category')) {
            categories = JSON.parse(localStorage.getItem('categories'));
            noteTitle = ui.draggable[0].children[0].innerText;
            noteContent = ui.draggable[0].children[2].innerText;
            categoryName = event.target.children[3].innerText;
            console.log(oldCategory);
            console.log(noteTitle)
            console.log(noteContent)
            for (let i = 0; i < categories.length; i++) {
              console.log('key: ' + i)
              console.log('category name: ' + categories[i].name)
              if (categories[i].name == oldCategory) {
                oldKey = i;
                notes = categories[i].notes;
              }
              if (categories[i].name == categoryName) {
                newKey = i;
              }
            };

            for (let i = 0; i < notes.length; i++) {
              if (notes[i].title == noteTitle) {
                note = notes[i];
                notes.splice(i, 1);
                categories[oldKey].notes = notes;
                note.categoryName = categoryName;
                break;
              }
            };

            key = newKey ?? oldKey;
            console.log(categories[key])
            categories[key].notes[categories[key].notes.length] = note;

            localStorage.setItem('categories', JSON.stringify(categories));
            ui.draggable[0].hidden = true;
            localStorage.setItem('selectedCategory', categoryName);
            window.location.reload();

          }
        }
      });
    }
  }, 500);
  $('#loaderIcon').css('visibility', 'visible');
  $('#loaderIcon').show();
});