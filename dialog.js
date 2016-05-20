var app = angular.module('UtilityDirective', []);

app.directive('dialog', function(config, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      btnText: '@',
      width: '@',
      height: '@',
      btnClass: '@'
    },
    template: '<div>' + 
      '<button ng-class="createBtnClass()" ng-click="showDialog()">{{btnText}}</button>' + 
      '<span ng-transclude></span>' +
    '</div>',

    link: function (scope, element, attrs, ctrl, transclude) {
      scope.dialog = '';
      scope.isOpenDialog = false;

      if(angular.isDefined(element.dialog)) {
        scope.showDialog = function() {
          scope.isOpenDialog = true;
        }

        scope.$watch('isOpenDialog', function(newVal) {
          if(scope.dialog != '') {
            if(newVal) {
              scope.dialog.dialog('open');
            } else {
              // wait angular cycle complete
              $timeout(function() {
                scope.dialog.dialog('close');
              }, 0, false);
            }
          }
        });

        scope.createBtnClass = function() {
          return 'btn btn-sm ' + scope.btnClass;
        };

        // change scope of transclude to reference with this
        transclude(scope, function(clone, scope) {
          // copy transclude in the template. then, appending copy transclude into the template for allowing new transclude access directive scope
          element.append(clone);
          // remove old transclude in template(must not compile because there is appending new transclude above)
          element.children().eq(1).remove();

          // after compile template
          $timeout(function() {
            scope.dialog = element.children().eq(1).dialog({
              width: scope.width,
              height: scope.height,
              modal: true,
              draggable: false,
              autoOpen: false,
              close: function(){
                scope.$apply(function() {
                  if(Boolean(scope.isOpenDialog)) {
                    scope.isOpenDialog = false;
                  }
                });
              }
            });
          }, 0, false);
        });
      } else {
        console.log('Please include jquery');
      }
    }
  };
});