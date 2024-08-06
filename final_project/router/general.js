const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "username &/ password are not provided."});
});

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
    
//     res.send(JSON.stringify(books,null,4));

// });

//Task 10
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 100); 
    });

    // Handle the resolved Promise
    getBooks
        .then((booksData) => {
            // Send the books data as JSON response
            res.send(JSON.stringify(booksData, null, 4));
            console.log("Promise resolved and books data sent");
        })
        .catch((error) => {
            // Handle any errors
            res.status(500).send("Error retrieving books");
            console.error("Error retrieving books:", error);
        });
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn],null,4));

 });

// task 11
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        try{
            let ISBN  = req.params.isbn;
            const book = books[ISBN];
            resolve(book);
        }catch(error){
            reject("Error occured")
        } 
    })
    myPromise.then((book)=>{
        if(book){
            return res.send(JSON.stringify(book))
        }else{
            return res.status(404).json({message: "Book doesn't exists with given isbn"})
        } 
    })   
 });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     let booksbyauthor = [];
//     let isbns = Object.keys(books);
//     isbns.forEach((isbn) => {
//       if(books[isbn]["author"] === req.params.author) {
//         booksbyauthor.push({"isbn":isbn,
//                             "title":books[isbn]["title"],
//                             "reviews":books[isbn]["reviews"]});
//       }
//     });
//     res.send(JSON.stringify({booksbyauthor}, null, 4));
// });

// task 12
public_users.get('/author/:author', function (req, res) {
    // Create a new Promise to handle fetching books by author
    let getBooksByAuthor = new Promise((resolve, reject) => {
        try {
            let author = req.params.author;
            let booksByAuthor = [];
            let isbns = Object.keys(books);

            // Simulate an asynchronous operation
            setTimeout(() => {
                isbns.forEach((isbn) => {
                    if (books[isbn]["author"] === author) {
                        booksByAuthor.push({
                            "isbn": isbn,
                            "title": books[isbn]["title"],
                            "reviews": books[isbn]["reviews"]
                        });
                    }
                });

                // Resolve with the filtered books
                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject("No books found for this author");
                }
            }, 100); // Simulate 100ms delay for the async operation
        } catch (error) {
            reject("Error occurred while fetching books");
        }
    });

    // Handle the resolved Promise
    getBooksByAuthor
        .then((booksByAuthor) => {
            res.send(JSON.stringify({ booksByAuthor }, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     let booksbytitle = [];
//     let isbns = Object.keys(books);
//     isbns.forEach((isbn) => {
//       if(books[isbn]["title"] === req.params.title) {
//         booksbytitle.push({"isbn":isbn,
//                             "title":books[isbn]["author"],
//                             "reviews":books[isbn]["reviews"]});
//       }
//     });
//     res.send(JSON.stringify({booksbytitle}, null, 4));
// });

//task13 
public_users.get('/title/:title', function (req, res) {
    // Create a new Promise to handle fetching books by title
    let getBooksByTitle = new Promise((resolve, reject) => {
        try {
            let title = req.params.title;
            let booksByTitle = [];
            let isbns = Object.keys(books);

            // Simulate an asynchronous operation
            setTimeout(() => {
                isbns.forEach((isbn) => {
                    if (books[isbn]["title"] === title) {
                        booksByTitle.push({
                            "isbn": isbn,
                            "title": books[isbn]["title"],
                            "reviews": books[isbn]["reviews"]
                        });
                    }
                });

                // Resolve with the filtered books
                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject("No books found with this title");
                }
            }, 100); // Simulate 100ms delay for the async operation
        } catch (error) {
            reject("Error occurred while fetching books");
        }
    });

    // Handle the resolved Promise
    getBooksByTitle
        .then((booksByTitle) => {
            res.send(JSON.stringify({ booksByTitle }, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
  });

module.exports.general = public_users;
