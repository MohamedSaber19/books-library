const {
  MongoClient,
  ObjectID
} = require("mongodb");
const debug = require('debug')('app:bookRoutes');

function bookController(nav) {
  function getIndex(req, res) {
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
  }

  function getById(req, res) {
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
  }

  //Authorization check
  function middleware(req, res, next) {
    req.user ? next() : res.redirect('/');
  }

  return {
    getIndex,
    getById,
    middleware
  }
}

module.exports = bookController;