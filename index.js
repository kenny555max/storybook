const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const Story = require('./model/story.js')
const { formatDate, select, truncate, stripTags, editIcon } = require('./helpers/index.js')

require('./routes/passport')(passport)

const routes = require('./routes')
const stories = require('./routes/stories')
const { ensureGuest, ensureAuth } = require('./auth')
const MongoStore = require('connect-mongo')

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '30mb' }));
var methodOverride = require('method-override')

// NOTE: when using req.body, you must fully parse the request body
//       before you call methodOverride() in your middleware stack,
//       otherwise req.body will not be populated.
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

app.use(morgan('tiny'));

app.engine('.hbs', engine({ extname: '.hbs', defaultLayout: 'main', helpers: { formatDate, select, truncate, stripTags, editIcon } }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, '/public')));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECTION })
}))
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next();
});

// main endpoint
app.get('/', ensureGuest, (req, res) => {
    res.render('login', { layout: 'login' });
});

app.use('/auth', routes);

app.use('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/dashboard', ensureAuth, async (req, res) => {
    const stories = await Story.find({ userId: req.user._id, status: 'Public' }).lean();
    console.log(req.user);
    res.render('dashboard', {
        name: req.user.firstName,
        stories
    });
});

app.use('/stories', stories);

const PORT = process.env.aport || 5000;

mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
    .catch((error) => console.log(error.message));