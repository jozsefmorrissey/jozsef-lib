
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
	// Generated Code Start
	mod.constant('LazyLoad', LazyLoad)
	mod.directive('book', book)
	mod.directive('chain', chain)
	mod.directive('drawBridge', drawBridge)
	mod.directive('expandableRepeat', expandableRepeat)
	mod.service('domAop', domAop)
	mod.service('UtilSrvc', UtilSrvc)
	// Generated Code End

  return moduleName; // the name of your module
}));
