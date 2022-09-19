require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

//Create connection
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: process.env.MYSQL_PASSWORD,
  database: "test",
});

app.use(express.json());
app.use(cors());

//Connect
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected...");
  }
});

//Test that backend is working
app.get("/", (req, res) => {
  res.json("hello, this is the backend");
});

//Get books from database
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

//Add book to database
app.post("/books", (req, res) => {
  const q =
    "INSERT INTO books (`title`, `description`, `cover`, `price`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.description,
    req.body.cover,
    req.body.price,
  ];

  db.query(q, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json("Book has been created successfully");
    }
  });
});

//Delete book from database
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json("Book has been deleted successfully");
    }
  });
});

//Update book in database
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title` = ?, `description` = ?, `cover` = ? `price` = ? WHERE id = ?";
  const values = [
    req.body.title,
    req.body.description,
    req.body.cover,
    req.body.price,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json("Book has been updated successfully");
    }
  });
});

app.listen("3000", () => {
  console.log("Server started on port 3000");
});
