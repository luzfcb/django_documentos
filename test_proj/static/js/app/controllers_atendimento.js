function AtendimentoIndexCtrl($scope, $http, $filter)
{

    $scope.carregar = function()
    {

        $scope.semanas = [];
        $scope.atendimentos = [];
        $scope.documentos = [];
        $scope.tarefas = [];

        $scope.carregando = true;
        $scope.carregando_resumo = true;
        $scope.carregando_documentos = true;
        $scope.carregando_tarefas = true;

		$http.post('index/resumo/get/', {data:$scope.dia}).success(function(data){

            dia = $filter('utc')($scope.dia);
            $scope.carregarMes(dia.getFullYear(), dia.getMonth(), data);
			$scope.carregando_resumo = false;

            $http.post('index/get/', {data:$scope.dia}).success(function(data){
                $scope.atendimentos = data;
                $scope.carregando = false;

                $http.post('index/tarefas/get/', {data:$scope.dia}).success(function(data){
                    $scope.tarefas = data;
                    $scope.carregando_tarefas = false;
                });

                $http.post('index/documentos/get/', {data:$scope.dia}).success(function(data){
                    $scope.documentos = data;
                    $scope.carregando_documentos = false;
                });
            });

		});

    }

    $scope.carregarMes = function(ano, mes, resumo)
    {

        $scope.ano = ano;
        $scope.mes = mes;

        var ini = new Date(ano, mes, 1);
        var fim = new Date(ano, mes + 1, 0);

        $scope.data_ini = ini;
        $scope.data_fim = fim;

        var last = new Date(ano, mes, 1);
        last.setHours(-24);

        var diasMes = fim.getDate();
        var diaSemana = ini.getDay();

        var semana = [];
        var semanas = [];

        semanas = [];
        semanas.push(semana);

        for(var i = 0; i < diaSemana; i++)
            semana.push(last.getDate()-(diaSemana-i-1));

        for(var dia = 1; dia <= diasMes; dia++)
        {

            if(diaSemana==0)
            {
                semana = [];
                semanas.push(semana);
            }

            semana.push({data:new Date(ano, mes, dia), audiencias:resumo.audiencias[dia-1], agendamentos:resumo.agendamentos[dia-1]});

            diaSemana++;
            if(diaSemana==7)
                diaSemana = 0;

        }

        if(diaSemana!=0)
        {
            for(var i = diaSemana; i < 7; i++)
                semana.push(i-diaSemana+1);
        }

        $scope.semanas = semanas;

    }

    $scope.init = function()
    {
        $scope.dia = new Date();
        $scope.carregar();
    }

    $scope.init();

}

function AtendimentoCtrl($scope, $http)
{

	$scope.set_formulario = function(formulario)
	{
		$scope.formulario = formulario;
	}

	$scope.salvar_formulario = function()
	{
		$scope.salvando = true;
		$http.post('formulario/salvar/', $scope.formulario).success(function(data){
			$scope.salvando = false
			show_stack('Formulário salvo com sucesso!', false, 'success');
		});
	}

    $scope.imprimir = function(data)
    {
        $scope.relatorio = data;
        Chronus.generate($scope, data.user, 'ficha_atendimento', 'atendimento/atendimento/ficha', data.params)
    }

    $scope.imprimir_dec_comparecimento = function(data)
    {
        $scope.relatorio = data;
        Chronus.generate($scope, $scope.relatorio.user, 'declaracao', 'atendimento/atendimento/declaracao', $scope.relatorio.params)
    }

	$scope.listar_outros = function()
	{
		$scope.outros = null;
		$http.post('atender/outros/get/').success(function(data){
			$scope.outros = data;
			$scope.carregando_documentos = false;
		});
	}

	function init()
	{

		$scope.carregando = true;
		$http.get('atender/get/').success(function(data){
			$scope.atendimentos = data;
			$scope.carregando = false;
		});

		$http.post('formulario/listar/').success(function(data){
			$scope.formularios = data.formularios;
		});

	}

	init();

}

function BuscarCtrl($scope, $http)
{

	$scope.informacoes = function(atendimento)
	{
		$http.get('/atendimento/'+atendimento+'/json/get/').success(function(data){
			$scope.atendimento = data;
			$('#modal-informacoes').modal();
		});

	}

    $scope.imprimir_conflitos = function(data)
    {
        $scope.relatorio = data;
        Chronus.generate($scope, data.user, 'conflitos_corrigidos', 'atendimento/atendimento/agendamento', data.params)
    }

}

function TarefaCtrl($scope, $http)
{

	$scope.responsaveis = [];
	$scope.prioridades = ['Urgente', 'Alta', 'Normal', 'Baixa'];
	$scope.prioridades_class = ['label-important', 'label-warning', 'label-info', ''];
	$scope.tarefas = [];

	$scope.nova = function()
	{
		$scope.tarefa = {};
	}

	$scope.excluir = function(obj)
	{
		if(obj==undefined)
		{

		    if($scope.excluindo) return;
		    $scope.excluindo = true;

			$http.post('tarefa/excluir/', $scope.tarefa).success(function(data){
				if(data.success)
				{
					$scope.listar();
					$('#modal-excluir-tarefa').modal('hide');
					show_stack_success('Registro excluído com sucesso!');
				}
				else
				{
					show_stack_error('Ocorreu um erro ao excluir o registro!');
				}
				$scope.excluindo = false;
			});

		}
		else
			$scope.tarefa = obj;
	}

	$scope.finalizar = function(obj)
	{
		if(obj==undefined)
		{
			$http.post('tarefa/finalizar/', $scope.tarefa).success(function(data){
				if(data.success)
				{
					$scope.listar();
					$('#modal-finalizar-tarefa').modal('hide');
					show_stack_success('Registro atualizado com sucesso!');
				}
				else
				{
					show_stack_error('Ocorreu um erro ao atualizar o registro!');
				}
			});
		}
		else
		{
			$scope.tarefa = obj;
			$scope.tarefa.status = ($scope.tarefa.status ? $scope.tarefa.status : 2);
		}
	}

	$scope.salvar = function()
	{

	    if($scope.salvando) return;
	    $scope.salvando = true;

		$http.post('tarefa/salvar/', $scope.tarefa).success(function(data){
			if(data.success)
			{
				$scope.listar();
				$('#modal-cadastrar-tarefa').modal('hide');
			}
			else
			{
				show_stack_error('Ocorreu um erro ao salvar o registro!');
			}
			$scope.salvando = false;
		});
	}

	$scope.listar = function()
	{

	    $scope.tarefas = [];
	    $scope.carregando_tarefas = true;

		$http.post('tarefa/').success(function(data){
			$scope.tarefas = data.tarefas;
			$scope.responsaveis = data.responsaveis;
			$scope.carregando_tarefas = false;
		});

	}

	function init()
	{
		$scope.listar();
		$scope.nova();
	}

	init();

}

function DistribuicaoCtrl($scope, $http)
{

	$scope.buscar = function(filtro)
	{

		if(filtro!=undefined)
			$scope.filtro = filtro;

		$http.post('',$scope.filtro).success(function(data){
			$scope.atuacoes = data.atuacoes;
			$scope.assessores = data.assessores;
			$scope.atendimentos = data.atendimentos;
		});

	}

	$scope.salvar = function()
	{
		if($scope.atendimentos){
			$http.post('salvar/',$scope.atendimentos).success(function(data){
				show_stack('Atendimentos atualizados com sucesso!', false, 'success');
			});
		}
	}

}

function DocumentoCtrl($scope, $http)
{

	$scope.documento = {};
	$scope.documentos = [];

	$scope.excluir = function(obj)
	{
		if(obj==undefined)
		{
			$http.post('documento/excluir/', $scope.documento).success(function(data){
				if(data.success)
				{
					$scope.listar();
					$('#modal-excluir-documento').modal('hide');
					show_stack_success('Documento excluído com sucesso!');
				}
				else
				{
					show_stack_error('Ocorreu um erro ao excluir o documento!');
				}
			});
		}
		else
		{
			$scope.documento = obj;
		}
	}

	$scope.listar = function()
	{

	    $scope.documentos = [];
	    $scope.carregando_documentos = true;

		$http.post('documento/').success(function(data){
			$scope.documentos = data;
			$scope.carregando_documentos = false;
		});

	}

	$scope.carregar = function(documento)
	{
		$scope.documento = documento;
	}

    $scope.imprimir = function(data)
    {
        $scope.relatorio = data;
        Chronus.generate($scope, data.user, 'pendentes', 'atendimento/atendimento/documento', data.params)
    }

	function init()
	{
		$scope.listar();
	}

	init();

}

function NucleoCtrl($scope, $http)
{

	$scope.listar_defensorias = function()
	{

		$scope.defensoria = null;

		$http.post('/nucleo/defensoria/listar/', {'nucleo':$scope.nucleo}).success(function(data){
			if(data.success)
			{
				$scope.defensorias = data.defensorias;
			}
		});

	}

}

function OrganizacaoCtrl($scope, $http)
{

	$scope.pessoa = {};
	$scope.pessoas = [];

	$scope.listar_municipios = function(estado)
	{
		$http.get('/estado/'+$scope.pessoa.estado+'/municipios/').success(function(data){
			$scope.municipios = data;
		});
	}

	$scope.pesquisar = function(filtro)
	{
		$http.get('/assistido/comunidade/listar/',{params:{'q':filtro}}).success(function(data){
			$scope.pessoas = data;
		});
	}

	$scope.carregar = function(obj)
	{
		$scope.tab = 1;
		$scope.pessoa = obj;
		$scope.listar_municipios($scope.pessoa.estado);
	}

	$scope.salvar = function(ultimo)
	{

		$scope.salvando = true;

		$http.post($('#ComunidadeForm').attr('action'), $scope.pessoa).success(function(data){

			if(data.success)
			{
				$scope.salvando = false;
				$scope.pessoa = data.pessoa;
				$('#modal-comunidade').modal('hide');
				show_stack_success('Registro gravado com sucesso!');
			}
			else
			{
				show_stack_error('Erro ao salvar! Verifique se todos os campos foram preenchidos corretamente.');
			}

			$scope.salvando = false;

		}).error(function(){

			show_stack_error('Erro ao salvar! Verifique se todos os campos foram preenchidos corretamente.');
			$scope.salvando = false;

		});

	}

	$scope.limpar = function(tab)
	{
		$scope.tab = (tab == undefined ? 0 : tab);
		$scope.pessoa = {};
		$scope.estado = null;
	}

	function init()
	{

		$scope.limpar();

		$http.get('comunidade/listar/').success(function(data){
			$scope.tab = (data.success ? 1 : 0);
			$scope.pessoa = data.comunidade;
			if($scope.pessoa)
				$scope.listar_municipios($scope.pessoa.estado);
		});

		$http.get('/estado/listar/').success(function(data){
			$scope.estados = data;
		});

	}

	init();

}

function PerfilAdminCtrl($scope, $http)
{

	$scope.init = function()
	{
        $http.get('/diretoria/listar/').success(function(data){

            var grupos = [];
            var grupo = [];
            var item = 0;

            for(var i in data)
            {
            	grupo.push(data[i]);

            	if(grupo.length==4)
            	{
            		grupos.push(grupo);
            		grupo = [];
            	}

            }

            grupos.push(grupo);
            $scope.grupos = grupos;

		});
	}

}
