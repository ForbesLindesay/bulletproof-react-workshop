// @flow

import {resolve} from 'path';
import express from 'express';
import browserify from 'browserify-middleware';
import babelify from 'babelify';
import {json} from 'body-parser';
import api from './api';

const app = express();

app.get(
  '/',
  (req: express$Request, res: express$Response, next: express$NextFunction) => {
    res.sendFile(resolve(__dirname + '/../index.html'));
  },
);
app.get(
  '/client.js',
  browserify(__dirname + '/client.js', {transform: babelify}),
);

app.post(
  '/api',
  json(),
  (req: express$Request, res: express$Response, next: express$NextFunction) => {
    api[req.body.id](req.body.input).then(r => res.json(r), next);
  },
);

module.exports = app;
