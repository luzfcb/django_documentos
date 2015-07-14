function PrisaoCtrl($scope, $http, $filter)
{

	$scope.fases = [];
	$scope.visitas = [];
	$scope.defensores = [];
	$scope.defensorias = [];

	/* ATENDIMENTOS */

	$scope.novo_atendimento = function()
	{
		$scope.atendimento = {pessoa:{telefones:[]}};
		$scope.init_telefone();
	}

	$scope.listar_atendimentos = function()
	{
		$scope.atendimentos = [];
		$http.post('atendimento/listar/').success(function(data){
            $scope.atendimentos = data;
		});
	}

	$scope.salvar_atendimento = function()
	{

		$scope.processar_telefone($scope.atendimento.pessoa.telefones); // telefone > ddd, numero
		
		$http.post('atendimento/salvar/',$scope.atendimento).success(function(data){
            if(data.success)
            {
                $('#modal-cadastrar-atendimento').modal('hide');
                $scope.listar_atendimentos();
            }
		});
	}

	$scope.ver_atendimento = function(atendimento)
	{
		$scope.atendimento = atendimento;
	}

	$scope.buscar_cpf = function()
	{
		if($scope.atendimento.pessoa.cpf)
		{
			$http.post('/assistido/cpf/'+$scope.atendimento.pessoa.cpf+'/json/get/').success(function(data){
				$scope.atendimento.pessoa = data;
				$scope.init_telefone();
				$scope.listar_municipios();
			});
		}
	}

	$scope.listar_municipios = function()
	{
		if($scope.atendimento.pessoa.estado==undefined)
			$scope.atendimento.pessoa.estado = 17;

		$http.get('/estado/' + $scope.atendimento.pessoa.estado + '/municipios/').success(function(data){
			$scope.municipios = data;
		});
	}

	// TELEFONE
	$scope.init_telefone = function()
	{

		if($scope.atendimento.pessoa.telefones == undefined)
			$scope.atendimento.pessoa.telefones = [];

		while($scope.atendimento.pessoa.telefones.length < 1)
			$scope.adicionar_telefone();

		$scope.processar_telefone($scope.atendimento.pessoa.telefones); // telefone < ddd, numero

	}

	$scope.adicionar_telefone = function()
	{
		$scope.atendimento.pessoa.telefones.push({id: null, ddd: null, numero: null, telefone: null, tipo: 0});
	}

	$scope.processar_telefone = function(telefones)
	{
		for(var i = 0; i < telefones.length; i++)
		{
			if(telefones[i].telefone)
			{	
				var telefone = telefones[i].telefone.replace(/\D/g,'');
				telefones[i].ddd = telefone.substring(0,2);
				telefones[i].numero = telefone.substring(2);
			}
			else
			{
				telefones[i].telefone = telefones[i].ddd + telefones[i].numero;
			}
		}
	}

	/* VISITAS */

	$scope.nova_visita = function()
	{
		$scope.visita = {data_atendimento:new Date()};
	}

	$scope.ver_visita = function(visita)
	{
		$scope.visita = visita;
	}

	$scope.listar_visitas = function()
	{
		$scope.visitas = [];
		$http.post('visita/listar/').success(function(data){
            $scope.visitas = data;
		});
	}

	$scope.salvar_visita = function()
	{
		$http.post('visita/salvar/',$scope.visita).success(function(data){
            if(data.success)
            {
                $('#modal-cadastrar-visita').modal('hide');
                $scope.listar_visitas();
            }
		});
	}

	$scope.set_data_atendimento = function()
	{
		$scope.visita.data_atendimento = $filter('date')($filter('utc')($scope.visita.dia_atendimento), "dd/MM/yyyy") + ' ' + $scope.visita.hora_atendimento;
	}

	/* FASES PROCESSUAIS */

	$scope.nova_fase = function()
	{
		$scope.fase = {data_protocolo:new Date(), audiencia_realizada:0};
	}

	$scope.fase_carregar = function(fase_id)
	{
		$http.get('/processo/fase/'+fase_id+'/get/json/').success(function(data){
			
			$scope.fase = data.fase;
			$scope.fase.hora_protocolo = $filter('date')($filter('utc')($scope.fase.data_protocolo), "HH:mm");

			for(var i = 0; i < $scope.defensores.length; i++)
			{
				if($scope.defensores[i].id==$scope.fase.defensor_cadastro)
					$scope.fase.defensor = $scope.defensores[i];
			}

			for(var i = 0; i < $scope.fases.length; i++)
			{
				if($scope.fases[i].id==$scope.fase.tipo)
					$scope.fase.tipo = $scope.fases[i];
			}

		});
	}

	$scope.set_data_protocolo = function()
	{
		$scope.fase.data_hora_protocolo = $filter('date')($filter('utc')($scope.fase.data_protocolo), "dd/MM/yyyy") + ' ' + $scope.fase.hora_protocolo;
	}

	function init()
	{

		$http.get('/defensor/listar/').success(function(data){
			$scope.defensores = data.defensores;
			$scope.defensorias = data.defensorias;
		});

		$http.get('/processo/fase/tipo/listar/').success(function(data){
			$scope.fases = data;
		});

		$http.get('/estado/listar/').success(function(data){
			$scope.estados = data;
		});

		$scope.listar_visitas();
		$scope.listar_atendimentos();

	}

	init();

}