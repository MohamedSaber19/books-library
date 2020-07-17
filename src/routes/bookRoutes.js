const express = require("express");
const bookRouter = express.Router();
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

const router = (nav) => {
  const books = [{
      title: "A journey to the center of the earth",
      genre: "Historical Fiction",
      author: "Jason Atwood",
      read: false,
    },
    {
      title: "The battle of the middle earth II",
      genre: "Historical Fiction",
      author: "Chris jones",
      read: false,
    },
    {
      title: "Game of thrones",
      genre: "Historical Fiction",
      author: "Michael ford",
      read: false,
    },
    {
      title: "Westworld II",
      genre: "Historical Fiction",
      author: "Anthony Hoppkins",
      read: false,
    },
  ];

  bookRouter.route("/").get((req, res) => {
    const request = new sql.Request();
    request.query('select * from book')
      .then((result) => {
        debug(result);
        res.render("books", {
          appName: "Book Library",
          nav,
          books: result.recordset
        })
      })


  });

  bookRouter.route("/:id").get((req, res) => {
    const {
      id
    } = req.params;
    res.render("bookView", {
      appName: "Book Library",
      nav,
      book: books[id]
    });
  });

  return bookRouter;
}


module.exports = router;