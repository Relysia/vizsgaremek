const createError = require('http-errors');
const express = require('express');
require('express-async-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const indexRouter = require('./routes/indexRouter');
const apiRouter = require('./routes/apiRouter');
const budgetRouter = require('./routes/budgetRouter');
const teamRouter = require('./routes/teamRouter');
const calendarRouter = require('./routes/calendarRouter');
const summaryRouter = require('./routes/summaryRouter');
const errorHandler = require('./middleware/errorHandler');
const userExistsHandler = require('./middleware/userExistsHandler');
const userAuthHandler = require('./middleware/userAuthHandler');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Set cors
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//Can post from frontend
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', apiRouter);
app.use(userExistsHandler);
app.use(userAuthHandler);
app.use('/api/team', teamRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/summary', summaryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

module.exports = app;
