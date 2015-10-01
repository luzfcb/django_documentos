var app = angular.module('SisatApp', ['ui.utils','ui.bootstrap','$strap.directives','ngSanitize','maskMoney']);

app.config(function($httpProvider){
    $httpProvider.defaults.headers.post['X-CSRFToken'] = $('input[name=csrfmiddlewaretoken]').val();
});

app.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.filter('newLines', function(){
	return function(text) {
        if(text!=undefined)
            return text.replace(/\n/g, '<br />');
    }
});

app.filter('noHTML', function () {
    return function(text) {
        if(text!=undefined)
            return text
                    .replace(/&/g, '&amp;')
                    .replace(/>/g, '&gt;')
                    .replace(/</g, '&lt;');
    }
});

app.filter('hora_ini_fim', function () {
    return function(hora_ini, intervalo) {
        var hora_fim = new Date(hora_ini.getTime() + intervalo * 60000);
        return hora_ini.toLocaleTimeString().substring(0,5) + ' - ' + hora_fim.toLocaleTimeString().substring(0,5);
    }
});

app.filter('exclude', function() {
  return function(input, item) {
    var out = [];
      if (input != null){
          for (var i = 0; i < input.length; i++){
              if(input[i].id != item.id)
                  out.push(input[i]);
          }
      }
    return out;
  };
});

app.filter('utc', function(){
    return function(d) {
        if(d==undefined) return 'Não informado(a)';
        date = new Date(d); //converte string em data
        date = new Date(date.getTime()+date.getTimezoneOffset()*60000); //soma diferenca de timezone
        if(d.length==10) date = new Date(date.getTime()+date.getTimezoneOffset()*60000); //soma diferenca de timezone
        return date;
    }
});

app.filter('default', function() {
	return function(input, defaultValue) {
		if (input == undefined || input == null)
		    return defaultValue;
		return input;
	};
});

app.directive('upperText', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
            if(inputValue !== undefined){
               var capitalized = inputValue.toUpperCase();
               var caretPosition = getCaretPosition(element.get(0));
               if(capitalized !== inputValue) {
                  modelCtrl.$setViewValue(capitalized);
                  modelCtrl.$render();
                }         
                setCaretPosition(element.get(0), caretPosition);
                return capitalized;
            }
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
});

app.factory('$socket', function($rootScope){

    var socket = io.connect(NODE_SERVER);

    return {
        on : function (eventName, callback) {
            socket.on(eventName, function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(socket, args);
                });
            });
        },
        emit : function (eventName, data, callback) {
            socket.emit(eventName, data, function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    if (callback)
                        callback.apply(socket, args);                   
                });
            });
        }
    };

});

Date.prototype.getDayOnYear = function(){
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((this - onejan) / 86400000);
}

Date.prototype.getDaysInYear = function(){
  var fev = new Date(this.getFullYear(),2,0);
  return (fev.getDate()==29 ? 366 : 365);
}