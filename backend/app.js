const createError = require('http-errors');
const express = require('express');
require('express-async-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/indexRouter');
const apiRouter = require('./routes/apiRouter');
const budgetRouter = require('./routes/budgetRouter');
const teamRouter = require('./routes/teamRouter');
const calendarRouter = require('./routes/calendarRouter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/team', teamRouter);
app.use('/api/calendar', calendarRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

module.exports = app;
