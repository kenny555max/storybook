const express = require('express');
const passport = require('passport');
const routes = express.Router();

routes.get('/google', passport.authenticate('google', { scope: ['profile'] }));

routes.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

module.exports = routes;