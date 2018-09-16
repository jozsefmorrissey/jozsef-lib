
// your library here
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular'], factory);
  } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
    // CommonJS support (for us webpack/browserify/ComponentJS folks)
    module.exports = factory(require('angular'));
  } else {
    // in the case of no module loading system
    // then don't worry about creating a global
    // variable like you would in normal UMD.
    // It's not really helpful... Just call your factory
    return factory(root.angular);
  }
}(this, function (angular) {
  'use strict';
  // create your angular module and do stuff
  let prefix='';
  var moduleName = 'jozsefLib';
  var mod = angular.module(moduleName, []);

  // let book = require('./directives/book');
  let modules = {
    directive: [
      'book',
      'chain',
      'drawBridge',
      'expandableRepeat'
    ],
    constant: [
      'LazyLoad'
    ]
  }

  let types = Object.keys(modules);
  for (let tIndex = 0; tIndex < types.length; tIndex += 1) {
    let type = types[tIndex];
    for (let iIndex = 0; iIndex < modules[type].length; iIndex += 1) {
        let identifier = modules[type][iIndex];
        let obj = require(`./${type}/${identifier}`);
        mod[type](`${prefix}${identifier}`, obj[identifier]);
    }
  }

  angular.module('jozsefLib')
    .config(function(LazyLoad){
      let str = `app.directive('garb', function () {console.log('garb service')})`;
      LazyLoad.loadFromString('app', str);
      LazyLoad.loadFromUrl('app', '/resources/json/pm.js');
    });

  return moduleName; // the name of your module
}));
