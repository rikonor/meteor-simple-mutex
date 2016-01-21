Package.describe({
  name: 'rikonor:simple-mutex',
  version: '0.0.2',
  summary: 'Lock Objects',
  git: 'https://www.github.com/rikonor/meteor-simple-mutex',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript',
    'dburles:collection-helpers@1.0.4',
    'dburles:mongo-collection-instances@0.3.5'
  ]);
  api.addFiles('lib/simple-mutex.js');
});
