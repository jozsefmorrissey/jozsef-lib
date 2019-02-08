
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
	mod.constant('LazyLoad', LazyLoad)
	mod.directive('book', book)
	mod.directive('chain', chain)
	mod.directive('drawBridge', drawBridge)
	mod.directive('expandableRepeat', expandableRepeat)
	mod.service('domAop', domAop)
	mod.service('UtilSrvc', UtilSrvc)

  return moduleName; // the name of your module
}));

let loader = {};

function loadFromUrl(appName, url) {
  jQuery.get(url,
    function (data) {
      console.log(data);
      loadFromString(appName, data);
    });
}

function loadFromString(appName, string) {
  console.log(string);
  eval(`let ${appName} = loader;${string}`);
}

function buildLoader ($provide, $controllerProvider, $animateProvider,
  $filterProvider, $compileProvider) {
  loader.service = $provide.service;
  loader.factory = $provide.factory;
  loader.value = $provide.value;
  loader.constant = $provide.constant;
  loader.controller = $controllerProvider.register;
  loader.animate = $animateProvider.register;
  loader.filter = $filterProvider.register;
  loader.directive = $compileProvider.directive;
  loader.loadFromString = loadFromString;
  loader.loadFromUrl = loadFromUrl;
}

angular.module('jozsefLib')
  .config(buildLoader);

function LazyLoad () {
  console.log("lazyloader up!")
  return loader;
}

exports.LazyLoad = loader;

function book() {
  function ctrl($scope, $element, $compile) {
    $scope.pages = [];

    function savePages() {
      function savePage() {
        $scope.pages.push($(this).html());
      }

      $(`.${$scope.sectionClass}`).each(savePage);
    }

    function getTurnPage(clickedPage, backCover) {
        let content;
        if (clickedPage >= $scope.pages.length && !backCover) {
          content = getBackCover(clickedPage + 1);
        } else if (clickedPage === 1) {
          content = getFrontCover();
        } else if (clickedPage % 2 === 0 && !backCover) {
          content = $('<div class="book-cover-inside"></div>');
          content.append(getPage(clickedPage + 1));
          content.append(getPage(clickedPage + 2));
        } else {
          content = $('<div class="book-cover-inside"></div>');
          content.append(getPage(clickedPage - 2));
          content.append(getPage(clickedPage - 1));
        }
        $($element).html($compile(content)($scope));
    }

    function getFrontCover() {
      return `  <div class='book-outer book-left' ng-click='getTurnPage(0)'>
                  <div class='book-binding'></div>
                  <div class='book-cover'>
                    <div class='center center-vertical'>
                      <b class='book-title'>A Pleasurable Conquest</b>
                      <br>
                      <b class='book-author'>By Jozsef Morrissey</b>
                    </div>
                  </div>
                </div>`;
    }

    function getBackCover(page) {
      return `  <div class='book-outer' ng-click='getTurnPage(${page}, true)'>
                  <div class='book-binding'></div>
                  <div class='book-cover'>
                    <div class='center center-vertical'>
                      About the Autor!
                    </div>
                  </div>
                </div>`;
    }

    function getPage(number) {
      let pages = number * 1;
      let pageClass = 'book-page-left';
      let borderClass = 'right-border-thin';
      if (number % 2 === 0) {
        borderClass = 'left-border-thin';
        pageClass = 'book-page-right';
      }

      let divTemplate = `<div class="${pageClass}"></div>`;
      let page = $(divTemplate).html(`<div class='large-padding'>
                                        ${$scope.pages[number - 1]}
                                      </div>`);
      for (let count = 0; count < pages; count++) {
        page = $(divTemplate).html(page);
      }
      let side = 'book-right';
      return $(`<div class='book-outer ${borderClass}' ng-click='getTurnPage(${number})'></div>`).html(page);
    }


    $scope.getTurnPage = getTurnPage;
    savePages();
    getTurnPage(1);
  }
  return {
    scope: {
      titleId: '@',
      backId: '@',
      sectionClass: '@',
    },
    controller: ctrl,
  };
}

exports.book = book;

function chain() {
  function createCover($scope) {
    const div = $('<div></div>');
    div.css({
      position: 'absolute',
      'background-color': $scope.capColor,
      width: '10pt',
      height: '10pt',
      left: `${$scope.startX - 2.5}px`,
      top: `${$scope.startY - 5}px`,
      'z-index': 1,
    });
    return div;
  }


  function ctrl($scope, $element) {
    const linkTemp = '<b>8</b>';
    $element.append(createCover($scope));
    let currY = Number.parseInt($scope.endY) - 15;
    let count = 0;
    while (currY > $scope.startY - 10) {
      const link = $(linkTemp);
      link.attr('id', `link-${count}`);
      link.css({
        position: 'absolute',
        'font-size': '12pt',
        left: `${$scope.startX}px`,
        top: `${currY}px`,
      });
      $element.append(link);
      currY -= 10;
      count += 1;
    }
  }
  return {
    scope: {
      startX: '@',
      startY: '@',
      endX: '@',
      endY: '@',
      capColor: '@',
    },
    controller: ctrl,
  };
}

exports.chain = chain;

function drawBridge(LazyLoad) {

  function getChain(x, y, height, color) {
    return `<chain start-y='${y}' start-x='${x}' end-y='${height + y}' end-x='${x}' cap-color='${color}'></chain>`;
  }

  function removeChains($element) {
    $($element).find('chain').each(function () {
      $(this).remove();
    });
  }

  const inc =  7;
  function setElemCss($scope, $element, color) {
    if ($scope.open) {
      $scope.displayH += inc;
    } else {
      $scope.displayH -= inc;
    }
    $($element).css({
      'border-bottom': color,
      'border-bottom-style': 'ridge',
      'border-width': '8px',
      margin: '20pt',
      'position': 'relative',
      height: `${$scope.displayH}px`,
      overflow: 'hidden',
    });
  }

  function getChildHeight($element) {
    let height = 0;
    $($element).children().each(function () {
      height += $(this).height();
    });

    return height;
  }

  function callSetChains($scope, $element, $compile, myId, flip) {
    function call() {
      let id = myId;
      if (flip) {
        $scope.aliveId += 1;
        id = $scope.aliveId;
        $scope.open = !$scope.open;
      }
      setChains($scope, $element, $compile, id);
    }

    return call;
  }

  function initChain($scope, $compile, $element, chain) {
    function init() {
      setChains($scope, $element, $compile, ++$scope.aliveId);
    }

    return init;
  }

  function setChains($scope, $element, $compile, myId) {
    if ($scope.aliveId === myId) {
      removeChains($element);
      setElemCss($scope, $element, $scope.capColor);
      const jqObj = $($element);
      const contents = $('<div class="content-wapper"></div>').wrap(jqObj);
      const height = jqObj.height();
      const width = jqObj.width();
      const x = 2.5;//jqObj.position().left;
      const y = 5;//jqObj.position().top;
      const chain1 = getChain(x, y, height, $scope.capColor);
      const chain2 = getChain(x + width - 10, y, height, $scope.capColor);


      // jqObj.html($compile(contents)($scope));
      jqObj.append($compile(chain1)($scope));
      jqObj.append($compile(chain2)($scope));
      if(($scope.displayH < getChildHeight($element) + 10 && $scope.open) ||
          ($scope.displayH > $($($element).children()[0]).height() + 10 && !$scope.open)) {
        setTimeout(callSetChains($scope, $element, $compile, myId), [50]);
      }
    }
  }

  function ctrl($scope, $element, $compile) {
    $scope.aliveId = 0;
    // setChains($scope, $compile, $element, null, true);
    setTimeout(callSetChains($scope, $element, $compile, ++$scope.aliveId), [100]);

    $scope.displayH = $($($element).children()[0]).height() + 20;

    // $scope.$watch($element, callSetChains);

    $($($element).children()[0]).click(callSetChains($scope, $element, $compile, null, true));
  }
  return {
    scope: {
      capColor: '@',
    },
    restrict: 'A',
    controller: ctrl,
  };
}

exports.drawBridge = drawBridge;

function expandableRepeat() {
  function ctrl($scope, $element, $compile) {
    console.log("here: " + $scope.expandableRepeat);
    const split = $scope.expandableRepeat.replace(/\s{1,}/g, ' ').split(' in ');
    const item = split[0];
    const array = split[1];
    $scope[array] = [{}];
    const repeatTemplate = $($element).html();

    function add() {
      $scope[array].push({});
    }

    function remove(index) {
      $scope[array].splice(index, 1);
    }

    $scope.add = add;
    $scope.remove = remove;

    const template =
      `<div>
        <div ng-repeat='${$scope.expandableRepeat}'>
          ${repeatTemplate}
          <button class='button close-btn' ng-click='remove($index)'>X</button>
        </div>
        <br>
        <div class='center'>
          <button tabindex="0" class='button' ng-click='add()'>Add ${item}</button>
        </div>
      </div>`

    $($element).html($compile(template)($scope));
  }
  return {
    scope: {
      expandableRepeat: '@',
    },
    restrict: 'A',
    controller: ctrl,
  };
}

exports.expandableRepeat = expandableRepeat;

function UtilSrvc () {
  const obj = {};
  function getSingleEmInPixels() {
    let low = 0;
    let high = 200;
    let emWidth = Math.round((high - low) / 2) + low;
    const time = performance.now();
    let iters = 0;
    const maxIters = 10;
    while (high - low > 1) {
        const match = window.matchMedia(`(min-width: ${emWidth}em)`).matches;
        iters += 1;
        if (match) {
            low = emWidth;
        } else {
            high = emWidth;
        }
        emWidth = Math.round((high - low) / 2) + low;
        if (iters > maxIters) {
            console.warn(`max iterations reached ${iters}`);
            break;
        }
    }
    const singleEmPx = Math.ceil(window.innerWidth / emWidth);
    console.log(`window em width = ${emWidth}, time elapsed =  ${(performance.now() - time)}ms`);
    return singleEmPx;
  }

  obj.getSingleEmInPixels = getSingleEmInPixels;
  return obj;
}

exports.UtilSrvc = UtilSrvc;

function domAop() {
  const AFTER = 'blur';
  const CHANGE = 'change';
  const RIGHT_CLICK = 'click';
  const DBL_CLICK = 'dblclick';
  const BEFORE = 'focus';
  const ON_HOVER = 'mouseover';
  const AFTER_HOVER = 'mouseout';
  const LEFT_CLICK = 'mouseup';

  const SURROUND = [BEFORE, AFTER];
  const HOVER = [ON_HOVER, AFTER_HOVER];
  const CLICK = [LEFT_CLICK, RIGHT_CLICK];

  let obj = {};
  let cutPoints = {};

  function reset(groups) {
    const eventKeys = Object.keys(cutPoints);
    for (let keyIndex = 0; keyIndex < eventKeys.length; keyIndex += 1) {
      const cpArr = cutPoints[eventKeys[keyIndex]];
      for (let index = 0; index < cpArr.length; index += 1) {
        const cutPoint = cpArr[index];
        let userSpecified = groups !== undefined && -1 < groups.indexOf(cutPoint.group);
        if (cutPoint.group === undefined || userSpecified) {
          const croppedArr = cpArr.slice(0, index).concat(cpArr.slice(index + 1));
          cutPoints[eventKeys[keyIndex]] = croppedArr;
        }
      }
    }
  }

  function exicuteFunc(event, func) {
    function exicute(e) {
      for (let index = 0; index < cutPoints[event].length; index++) {
        if ($(e.target).is(cutPoints[event][index].cutPoint)) {
          cutPoints[event][index].func(e.target);
        }
      }
    }
    return exicute;
  }

  function addCutPoint(event, cutPoint, func, group) {
    if (cutPoints[event] === undefined) {
      cutPoints[event] = [];
      document.addEventListener(event, exicuteFunc(event, func, group));
    }

    cutPoints[event].push({cutPoint, func, group});
  }

  function before(cutPoint, func, group) {
    addCutPoint(BEFORE, cutPoint, func, group);
  }

  function allClick(cutPoint, func, group) {
    addCutPoint(LEFT_CLICK, cutPoint, func, group);
  }

  function after(cutPoint, func, group) {
    addCutPoint(AFTER, cutPoint, func, group);
  }

  function change(cutPoint, func, group) {
    addCutPoint(CHANGE, cutPoint, func, group);
  }

  function click(cutPoint, func, group) {
    addCutPoint(RIGHT_CLICK, cutPoint, func, group);
  }

  function dblClick(cutPoint, func, group) {
    addCutPoint(DBL_CLICK, cutPoint, func, group);
  }

  function before(cutPoint, func, group) {
    addCutPoint(BEFORE, cutPoint, func, group);
  }

  function hover(cutPoint, func, group) {
    addCutPoint(ON_HOVER, cutPoint, func, group);
  }

  function hoverOff(cutPoint, func, group) {
    addCutPoint(AFTER_HOVER, cutPoint, func, group);
  }

  function surround(cutPoint, func, group) {
    obj.before(cutPoint, func, group);
    obj.after(cutPoint, func, group);
  }

  function surroundHover(cutPoint, func, group) {
    obj.hover(cutPoint, func, group);
    obj.hoverOff(cutPoint, func, group);
  }

  obj.surroundHover = surroundHover;
  obj.surround =surround;
  obj.click = click;
  obj.before = before;
  obj.after = after;
  obj.dblClick = dblClick;
  obj.hover = hover;
  obj.hoverOff = hoverOff;
  obj.change = change;
  obj.allClick = allClick;
  obj.reset = reset;
  return obj;
}

exports.domAop = domAop;
