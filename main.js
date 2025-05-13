// Do your work here...
document.addEventListener('DOMContentLoaded', () => {
  const books = [];
  const RENDER_EVENT = 'render-book';
  const STORAGE_KEY = 'BOOKSHELF_APP';

  const generateId = () => +new Date();
  const findBook = (bookId) => books.find(book => book.id === bookId);
  const findBookIndex = (bookId) => books.findIndex(book => book.id === bookId);

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  };

  const loadData = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) books.push(...JSON.parse(data));
    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  const makeBook = (bookObject) => {
    const title = document.createElement('h3');
    title.innerText = bookObject.title;
    title.setAttribute('data-testid', 'bookItemTitle');

    const author = document.createElement('p');
    author.innerText = `Penulis: ${bookObject.author}`;
    author.setAttribute('data-testid', 'bookItemAuthor');

    const year = document.createElement('p');
    year.innerText = `Tahun: ${bookObject.year}`;
    year.setAttribute('data-testid', 'bookItemYear');

    const toggleButton = document.createElement('button');
    toggleButton.innerText = bookObject.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleButton.addEventListener('click', () => {
      bookObject.isComplete = !bookObject.isComplete;
      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.addEventListener('click', () => {
      const index = findBookIndex(bookObject.id);
      if (index !== -1) {
        books.splice(index, 1);
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
      }
    });

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit Buku';
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.addEventListener('click', () => {
      document.getElementById('bookFormTitle').value = bookObject.title;
      document.getElementById('bookFormAuthor').value = bookObject.author;
      document.getElementById('bookFormYear').value = bookObject.year;
      document.getElementById('bookFormIsComplete').checked = bookObject.isComplete;

      books.splice(findBookIndex(bookObject.id), 1);
      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });

    const container = document.createElement('div');
    container.setAttribute('data-bookid', bookObject.id);
    container.setAttribute('data-testid', 'bookItem');
    container.append(title, author, year, toggleButton, deleteButton, editButton);
    return container;
  };

  const renderBooks = (keyword = '') => {
    const incompleteList = document.getElementById('incompleteBookList');
    const completeList = document.getElementById('completeBookList');
    incompleteList.innerHTML = '';
    completeList.innerHTML = '';

    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(keyword.toLowerCase())
    );

    for (const book of filteredBooks) {
      const bookElement = makeBook(book);
      if (book.isComplete) {
        completeList.append(bookElement);
      } else {
        incompleteList.append(bookElement);
      }
    }
  };

  document.getElementById('bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const bookObject = {
      id: generateId(),
      title,
      author,
      year,
      isComplete
    };

    books.push(bookObject);
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
    e.target.reset();
  });

  document.getElementById('searchBook').addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = document.getElementById('searchBookTitle').value;
    renderBooks(keyword);
  });

  document.addEventListener(RENDER_EVENT, () => {
    renderBooks();
  });

  loadData();
});
