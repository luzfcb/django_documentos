function ExecucaoFiscalCtrl($scope, $http, $filter)
{

	$scope.dia_semana = 0;
	$scope.dias_semana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
	$scope.tipos = [{id:0, nome:'Diária'}, {id:1, nome:'Semanal'}];
	$scope.tipos_agenda = ['Pauta', 'Extra-pauta'];
	$scope.agenda = {tipo: 1, ativo: 1, dias: [], defensor: null, defensoria: null};
	$scope.dias = null;

	$scope.salvando = false;

	$scope.limpar = function(dia, aplicar)
	{

		if(aplicar==undefined) aplicar = true;

		if(dia==undefined)
		{
			// passa por todos os dias limpando configuracao
			for(var j = 0; j < $scope.dias.length; j++)
			{
				$scope.limpar($scope.dias[j], false);
			}
		}
		else
		{
			// passa por todas agendas limpando configuracao
			for(var j = 0; j < dia.agendas.length; j++)
			{
				dia.agendas[j].hora_ini = null;
				dia.agendas[j].hora_fim = null;
				dia.agendas[j].duracao = null;
			}
		}

		if(aplicar)
			$scope.aplicar();

	}

	$scope.clonar = function(dia)
	{
		
		if($scope.agenda.tipo==0 && !dia.ativo)
			return;

		// passa por todos os dias
		for(var i = 0; i < $scope.dias.length; i++)
		{
			// se dia diferente do informado e ativo
			if($scope.dias[i].dia_semana != dia.dia_semana)
			{
				// passa por todas agendas clonando configuracao
				for(var j = 0; j < dia.agendas.length; j++)
				{
					$scope.dias[i].agendas[j].hora_ini = dia.agendas[j].hora_ini;
					$scope.dias[i].agendas[j].hora_fim = dia.agendas[j].hora_fim;
					$scope.dias[i].agendas[j].duracao = dia.agendas[j].duracao;
				}
			}
		}

		$scope.aplicar();

	}

	$scope.aplicar = function()
	{

		// passa por todos dias
		for(var i = 0; i < $scope.dias.length; i++)
		{
			// passa por todas agendas do dia
			for(var j = 0; j < $scope.dias[i].agendas.length; j++)
			{

				// carrega informacoes da agenda
				var agenda = $scope.dias[i].agendas[j];
				var horarios = [];

				// se dados validos, gera horarios no periodo com a duracao informada
				if(agenda.duracao != null && agenda.hora_ini != null && agenda.hora_fim != null)
				{
					
					if(agenda.hora_ini.length == 5 && agenda.hora_fim.length == 5 && agenda.duracao > 9)
					{

						if(!isNaN(parseFloat(agenda.duracao)))
						{

							// var duracao = parseInt(agenda.duracao.substring(0, 2)) * 60 + parseInt(agenda.duracao.substring(3, 5));
							var duracao = parseInt(agenda.duracao) * 60000;
							var ini = new Date(2013, 0, 1, agenda.hora_ini.substring(0, 2), agenda.hora_ini.substring(3, 5));
							var fim = new Date(2013, 0, 1, agenda.hora_fim.substring(0, 2), agenda.hora_fim.substring(3, 5));

							while(ini.getTime() < fim.getTime())
							{
								horarios.push($filter('date')(ini, "HH:mm"));
								ini = new Date(ini.getTime() + duracao);
							}
							
						}

					}

				}

				// atualiza horarios
				agenda.horarios = horarios;

			}
		}

	}

	$scope.salvar = function()
	{

		if($('#CadastroForm').valid())
		{

			$scope.salvando = true;
			show_stack('Salvando...', false);

			$http.post('salvar/', $scope.agenda).success(function(data){
				
				$scope.salvando = false;
				
				if(data.success)
					show_stack_success('Registro gravado com sucesso!');
				else
					show_stack_error('Erro ao salvar! Verifique se todos os campos foram preenchidos corretamente.');

			});
			
		}

	}

	$scope.carregar = function(defensor_id, defensoria_id)
	{

		show_stack('Carregando...', false);

		if(defensor_id==undefined) defensor_id = null;
		if(defensoria_id==undefined) defensoria_id = null;

		$http.post('', $scope.agenda).success(function(data){

			if(defensor_id==null)
				$scope.defensores = data.defensores;

			if(defensoria_id==null)
				$scope.defensorias = data.defensorias;
				data.ageda = null;

			if(data.agenda==null)
				$scope.agenda = {tipo: 1, ativo: true, dias: [], defensor: defensor_id, defensoria: defensoria_id};
			else
				$scope.agenda = data.agenda;

			$scope.carregar_dias($scope.agenda.dias);
			$scope.aplicar();

			hide_stack();

		});

	}

	$scope.carregar_dias = function(dias)
	{

		//guarda primeiro dia ativo como modelo para dias sem agenda
		dia_base = null;

		for(var i = 0; i < $scope.dias_semana.length; i++)
		{
			
			dia = dias[i];

			if(dia==undefined)
			{
				dia = {dia_semana:i, nome:$scope.dias_semana[i], agendas:[], ativo:true}
				dias.push(dia);
			}
			else
			{
				dia.nome = $scope.dias_semana[i];
				if(dia_base == null & dia.ativo) dia_base = dia;
			}
			
			tipos = [false, false];

			for(var tipo = 0; tipo < tipos.length; tipo++)
			{
				for(var agenda = 0; agenda < dia.agendas.length; agenda++)
				{
					if(dia.agendas[agenda].tipo == tipo)
						tipos[tipo] = true;
				}

				if(!tipos[tipo])
					dia.agendas.push({dia_semana: i, hora_ini:null, hora_fim:null, duracao:null, tipo:tipo, ativo:1});

			}

		}

		$scope.dias = dias;

		//Se agenda semanal, aplica agenda do dia base para todos os dias da semana
		if($scope.agenda.tipo==1 & dia_base !=undefined)
			$scope.clonar(dia_base);

	}

	$scope.abr_dia = function(dia)
	{
		return dia.substring(0, 3).toLowerCase();
	}

	$scope.set_dia_semana = function(dia)
	{
		$scope.dia_semana = dia;
	}

	$scope.min_dias_ativos = function(dia)
	{
		
		var qtd = 0;

		for(var i = 0; i < $scope.dias.length; i++)
		{
			if($scope.dias[i].ativo) qtd++;
		}

		return (qtd==1 && dia.ativo);

	}


	$scope.carregar();

}