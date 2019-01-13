var express = require("express"),
  mongoose = require("mongoose"),
  User = require("./models/User"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
app = express();

// mongodb setup
mongoose.connect(
  "mongodb://localhost/passport_setup",
  () => console.log("DB connected..........")
);

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// passport configur
app.use(
  require("express-session")({
    secret: "i am nirol",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport setup////////////////////////////////////////////
passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      return done(null, user);
    });
  })
);

// //////////////////////////////////////////////////////////////////////////////

// app configure
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/secret", isLoggedin, (req, res) => {
  res.render("secret");
});

// post router
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  })
);

app.post("/signup", (req, res) => {
  var email = req.body.email,
    username = req.body.username,
    password = req.body.password;

  const newUser = new User({
    email,
    username,
    password
  });

  newUser
    .save()
    .then(user => {
      res.redirect("/secret");
    })
    .catch(err => console.log(err));
});

// middleware=====================
function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

app.listen(4000 || process.env.PORT, () =>
  console.log("server running at 4000")
);
