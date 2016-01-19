Package.describe({
  name: 'rikonor:simple-mutex',
  version: '0.0.1',
  summary: 'Lock Objects',
  git: 'https://www.github.com/rikonor/meteor-simple-mutex',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('lib/simple-mutex.js');
});
