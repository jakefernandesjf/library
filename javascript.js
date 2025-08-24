/* javascript.js */


// Constants
const readSvg = new Svg(
    "book-open-page-variant-outline",
    "M19 1L14 6V17L19 12.5V1M21 5V18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5M10 18.41C8.75 18.09 7.5 18 6.5 18C5.44 18 4.18 18.19 3 18.5V7.13C3.91 6.73 5.14 6.5 6.5 6.5C7.86 6.5 9.09 6.73 10 7.13V18.41Z"
);
const deleteSvg = new Svg(
    "trash-can-outline",
    "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
)
var myLibrary = [];
const mainElement = document.querySelector("main.container");
const dialogElement = document.querySelector("dialog");
const addBookButtonElement = document.querySelector("#btn-add-book");
const cancelDialogButtonElement = document.querySelector(".dialog-cancel");
const submitDialogButtonElement = document.querySelector(".dialog-submit");
const inputTitleElement = document.querySelector("#input_title");
const inputAuthorElement = document.querySelector("#input_author");
const inputPagesElement = document.querySelector("#input_pages");
const inputReadElement = document.querySelector("#input_read");


// Library
function Book(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
}

function removeBookFromLibrary(id) {
    myLibrary = myLibrary.filter((book) => book.id != id);
}

function toggleRead(id) {
    let books = myLibrary.filter((book) => book.id == id);
    for (book of books) {
        book.read = !book.read;
    }
}


// SVG
function Svg(title, path) {
    this.title = title;
    this.path = path;
}
Svg.prototype.viewBox = "0 0 24 24";
Svg.prototype.height = "1.25em";

function createSvgElement(svg) {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgTitle = document.createElement("title");
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

    svgElement.setAttribute("viewBox", svg.viewBox);
    svgElement.setAttribute("height", svg.height);
    svgTitle.setAttribute("title", svg.title)
    svgPath.setAttribute("d", svg.path);

    svgElement.appendChild(svgTitle);
    svgElement.appendChild(svgPath);

    return svgElement;
}


// UI Creation
function createBookCard(book) {
    const bookCard = document.createElement("article");
    const header = document.createElement("h3");
    const list = document.createElement("ul");
    const authorListItem = document.createElement("li");
    const pagesListItem = document.createElement("li");
    const readListItem = document.createElement("li");
    const footer = document.createElement("div");
    const readButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    bookCard.classList.add("card");
    footer.classList.add("card-footer");
    readButton.classList.add("button-svg");
    deleteButton.classList.add("button-svg");

    header.textContent = book.title;
    authorListItem.textContent = book.author;
    pagesListItem.textContent = `${book.pages} pages`;

    setReadProperties(book, bookCard, readListItem);
    bookCard.setAttribute("data-id", book.id);

    readButton.appendChild(createSvgElement(readSvg));
    deleteButton.appendChild(createSvgElement(deleteSvg));

    readButton.addEventListener("click", () => {
        toggleRead(bookCard.getAttribute("data-id"));
        setReadProperties(book, bookCard, readListItem);
    });
    deleteButton.addEventListener("click", () => {
        deleteBook(bookCard.getAttribute("data-id"));
    });

    list.appendChild(authorListItem);
    list.appendChild(pagesListItem);
    list.appendChild(readListItem);

    footer.appendChild(readButton);
    footer.appendChild(deleteButton);

    bookCard.appendChild(header);
    bookCard.appendChild(list);
    bookCard.appendChild(footer);

    return bookCard;
}

function createLibrary() {
    deleteBookElements();
    for (const book of myLibrary) {
        bookCard = createBookCard(book);
        mainElement.appendChild(bookCard);
    }
}

function deleteBookElements() {
    while (mainElement.firstChild) {
        mainElement.removeChild(mainElement.firstChild);
    }
}

function deleteBook(id) {
    removeBookFromLibrary(id);
    createLibrary();
}

function setReadProperties(book, bookCard, readListItem) {
    if (book.read) {
        bookCard.classList.remove("not-read");
        bookCard.classList.add("read");
        readListItem.textContent = "Read";
    } else {
        bookCard.classList.remove("read");
        bookCard.classList.add("not-read");
        readListItem.textContent = "Not Read";
    }
}

/*
Main
*/
addBookToLibrary("The Hitchhiker's Guide to the Galaxy", "Douglas Adams", 232, true);
addBookToLibrary("Pride and Prejudice", "Jane Austen", 432, false);
addBookToLibrary("Harry Potter and the Half-Blood Prince", "J. K. Rowling", 302, true);
addBookToLibrary("2001: A Space Odyssey", "Arthur C. Clarke", 375, true);
createLibrary();

// Dialog
addBookButtonElement.addEventListener("click", () => {
    dialogElement.showModal();
});

dialogElement.addEventListener("submit", (event) => {
    event.preventDefault();
    addBookToLibrary(
        inputTitleElement.value,
        inputAuthorElement.value,
        inputPagesElement.value,
        inputReadElement.value
    );
    createLibrary();
    dialogElement.close();
});

cancelDialogButtonElement.addEventListener("click", () => {
    dialogElement.close();
});