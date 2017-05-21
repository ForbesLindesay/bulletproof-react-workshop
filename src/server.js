// @flow

import {resolve} from 'path';
import express from 'express';
import browserify from 'browserify-middleware';
import babelify from 'babelify';
import {json} from 'body-parser';
import * as api from './api';

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

// CREATE
app.put(
  '/api/stories',
  json(),
  (req: express$Request, res: express$Response, next: express$NextFunction) => {
    api
      .addStory(req.body.body)
      .then(() => api.getStories())
      .then(r => res.json(r), next);
  },
);

// READ
app.get(
  '/api/stories',
  (req: express$Request, res: express$Response, next: express$NextFunction) => {
    api.getStories().then(r => res.json(r), next);
  },
);

// UPDATE
app.post(
  '/api/stories/:id/vote',
  (req: express$Request, res: express$Response, next: express$NextFunction) => {
    api
      .voteStory(req.params.id)
      .then(() => api.getStories())
      .then(r => res.json(r), next);
  },
);

module.exports = app;
