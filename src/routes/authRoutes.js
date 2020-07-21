const express = require('express');
const {
  MongoClient
} = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const {
        username,
        password
      } = req.body;
      const url = "mongodb://localhost:27017";
      const dbName = "libraryApp";
      /*async function to add user to database:
       *connect to database using MongoClient
       *select database using it's dbName
       *create collection 'users'
       *insert one docuement in users collection 
       *login with the result of insert statement and redirect to /auth/profile
       **/
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected to server!');

          const db = client.db(dbName);
          const col = db.collection('users');
          const user = {
            username,
            password
          };
          const results = await col.insertOne(user);
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          })
        } catch (error) {
          debug(error.stack);
        }

      }())

    })

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        appName: "Book Library",
        nav,
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));

  authRouter.route('/profile')
    //Authorization check 
    .all((req, res, next) => {
      req.user ? next() : res.redirect('/')
    })
    //
    .get((req, res) => {
      res.json(req.user);
    })
  return authRouter;
}

module.exports = router;