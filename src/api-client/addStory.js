// @flow
// Generated Code!

import type {Input, Output} from '../api/addStory.js';
import request from 'then-request';

export default function(input: Input): Promise<Output> {
  return request('post', '/api', {json: {id: 'addStory', input}})
    .getBody('utf8')
    .then(JSON.parse);
}
