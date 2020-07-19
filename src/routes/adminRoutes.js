const express = require("express");
const {
  MongoClient
} = require("mongodb");
const debug = require('debug')('app:adminRoutes');
const adminRouter = express.Router();
const books = [{
    title: 'LOTR',
    author: 'Alex Smith',
    genre: 'Fantasy',
    read: false
  },
  {
    title: 'House of Cards',
    author: 'Librand Augstin',
    genre: 'Politics',
    read: false
  },
  {
    title: 'Game of Thrones',
    author: 'George Martin',
    genre: 'Fantasy',
    read: false
  },
  {
    title: 'Hannibal',
    author: 'Mario Gerrald',
    genre: 'Thriller',
    read: false
  },
  {
    title: 'WestWorld II',
    author: 'Anthony Hopkins',
    genre: 'Sci-Fi',
    read: false
  },
];

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
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
          const response = await db.collection('books').insertMany(books);

          res.json(response);

        } catch (error) {
          debug(error.stack);
        }

        client.close();
      }())

    })

  return adminRouter;
}

module.exports = router;