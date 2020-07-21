const express = require("express");
const {
  MongoClient,
  ObjectID
} = require("mongodb");
const bookRouter = express.Router();
const debug = require('debug')('app:bookRoutes');

const router = (nav) => {
  //Authorization check
  bookRouter.use((req, res, next) => {
    req.user ? next() : res.redirect('/');
  })
  //
  bookRouter.route("/").get((req, res) => {
    const url = "mongodb://localhost:27017";
    const dbName = "libraryApp";

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, {
          useUnifiedTopology: true
        });
        debug('connnected to server...');

        const db = client.db(dbName);
        const col = db.collection('books');
        const books = await col.find().toArray();
        res.render("books", {
          appName: "Book Library",
          nav,
          books
        })
      } catch (error) {
        debug(error.stack);
      }

      client.close();
    }());
  });

  bookRouter.route("/:id")
    .get((req, res) => {
      const url = "mongodb://localhost:27017";
      const dbName = "libraryApp";
      (async function mongo() {
        const {
          id
        } = req.params;
        let client;
        try {
          client = await MongoClient.connect(url, {
            useUnifiedTopology: true
          });
          debug('connnected to server...');

          const db = client.db(dbName);
          const col = db.collection('books');
          const book = await col.findOne({
            _id: new ObjectID(id)
          });
          debug(book);

          res.render("bookView", {
            appName: "Book Library",
            nav,
            book
          })
        } catch (error) {
          debug(error.stack);
        }

        client.close();
      }())
    })

  return bookRouter;
}


module.exports = router;