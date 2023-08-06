let notesTitle;
let notesText;
let saveNotesBtn;
let newNotesBtn;
let notesList;

if (window.location.pathname === '/notes') {
  notesTitle = document.querySelector('.notes-title');
  notesText = document.querySelector('.notes-textarea');
  saveNotesBtn = document.querySelector('.save-notes');
  newNotesBtn = document.querySelector('.new-notes');
  notesList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNotes = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNotes = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNotes = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNotes = () => {
  hide(saveNotesBtn);

  if (activeNotes.id) {
    notesTitle.setAttribute('readonly', true);
    notesText.setAttribute('readonly', true);
    notesTitle.value = activeNotes.title;
    notesText.value = activeNotes.text;
  } else {
    notesTitle.removeAttribute('readonly');
    notesText.removeAttribute('readonly');
    notesTitle.value = '';
    notesText.value = '';
  }
};

const handleNoteSave = () => {
  const newNotes = {
    title: notesTitle.value,
    text: notesText.value,
  };
  saveNotes(newNotes).then(() => {
    getAndRenderNotes();
    renderActiveNotes();
  });
};

// Delete the clicked note
const handleNotesDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const notes = e.target;
  const notesId = JSON.parse(notes.parentElement.getAttribute('data-notes')).id;
    console.log(`notes deleted. notes id: ${notesId}`);
    
  if (activeNotes.id === notesId) {
    activeNotes = {};
  }

  deleteNotes(notesId).then(() => {
    getAndRenderNotes();
    renderActiveNotes();
  });
};

// Sets the activeNote and displays it
const handleNotesView = (e) => {
  e.preventDefault();
  activeNotes = JSON.parse(e.target.parentElement.getAttribute('data-notes'));
  renderActiveNotes();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNotesView = (e) => {
  activeNotes = {};
  renderActiveNotes();
};

const handleRenderSaveBtn = () => {
  if (!notesTitle.value.trim() || !notesText.value.trim()) {
    hide(saveNotesBtn);
  } else {
    show(saveNotesBtn);
  }
};

// Render the list of note titles
const renderNotesList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    notesList.forEach((el) => (el.innerHTML = ''));
  }

  let notesListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNotesView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-notes'
      );
      delBtnEl.addEventListener('click', handleNotesDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    notesListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    notesListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    notesListItems.forEach((note) => notesList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNotesList);

if (window.location.pathname === '/notes') {
  saveNotesBtn.addEventListener('click', handleNoteSave);
  newNotesBtn.addEventListener('click', handleNewNotesView);
  notesTitle.addEventListener('keyup', handleRenderSaveBtn);
  notesText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();