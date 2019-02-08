module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-umd');

  grunt.initConfig({
  umd: {
    all: {
      options: {
        src: './bundle.js',

        // optional, a template from templates subdir
        // can be specified by name (e.g. 'umd'); if missing, the templates/umd.hbs
        // file will be used from [libumd](https://github.com/bebraw/libumd)
        // template: 'path/to/template.hbs',

        // objectToExport: 'library', // optional, internal object that will be exported
        // amdModuleId: 'id', // optional, if missing the AMD module will be anonymous
        // globalAlias: 'alias', // optional, changes the name of the global variable

        deps: { // optional, `default` is used as a fallback for rest!
          'default': ['foo', 'bar'],
          // amd: ['foobar', 'barbar'],
          // cjs: ['foo', 'barbar'],
          // global: ['foobar', {depName: 'param'}]
        }
      }
    }
  }
});
};
