function CadastrarPessoaModel($scope, $http, $filter)
{

	$scope.salvando = false;
	$scope.tipo_telefone = ['Celular', 'Residencial', 'Comercial', 'Recado'];
	$scope.tipo_filiacao = ['Mãe', 'Pai'];

	$scope.listar_bens = function ()
	{
		//cria array a partir do conjunto de inputs especificado
		$('input[name="bens"]').each(function(i){
			if($scope.pessoa.bens[$(this).val()]==undefined)
				$scope.pessoa.bens[$(this).val()] = false;
		});
	}

	$scope.listar_estrutura_moradia = function ()
	{
		//cria array a partir do conjunto de inputs especificado
		$('input[name="estrutura"]').each(function(i){
			if($scope.pessoa.estrutura[$(this).val()]==undefined)
				$scope.pessoa.estrutura[$(this).val()] = false;
		});
	}

	$scope.init_municipios = function()
	{

		dados = [];
		$('select[name="municipio"] option').each(function(i){
			if(!isNaN(parseInt($(this).val())))
				dados.push({'id':parseInt($(this).val()),'nome':$(this).text()});
		});

		$scope.municipios = dados;

	}

	$scope.listar_bairros = function(query, callback)
	{
		$http.get('/municipio/'+$scope.pessoa.municipio+'/bairros/').success(function(data){
			callback($filter('filter')(data, query));
		});
	}

	$scope.listar_logradouros = function(query, callback)
	{
		$http.get('/municipio/'+$scope.pessoa.municipio+'/logradouros/').success(function(data){
			callback(data);
		});
	}

	$scope.listar_municipios = function(query, callback)
	{

		if(query==undefined)
		{

			if($scope.pessoa.estado==undefined)
				$scope.pessoa.estado = 17;

			$http.get('/estado/' + $scope.pessoa.estado + '/municipios/').success(function(data){
				$scope.municipios = data;
			});

		}
		else
		{
			if($scope.municipios_all==undefined)
			{
				$http.get('/municipio/listar/').success(function(data){
					$scope.municipios_all = data;
					return $scope.listar_municipios(query, callback);
				});
			}
			else
			{
				callback($filter('filter')($scope.municipios_all, query));
			}
		}

	}

	$scope.listar_estados = function(query, callback)
	{
		if($scope.estados_all==undefined)
		{
			$http.get('/estado/listar/').success(function(data){
				$scope.estados_all = data;
				return $scope.listar_estados(query, callback);
			});
		}
		else
		{
			callback(array_to_list($filter('filter')($scope.estados_all, query),'nome'));
		}
	}

	$scope.listar_profissoes = function(query, callback)
	{
		if($scope.profissoes_all==undefined)
		{
			$http.get('/assistido/profissao/listar/').success(function(data){
				$scope.profissoes_all = data;
				return $scope.listar_profissoes(query, callback);
			});
		}
		else
		{
			callback($filter('filter')($scope.profissoes_all, query));
		}
	}

	$scope.listar_renda = function()
	{
		$scope.renda_max = $('select[name="renda"] option:last').val();
	}

	$scope.buscar_cep = function()
	{

		var cep = $scope.pessoa.cep;

		if(cep != undefined && cep.length == 8)
		{
			$http.get('/endereco/get_by_cep/'+cep+'/').success(function(data){

				$scope.pessoa.estado = data.estado_id;
				$scope.listar_municipios();

				$scope.pessoa.municipio = data.municipio_id;
				$scope.pessoa.bairro = data.bairro;
				$scope.pessoa.logradouro = data.logradouro;

			});
		}

	}

	$scope.buscar_cpf =  function()
	{

		if($scope.pessoa.cpf)
		{
			$http.post('/assistido/cpf/existe/', {'id':$scope.pessoa.id, 'cpf':$scope.pessoa.cpf}).success(function(data){
				$scope.cpf = data;
			});
		}
		else
		{
			$scope.cpf = null;
		}

	}

	$scope.salvar = function(ultimo, next)
	{

		if(next == undefined)
			next = true;

		$scope.salvando = true;
		$scope.processar_telefone($scope.pessoa.telefones); // telefone > ddd, numero

		$http.post($('#AssistidoForm').attr('action'), $scope.pessoa).success(function(data){

			if(data.success)
			{

				var novo = ($scope.pessoa.id == null);

				$scope.salvando = false;
				$scope.pessoa = data.pessoa;

				$scope.init_filiacao();
				$scope.init_telefone();
				$scope.avaliar();

				$scope.salvo = ($scope.pessoa.id > 0);

				// se link informado, redireciona
				if(next && $('#next').val())
					window.location = $('#next').val() + '?pessoa_id=' + data.id;
				else
				{
					if(novo)
						window.location = '/assistido/editar/' + $scope.pessoa.id + '/?next=' + $('#next').val();
					else
						show_stack_success('Registro gravado com sucesso!');
				}


			}
			else
			{

				var errors = '<b>Erro ao salvar!</b> Verifique se todos os campos foram preenchidos corretamente:';
				errors += '<ul>';

				for(var i = 0; i < data.errors.length; i++)
				{
					for(var j = 0; j < data.errors.length; j++)
					{
						errors += '<li><b>' + data.errors[i][j][0] + '</b> - ' + data.errors[i][j]['1'] + '</li>';
					}
				}

				errors += '</ul>';
				show_stack_error(errors);

			}

			$scope.salvando = false;

		}).error(function(){

			show_stack_error('Erro ao salvar! Verifique se todos os campos foram preenchidos corretamente.');
			$scope.salvando = false;

		});

	}

	$scope.verificar_renda = function()
	{
		//se valor é o mesmo do ultimo item, exibe mensagem, senão, esconde mensagem
		if($scope.pessoa.renda==$scope.renda_max)
			$('select[name="renda"]').next().removeClass('hidden');
		else
			$('select[name="renda"]').next().addClass('hidden');
	}

	// FILIACAO
	$scope.init_filiacao = function()
	{

		if($scope.pessoa.filiacao == undefined)
			$scope.pessoa.filiacao = [];

		while($scope.pessoa.filiacao.length < 1)
			$scope.adicionar_filiacao();

	}

	$scope.get_filiacao = function(obj)
	{
		if(obj)
			return $scope.tipo_filiacao[obj.tipo];
		else
			return $scope.tipo_filiacao[$scope.filtro.filiacao[0].tipo];
	}

	$scope.set_filiacao = function(val, obj)
	{
		if(obj)
			obj.tipo = val;
		else
			$scope.filtro.filiacao[0].tipo = val;
	}

	$scope.adicionar_filiacao = function()
	{
		$scope.pessoa.filiacao.push({id:null, nome: null, tipo: 0});
	}

	$scope.remover_filiacao = function(index)
	{
		$http.post('/assistido/filiacao/excluir/', $scope.pessoa.filiacao[index]).success(function(data){
			$scope.pessoa.filiacao.splice(index, 1);
		});
	}

	// TELEFONE
	$scope.init_telefone = function()
	{

		if($scope.pessoa.telefones == undefined)
			$scope.pessoa.telefones = [];

		while($scope.pessoa.telefones.length < 1)
			$scope.adicionar_telefone();

		$scope.processar_telefone($scope.pessoa.telefones); // telefone < ddd, numero

	}

	$scope.get_tipo_telefone = function(obj)
	{
		return $scope.tipo_telefone[obj.tipo];
	}

	$scope.set_tipo_telefone = function(val, obj)
	{
		obj.tipo = val;
	}

	$scope.adicionar_telefone = function()
	{
		$scope.pessoa.telefones.push({id: null, ddd: null, numero: null, telefone: null, tipo: 0});
	}

	$scope.remover_telefone = function(index)
	{
		$http.post('/assistido/telefone/excluir/', $scope.pessoa.telefones[index]).success(function(data){
			$scope.pessoa.telefones.splice(index, 1);
		});
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

	// CONTROLES
	$scope.avancar = function()
	{
		tabMove(1);
	}

	$scope.voltar = function()
	{
		tabMove(-1);
	}

	$scope.avaliar = function()
	{
		if(!$scope.carregando)
		{
			$http.post('/assistido/avaliar/', $scope.pessoa).success(function(data){
				if(data.success)
					$scope.avaliacao = data;
				else
					$scope.avaliacao = {};
			});
		}
	}

	//Move para proxima tab (i=1) ou para a tab anterior (i=-1)
	function tabMove(i)
	{
		if(!validTab())
			return false;

		var index = tabIndex + i;

		if(index >=0 && index < tabs.length)
			tabs.eq(index).tab('show');

	};

	function input_to_array(filter)
	{
		return objects_to_array('input[name="'+filter+'"]');
	}

	function select_to_array(filter)
	{
		return objects_to_array('select[name="'+filter+'"] option');
	}

	function objects_to_array(filter)
	{
		arr = [];
		$(filter).each(function(i){
			arr[$(this).val()]=$(this).text();
		});
		return arr;
	}

	function array_to_list(array, field)
	{
		var arr = [];
		for(var i = 0; i < array.length; i++)
			arr.push(array[i][field]);
		return arr;
	}

	$scope.init = function(tab, initial)
	{

		$scope.initial = initial;
		$scope.carregando = true;
		$scope.pessoa = {'bens' : {}, 'estrutura' : {}};
		$scope.init_filiacao();
		$scope.init_telefone();
		$scope.init_municipios();
		$scope.bairros = [];

		$http.get('/assistido/json/get/').success(function(data){

			$scope.set_initial_values(data, initial);
			$scope.pessoa = data;

			$scope.init_filiacao();
			$scope.init_telefone();

			$scope.listar_bens();
			$scope.listar_estrutura_moradia();
			$scope.carregando = false;

			$scope.avaliar();

			//Recupera nome default caso não possuir
			if($scope.pessoa.nome==null)
				$scope.pessoa.nome = $('#id_nome').val();

			$scope.salvo = ($scope.pessoa.id && tab==6);


		});

	}

	$scope.set_initial_values = function(obj, values)
	{
		for(var key in values)
		{
			if(!(key in obj))
			{
				obj[key] = values[key];
			}
		}
	}

}


function clone(obj)
{

    if(obj===null || typeof obj !== 'object')
        return obj;

    var temp = obj.constructor();

    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;

}

function BuscarPessoaModel($scope, $http)
{

    $scope.salvo = false;
    $scope.salvando = false;

    $scope.limpar = function()
    {
        $scope.filtro = {id:null, nome:'', cpf:'', filiacao:[{id:null, nome:null, tipo:0}]};
        $scope.last_filtro = '';
    }

    $scope.buscar = function(visualizar)
    {

        if($scope.filtro.cpf ||
            ($scope.filtro.nome && $scope.filtro.nome.trim().length >= 3 && $scope.filtro.nome.trim() != $scope.last_filtro) ||
            ($scope.filtro.filiacao[0].nome && $scope.filtro.filiacao[0].nome.trim().length >= 3))
        {

            if($scope.filtro.nome)
                $scope.last_filtro = $scope.filtro.nome.trim();

        	$scope.carregando = true;
        	$scope.pessoas = [];

            $http.post('', $scope.filtro).success(function(data){
                // transforma nome em array de nomes
                if ($scope.filtro.nome)
                    var filtro_nome = removeDiacritics($scope.filtro.nome).toUpperCase().split(' ');
                else
                    var filtro_nome = [];

                // transforma nome da filiacao em array de nomes
                if ($scope.filtro.filiacao[0].nome)
                    var filtro_mae = removeDiacritics($scope.filtro.filiacao[0].nome).toUpperCase().split(' ');
                else
                    var filtro_mae = [];

                // marca palavras do filtro que contenham no nome ou filiacao
                for(var i = 0; i < data.length; i++)
                {

                    data[i].nome_mark = removeDiacritics(data[i].nome);

                    for(var j = 0; j < filtro_nome.length; j++)
                    {
                        data[i].nome_mark = data[i].nome_mark.replace(filtro_nome[j],'<mark>'+filtro_nome[j]+'</mark>');
                    }

                    for(var mae = 0; mae < data[i].filiacao.length; mae++)
                    {
                        data[i].filiacao[mae].nome_mark = removeDiacritics(data[i].filiacao[mae].nome);

                        for (var j=0; j < filtro_mae.length; j++)
                        {
                            data[i].filiacao[mae].nome_mark = data[i].filiacao[mae].nome_mark.replace(filtro_mae[j],'<mark>'+filtro_mae[j]+'</mark>');
                        }
                    }
                }

                //var filtro = $scope.filtro.nome ? $scope.filtro.nome.toUpperCase() : '';
                var result = [];

                // Atribui nota aos resultados de acordo com a proximidade com o filtro
                for(var i = 0; i < data.length; i++)
                {

                    var nome = removeDiacritics(data[i].nome).split(' ');
                   // var total = 0;

                    data[i].nota = 0;

                    for(var f = 0; f < filtro_nome.length; f++)
                    {

                        var nota = Math.pow(0.1, (f - 1));

                        for(var n = 0; n < nome.length; n++)
                        {
                            if(filtro_nome[f]==nome[n])
                            {
                                nota = Math.pow(0.1, (f + 1)) * (n + 1);
                                break;
                            }
                        }

                        data[i].nota = data[i].nota + nota;

                    }

                }

                // Ordena resultado de acordo com a nota
                data.sort(function(a,b){return a.nota-b.nota});

                // Ordena alfabeticamente resultados com a mesma nota
                var i = 0;

                while(data.length > 0)
                {
                    if(data.length == i || data[i].nota != data[0].nota)
                    {
                        result = result.concat(splice_and_sort(data, i));
                        i = 0;
                    }
                    i++;
                }

                // Atualiza dados do angular;
                $scope.pessoas = result;
                $scope.carregando = false;

//                if(result.length)
//                {
//
//                    if(($scope.filtro.cpf && $scope.filtro.cpf != '') || visualizar)
//                    {
//
//                        $scope.filtro = {
//                                        'id':result[0].id,
//                                        'nome':result[0].nome,
//                                        'data_nascimento':result[0].data_nascimento,
//                                        'filiacao':result[0].filiacao,
//                                        'cpf':result[0].cpf
//                                        };
//
//                    }
//
//                }

            });
        }

    }

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

    function splice_and_sort(arr, qtd)
    {

        var arr_sort = arr.splice(0, qtd);

        arr_sort.sort(function(a,b){
            return (a.nome < b.nome) ? -1 : (a.nome > b.nome) ? 1 : 0;
        });

        return arr_sort;
    }

    function init()
    {
        $scope.limpar();
    }

    init();

}

function PreCadastro($scope, $http)
{

	$scope.erro = true;
	$scope.pessoa = {};

	$scope.procurar = function()
	{
		$http.post('', $scope.pessoa).success(function(data){

			$scope.erro = (data.erro?true:false);

			if(!data.erro)
			{
				$scope.pessoa = data.pessoa;
				$scope.telefones = data.telefones;
				if(data.telefones)
					$scope.pessoa.telefone = data.telefones[0].ddd + data.telefones[0].numero;
			}

		});
	}
}
