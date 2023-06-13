const express = require('express');
const { create, edit, update, deleteStory, publicStories } = require('../controllers/story.js');
const { ensureAuth } = require('../auth/index.js');

const routes = express.Router();

routes.get('/add', (req, res) => {
    res.render('add');
});

routes.get('/edit/:id', edit);

routes.get('/public', publicStories);

routes.put('/edit/:id', update);

routes.delete('/delete/:id', deleteStory);

routes.post('/', ensureAuth, create);

module.exports = routes;