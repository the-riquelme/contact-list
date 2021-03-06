const session = require('express-session'); //modulo para salvar sessao na memoria
const MongoStore = require('connect-mongo'); //armazenamento de sessao no MongoDB
const { uri } = require('../config/db.config'); //definidos no arquivo .env

function sessionOptions() {
  return session({
    secret: 'freeze',
    store: MongoStore.create({ mongoUrl: uri }), //sessao salva no mongodb
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000, //24hrs
      httpOnly: true
    }
  });
}

function loginRequired(req, res, next) {
  if (!req.session.user) {
    req.flash('erros', 'Login necessário para esta ação.');
    req.session.save(() => { res.redirect('/') });
    return;
  }

  next();
}

function addGlobalVariables(req, res, next) {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;

  next();
}

module.exports = { sessionOptions, loginRequired, addGlobalVariables };