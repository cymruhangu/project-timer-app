'use strict';
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

// Logging
app.use(morgan('common'));

// CORS
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//   if (req.method === 'OPTIONS') {
//     return res.send(204);
//   }
//   next();
// });

// passport.use(localStrategy);
// passport.use(jwtStrategy);
app.use('/api/projects/', projectRoutes);
app.use('/api/tasks/', taskRoutes);
app.use('/api/users/', userRoutes);

// app.use('/api/auth/', authRouter);

// const jwtAuth = passport.authenticate('jwt', { session: false });
//===============================
app.get('/api/testing', (req, res) => {
  res.json({ok: true});
});
//===============================

// app.get('/api/protected', jwtAuth, (req, res) => {
//   return res.json({
//     data: 'rosebud'
//   });
// });

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(databaseUrl, port = PORT) {
  console.log(`databaseUrl is ${databaseUrl}`);
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,  {useNewUrlParser: true },
      err => {
      if (err) {
        return reject(err);
      }
      mongoose.set('debug', true);
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};