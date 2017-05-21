// @flow

import {readdirSync, writeFileSync, mkdirSync} from 'fs';

try {
  mkdirSync(__dirname + '/api-client');
} catch (ex) {
  if (ex.code !== 'EEXIST') {
    throw ex;
  }
}

const modules = [];
readdirSync(__dirname + '/api').forEach(name => {
  const id = name.replace(/\.js$/, '');
  modules.push(id);
  writeFileSync(
    __dirname + '/api-client/' + name,
    `// @flow
// Generated Code!

import type {Input, Output} from '../api/${name}';
import request from 'then-request';

export default function (input: Input): Promise<Output> {
  return request('post', '/api', {json: {id: '${id}', input}})
    .getBody('utf8')
    .then(JSON.parse);
}
`,
  );
});
writeFileSync(
  __dirname + '/api.js',
  `// @flow
// Generated Code!

${modules
    .map(id => `import type {Input as ${id}Input, Output as ${id}Output} from './api/${id}.js';
import ${id} from './api/${id}.js';`)
    .join('\n')}

const modules = {
${modules
    .map(id => `  ${id}: (${id}: (input: ${id}Input) => Promise<${id}Output>),`)
    .join('\n')}
};

export default modules;
`,
);
