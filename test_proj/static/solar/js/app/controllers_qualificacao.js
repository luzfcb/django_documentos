function BuscarQualificacaoModel($scope, $http)
{

	$scope.item_qualificacao = {};
	$scope.filtro = {query:''};
	$scope.last_filtro = '';

	$scope.buscar_key = function(e)
    {
        // Busca automatico se enter (13)
        if(e.which==13)
        {
            $scope.buscar();
            // Cancela evento padrao do enter (limpar form)
            e.preventDefault();
        }
    }

	$scope.buscar = function(filtro)
	{

		if(filtro!=undefined)
			$scope.filtro.query = filtro;

		if($scope.filtro.query.trim().length >= 3 && $scope.filtro.query.trim() != $scope.last_filtro){

			$scope.carregando = true;
			$scope.last_filtro = $scope.filtro.query.trim();
			$scope.itens_qualificacao = null;

			$http.post('/atendimento/qualificacao/buscar/', $scope.filtro).success(function(data){
				$scope.itens_qualificacao = data;
				$scope.carregando = false;
			});
		}

	}

	$scope.qualificar = function()
	{
		window.location = '/atendimento/qualificacao/qualificar/' + $scope.item_qualificacao.id;
	}

	$scope.novo = function()
	{
		$('#modal-nova-qualificacao').modal();
	}

	$scope.visualizar = function(item_qualificacao)
	{
		
		$scope.item_qualificacao = item_qualificacao;

		$http.post('/atendimento/qualificacao/visualizar/', {'id':$scope.item_qualificacao.id}).success(function(data){
			$scope.item_qualificacao = data;
			$('#modal-item-qualificacao').modal();
		});
		
	}

}