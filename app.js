'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
var session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./utils/pass');
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

/*const username = 'foo';
const password = 'bar';*/

app.use(cookieParser());

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/setCookie/:clr', (req, res) => {
  res.cookie('color', req.params.clr, { httpOnly: true }).send('setkuuki');
});

app.get('/readCookie/', (req, res) => {
  console.log('Cookies: ', req.cookies);
  res.send('read cookie');
});

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('color');
  res.send('deletekuuki');
});

app.get('/form', (req, res) => {
  res.render('form');
});
app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});
app.get('/more', loggedIn, (req, res) => {
  res.send('more secure page...');
});

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/form' }),
  (req, res) => {
    console.log('login success');
    res.redirect('/secret');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
