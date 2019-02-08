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
