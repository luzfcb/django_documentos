function AtuacaoCtrl($scope, $http)
{

	$scope.defensor = {};
	$scope.defensores = [];
	$scope.defensorias = [];
    $scope.atuacoes = [{id: 0, nome: 'Substituição'}, {id: 1, nome: 'Acumulação'}, {id: 2, nome: 'Titular'}];
    $scope.documentos = [{id: 0, nome: 'Portaria'}, {id: 1, nome: 'Ato'}, {id: 2, nome: 'Edital'}];

	$scope.show_atuacao = function(defensor, tipo)
	{

		$scope.errors = null;
		$scope.defensor = defensor;
		$scope.atuacao = $scope.atuacoes[tipo];

		if(tipo==0)
			$scope.defensor.atuacao = {tipo:tipo, data_inicial:null, data_final:null, titular:defensor.id};
		else
			$scope.defensor.atuacao = {tipo:tipo, data_inicial:null, data_final:null, defensor:defensor.id};

		$('#modal-atuacao').modal();

	}

	$scope.show_detalhes = function(defensor)
	{
		$scope.defensor = defensor;
		$http.get('../'+$scope.defensor.id+'/atuacoes/').success(function(data){
			$scope.defensor.atuacao = data;
			$('#modal-detalhes').modal();
		});
	}

	$scope.show_excluir = function(atuacao)
	{
		$scope.atuacao = atuacao;
		$scope.data_fim = new Date();
        $http.get('/defensor/'+$scope.atuacao.defensor.id+'/defensoria/'+$scope.atuacao.defensoria.id+'/substitutos/').success(function(data) {
            $scope.atuacao.substituicoes = data;
            $http.get('/evento/atuacao/'+$scope.atuacao.id+'/listar/').success(function(data) {
                $scope.atuacao.agendas = data;
                $('#modal-excluir').modal();
            });
        });
	}

	$scope.excluir = function()
	{
		$scope.atuacao.data_fim = $scope.data_fim;
		$http.post('excluir/', $scope.atuacao).success(function(data){
			if(data.success)
			{
				$scope.recarregar();
				$('#modal-excluir').modal('hide');
			}
		});
	}

	$scope.salvar = function()
	{
		$scope.errors = null;
		$http.post('salvar/', $scope.defensor.atuacao).success(function(data){
			if(data.success)
			{

				if($scope.defensor.atuacao==2)
					$scope.defensor.titular = data.titular;

				$scope.recarregar();
				$('#modal-atuacao').modal('hide');

			}
			else
			{
				$scope.errors = data.errors;
			}
		});
	}

	$scope.carregar_titularidades = function()
	{
		if($scope.titularidades)
			return;
		$scope.carregando = true;
		$http.get('titularidade/listar/').success(function(data){
			$scope.titularidades = data;
			$scope.carregando = false;
		});
	}

	$scope.carregar_acumulacoes = function()
	{
		if($scope.acumulacoes)
			return;
		$scope.carregando = true;
		$http.get('acumulacao/listar/').success(function(data){
			$scope.acumulacoes = data;
			$scope.carregando = false;
		});
	}

	$scope.carregar_substituicoes = function()
	{
		if($scope.substituicoes)
			return;
		$scope.carregando = true;
		$http.get('substituicao/listar/').success(function(data){
			$scope.substituicoes = data;
			$scope.carregando = false;
		});
	}

    $scope.recarregar = function()
    {
        $scope.init();
        $scope.carregar_titularidades();
        $scope.carregar_substituicoes();
        $scope.carregar_acumulacoes();
    }

	$scope.init = function()
	{

        $scope.defensores = null;
        $scope.defensorias = null;
        $scope.titularidades = null;
        $scope.substituicoes = null;
        $scope.acumulacoes = null;

		$http.get('/comarca/listar/').success(function(data){
			$scope.comarcas = data;
		});

        $scope.carregando = true;
		$http.get('../listar/').success(function(data){
			$scope.defensores = data.defensores;
			$scope.defensorias = data.defensorias;
			$scope.carregando = false;
		});

	}

}


function DefensorServidorCtrl($scope, $http)
{
	$scope.defensor = {};

	$scope.limpar_dados = function()
	{
		$scope.defensor.login_eproc = null;
		$scope.defensor.senha_eproc = null;
		$scope.defensor.confirma_senha_eproc = null;
	}

}
