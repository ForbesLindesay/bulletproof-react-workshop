require('babel-register');
require('./src/server.js').listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});
