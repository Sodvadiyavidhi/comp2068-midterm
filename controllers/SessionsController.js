const User = require('../models/user');
const passport = require('passport');
const viewPath = 'sessions';

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'Login'
  });
};

exports.create = (req, res, next) => {
  // add the authentication logic here
  passport.authenticate('local', {
    successRedirect: '/reservations',
    successFlash: 'Hurray!! Logged in successfully.',
    failureRedirect: '/login',
    failureFlash: 'Invalid credentials'
  })(req, res, next);
};


exports.delete = (req, res) => {
  req.logout();
  req.flash('success', 'You were logged out successfully.');
  res.redirect('/');
};