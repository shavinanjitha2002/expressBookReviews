const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            // register the user in the system
            users.push({ username: username, password: password });
            res.send(`User with username ${username} registered successfully`);
        } else {
            res.status(403).json({ message: "Username already exists" });
        }
    } else {
        res.status(403).json({ message: "Username or password not provided" });
    }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    const results = await JSON.stringify(books, null, 4);

    res.send(results);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const readBook = new Promise((resolve, reject) => {
        setTimeout(() => {
            const isbn = req.params.isbn;
            resolve(JSON.stringify(books[isbn], null, 4));
        }, 1000);
    });

    readBook.then((response) => {
        res.send(response);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const filterBooksByAuthor = new Promise((resolve, reject) => {
        let author = req.params.author;
        const author_names = author.split("-");
        author = author_names.join(" ");
        // filter the books based on their authors
        const filteredBooks = {};
        for (let isbn in books) {
            if (books[isbn].author === author) {
                filteredBooks[isbn] = books[isbn];
            }
        }

        resolve(JSON.stringify(filteredBooks, null, 4));
    });

    filterBooksByAuthor.them((response) => {
        res.send(response);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const filterBooksByTitle = new Promise((resolve, reject) => {
        let title = req.params.title;
        const title_items = title.split("-");
        title = title_items.join(" ");
        // filter the books based on their authors
        const filteredBooks = {};
        for (let isbn in books) {
            if (books[isbn].title === title) {
                filteredBooks[isbn] = books[isbn];
            }
        }

        resolve(JSON.stringify(filteredBooks, null, 4));
    });

    filterBooksByTitle.then((response) => {
        res.send(response);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;

    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
