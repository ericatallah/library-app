const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const hbsHelpers = require('./views/helpers');
const app = express();
const expressSanitizer = require('express-sanitizer');
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressSanitizer());

// setup express routes
const mainRoutes = require('./routes');
const booksRoutes = require('./routes/books');
const musicRoutes = require('./routes/music');
const moviesRoutes = require('./routes/movies');
const comicsRoutes = require('./routes/comics');

app.use(mainRoutes);
app.use('/books', booksRoutes);
app.use('/music', musicRoutes);
app.use('/movies', moviesRoutes);
app.use('/comics', comicsRoutes);

// serve static assets in /public directory as /static route
app.use('/static', express.static('public'));

// setup handlebars template engine
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: './views/layouts/',
    partialsDir: './views/includes/',
    helpers: {
        if_equal: hbsHelpers.isEqualHelper
    }
}));

app.set('view engine', 'hbs');

// 404 route
app.use((req, res, next) => {
    const err = new Error(`The requested URL ${req.originalUrl} was not found on this server.  That's all we know.`);
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status).render('error', { err });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
