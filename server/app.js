const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const redis = require('redis');
const csrf = require('csurf');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/MVCService';

// mongoose setup
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to MongoDB');
    throw err;
  }
});

let redisURL = {
  hostname: 'redis-16619.c280.us-central1-2.gce.cloud.redislabs.com',
  port: 16619,
};

let redisPASS = 'lzJmarPU0jazuz07n4q4IlRiMawd4X6o';

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}

const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

// connect router
const router = require('./router');

// app setup
const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(fileUpload());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'fish sticks',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars.create({ defaultLayout: 'main' }).engine);
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

// CSRF goes between session/ cookie parser and router

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    console.log('Good CSRF Token');
    return next(err);
  }
  console.log('Bad CSRF token');
  return false;
});

// hookup router
router(app);

// start
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
