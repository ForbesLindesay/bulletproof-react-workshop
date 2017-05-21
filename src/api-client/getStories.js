// @flow
// Generated Code!

import type {Input, Output} from '../api/getStories.js';
import request from 'then-request';

export default function(input: Input): Promise<Output> {
  return request('post', '/api', {json: {id: 'getStories', input}})
    .getBody('utf8')
    .then(JSON.parse);
}
