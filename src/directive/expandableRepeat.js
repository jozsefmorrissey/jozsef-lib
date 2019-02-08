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
