const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    const filteredUsers = users.filter((user) => user.username === username);
    if (filteredUsers.length > 0) {
        return false;
    } else {
        return true;
    }
};

const authenticatedUser = (username, password) => {
    const filteredUsers = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    if (filteredUsers.length > 0) {
        return true;
    }
    return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: username,
            },
            "access",
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res
            .status(208)
            .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    // check if the review is exists
    if (review) {
        if (books[isbn]) {
            // get the usernaame from the session object
            const username = req.session.authorization.username;
            if (books[isbn].reviews[username]) {
                books[isbn].reviews[username] = review;
                res.send(`Review updated successfully`);
            } else {
                books[isbn].reviews[username] = review;
                res.send(`Review added successfully`);
            }
        } else {
            res.status(403).json({ message: "Book not found" });
        }
    } else {
        tes.status(403).json({ message: "Review not provided" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (isbn) {
        if (books[isbn]) {
            // find the current user and delete it
            const username = req.session.authorization.username; // get the logged username
            for (let user in books[isbn].reviews) {
                if (user === username) {
                    delete books[isbn].reviews[user];
                    return res.send(`Review deleted successfully`);
                }
            }
            res.status(403).json({ message: "Review not found" });
        } else {
            res.status(403).json({ message: "Book not found" });
        }
    } else {
        res.status(403).json({ message: "ISBN not provided" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
