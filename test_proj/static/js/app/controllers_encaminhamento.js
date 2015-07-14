function BuscarOrgaoModel($scope, $http)
{

	$scope.orgao = {};
	$scope.filtro = {'orgao':null};

	$scope.buscar = function()
	{
		$http.post('/atendimento/encaminhamento/buscar/', $scope.filtro).success(function(data){
			$scope.orgaos = data;
		});
	}

	$scope.visualizar = function(orgao)
	{
		$scope.orgao = orgao;
		$('#modal-encaminhar').modal();
	}

	$scope.encaminhar = function() 
	{
		window.location = '/atendimento/encaminhamento/encaminhar/' + $scope.orgao.id;
	}
}