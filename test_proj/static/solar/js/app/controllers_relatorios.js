function RelatorioAtividadesCtrl($scope, $http, $filter)
{

	$scope.listar_comarcas = function()
	{

        $scope.relatorio.status=null
        $scope.comarcas = null;

		if ($scope.relatorio.params.defensor_id)
			var link = '/defensor/'+$scope.relatorio.params.defensor_id+'/comarcas/'+$scope.relatorio.params.ano;
		else
			var link = '/comarca/listar/';

		$http.get(link).success(function(data){
			$scope.comarcas = data;
		});

	}

	$scope.listar_defensores = function()
	{

        $scope.relatorio.status=null
		$scope.defensores = null;

		if ($scope.relatorio.params.ano){
			$http.get('/defensor/listar/'+$scope.relatorio.params.ano+'/').success(function(data){
				$scope.defensores = data.defensores;
			});
		}

	}

    $scope.gerar = function()
    {
        $scope.relatorio.name = $scope.relatorio.tipo == 0 ? 'atividade_geral': 'atividade_geral_1';
        Chronus.generate($scope, $scope.relatorio.user, $scope.relatorio.name, $scope.relatorio.resource, $scope.relatorio.params)
    }

	$scope.init = function(data)
	{

        $scope.relatorio = {
            params: {
                comarca_id: 0,
                defensor_id: 0
            },
            tipo: 0,
            resource: 'atendimento/corregedoria/atividades',
            status: null};

        for(var key in data)
            $scope.relatorio[key] = data[key];

		$scope.listar_comarcas();
		$scope.listar_defensores();

	}

}

function RelatorioAtendimentosCtrl($scope, $http, $filter)
{

	$scope.listar_defensorias_substituido = function()
	{
		$scope.defensorias = null;
        $http.post('/defensor/defensoria/substituido/listar/', {'defensor':$scope.relatorio.params.defensor_id, 'data_ini':$scope.relatorio.params.data_inicio, 'data_fim': $scope.relatorio.params.data_fim}).success(function(data){
			$scope.defensorias = data;
			if ($scope.defensorias.length)
				$scope.relatorio.params.defensoria_id = $scope.defensorias[0].id;
		});
	}

	$scope.listar_defensorias_titular = function()
	{
		$scope.defensorias = null;
		$http.post('/defensor/defensoria/listar/', {'defensor':$scope.relatorio.params.defensor_id, 'data_ini':$scope.relatorio.params.data_inicio, 'data_fim': $scope.relatorio.params.data_fim}).success(function(data){
			$scope.defensorias = data;
			if ($scope.defensorias.length)
				$scope.relatorio.params.defensoria_id = $scope.defensorias[0].id;
		});
	}

	$scope.listar_defensorias = function()
	{
        if($scope.relatorio.substituido)
            return $scope.listar_defensorias_substituido();
        else
            return $scope.listar_defensorias_titular();
	}

	$scope.listar_defensores = function()
	{
		$scope.defensores = null;
		if ($scope.relatorio.params.data_inicio){
			$http.get('/defensor/listar/'+$scope.relatorio.params.data_inicio.getFullYear()+'/').success(function(data){
				$scope.defensores = data.defensores;
				if ($scope.defensores.length){
					$scope.relatorio.params.defensor_id = $scope.defensores[0].id;
					if ($scope.relatorio.substituido)
						$scope.listar_defensorias_substituido();
					else
						$scope.listar_defensorias();
				}
			});
		}
	}

	$scope.listar_areas = function()
	{
		$scope.areas = null;
        $http.get('/area/listar/').success(function(data){
            $scope.areas = data;
        });
	}

    $scope.gerar = function()
    {
        $scope.relatorio.name = $scope.relatorio.substituido ? 'atendimento_dos_substitutos': 'atendimento';
        Chronus.generate($scope, $scope.relatorio.user, $scope.relatorio.name, $scope.relatorio.resource, $scope.relatorio.params)
    }

	$scope.init = function(data)
	{

        var date = new Date();

        $scope.relatorio = {
            params: {
                data_inicio: new Date(date.getFullYear(), date.getMonth(), 1),
                data_fim: new Date(date.getFullYear(), date.getMonth() + 1, 0)
            },
            resource: 'atendimento/indenizacoes/atendimentos',
            status: null};

        for(var key in data)
            $scope.relatorio[key] = data[key];

		$scope.listar_areas();
		$scope.listar_defensores();

	}

}

function RelatorioPlantaoCtrl($scope, $http)
{

	$scope.listar_defensores = function()
	{

		if ($scope.relatorio.params.data_inicio){

            $scope.relatorio.status = null;
            $scope.defensores = null;
            $scope.carregando = true;

			$http.post('/defensor/listar/plantao/',{'data_inicial': $scope.relatorio.params.data_inicio, 'data_final': $scope.relatorio.params.data_final}).success(function(data){
                $scope.defensores = data;
				if ($scope.defensores.length){
					$scope.relatorio.defensor = $scope.defensores[0].id;
				}
                $scope.carregando = false;
			});

		}

	}

    $scope.gerar = function()
    {
        Chronus.generate($scope, $scope.relatorio.user, $scope.relatorio.name, $scope.relatorio.resource, $scope.relatorio.params, $scope.relatorio.params.formato)
    }

	$scope.init = function(data)
	{

        var date = new Date();

        $scope.relatorio = {
            params: {
                formato: 0,
                data_inicio: new Date(date.getFullYear(), date.getMonth(), 1),
                data_final: new Date(date.getFullYear(), date.getMonth() + 1, 0)
            },
            resource: 'atendimento/corregedoria/plantao',
            status: null};

        for(var key in data)
            $scope.relatorio[key] = data[key];

        $scope.listar_defensores();

	}

}

function RelatorioProcessoFaseCtrl($scope, $http)
{

    $scope.gerar = function()
    {
        Chronus.generate($scope, $scope.relatorio.user, $scope.relatorio.name, $scope.relatorio.resource, $scope.relatorio.params)
    }

	$scope.init = function(data)
	{

        var date = new Date();

        $scope.relatorio = {
            params: {
                formato: 'pdf',
                data_inicial: new Date(date.getFullYear(), date.getMonth(), 1),
                data_final: new Date(date.getFullYear(), date.getMonth() + 1, 0)
            },
            resource: 'atendimento/indenizacoes/processos',
            status: null};

        for(var key in data)
            $scope.relatorio[key] = data[key];

	}

}
