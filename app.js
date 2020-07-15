const express = require("express");
const app = express();
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
const port = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
app.set("views", "./src/views");
app.set("view engine", "ejs");

const nav = [{
    link: "/books",
    title: "Books",
  },
  {
    link: "/authors",
    title: "Authors",
  },
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
app.use('/books', bookRouter);
app.get("/", (req, res) => {
  res.render("index", {
    appName: "Book Library",
    nav: [{
        link: '/books',
        title: 'Books'
      },
      {
        link: '/authors',
        title: 'Authors'
      }
    ],
    list: ["a", "b", "c"]
  });
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});