// book class

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// ui class
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <th>${book.title}</th>
            <th>${book.author}</th>
            <th>#${book.isbn}</th>
            <th><a href="#" class="btn btn-sm text-danger
            delete">&#10008;</a></th>
        `;

        list.appendChild(row);
    }
    
    static deleteBook(el){
        if (el.target.classList.contains('delete')) {
            el.target.parentElement.parentElement.remove();
            UI.showAlert('Book Removed', 'warning');
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert border-${className} text-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form');  
        container.insertBefore(div, form);
        // vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2500);
        
    }
    
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// store class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books))
    }
}

// event display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// event add book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // prevent actual submit
    e.preventDefault();
    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    }
    else {
        // instantiate book
        const book = new Book(title, author, isbn);
        // Add book
        UI.addBookToList(book);

        // Add book to local storage
        Store.addBook(book);

        // show success message'
        UI.showAlert('Book Added', 'success');

        // clear fields
        UI.clearFields();
    }
})

// event remove book
document.querySelector('#book-list').addEventListener('click', (el) => {
    // remove book from UI
    UI.deleteBook(el);
    // remove book from local storage
    Store.removeBook(el.target.parentElement.previousElementSibling.textContent.slice(1));
})