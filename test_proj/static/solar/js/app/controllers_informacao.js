function BuscarInformacaoModel($scope, $http)
{

	$scope.informacao = {};
	$scope.filtro = {'informacao':null};

	$scope.buscar = function()
	{
		$http.post('/atendimento/informacao/buscar/', $scope.filtro).success(function(data){
			$scope.informacoes = data;
		});
	}

	$scope.visualizar = function(informacao)
	{
		$scope.informacao = informacao;
		$('#modal-informar').modal();
	}

	$scope.informar = function() 
	{
		window.location = '/atendimento/informacao/informar/' + $scope.informacao.id;
	}
}