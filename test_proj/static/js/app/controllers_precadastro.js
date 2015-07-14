function BuscarPessoaModel($scope, $http)
{

    $scope.salvo = false;
    $scope.salvando = false;
    $scope.tipo_filiacao = ['Mãe', 'Pai'];
    $scope.tipo_telefone = ['Celular', 'Residencial', 'Comercial', 'Recado'];

    $scope.limpar = function()
    {
        $scope.pessoa = {id:null, nome:null, data_nascimento:null, cpf:'', estado: 17, ganho_mensal:0, numero_membros:0, ganho_mensal_membros:0, valor_imoveis:0, valor_moveis:0, valor_investimentos: 0};
        $scope.filtro = {id:null, nome:null, data_nascimento:null, cpf:'', filiacao:[{id:null, nome:null, tipo:0}], deficiencias:{}, ganho_mensal:0, numero_membros:0, ganho_mensal_membros:0, valor_imoveis:0, valor_moveis:0, valor_investimentos: 0};
        $scope.last_filtro = '';
        $scope.init_filiacao();
        $scope.init_telefone();
    }

    $scope.modificou = function()
    {
        $scope.salvo = false;
    }

    $scope.buscar = function(visualizar)
    {

        //Continua se informar CPF OU nome OU filiacao maiores que 3 characteres
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

                var filtro = $scope.filtro.nome ? $scope.filtro.nome.toUpperCase() : '';
                var result = [];

                // Atribui nota aos resultados de acordo com a proximidade com o filtro
                for(var i = 0; i < data.length; i++)
                {

                    var nome = removeDiacritics(data[i].nome).split(' ');
                    var total = 0;

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

                if(result.length)
                {

                    if(($scope.filtro.cpf && $scope.filtro.cpf != '') || visualizar)
                    {

                        $scope.filtro = {
                                        'id':result[0].id,
                                        'nome':result[0].nome,
                                        'data_nascimento':result[0].data_nascimento,
                                        'filiacao':result[0].filiacao,
                                        'cpf':result[0].cpf
                                        };

                    }

                }

            });
        }

    }

    $scope.cadastrar = function(estado_id, comarca_id)
    {

        if($('#PesquisaForm').valid())
        {

            $scope.pessoa = $scope.filtro;
            $scope.pessoa.estado = estado_id;
            $scope.pessoa.municipio = comarca_id;
            $scope.init_filiacao();
            $scope.init_telefone(true);

            $('#myTab a:last').tab('show');

        }

    }

    $scope.confirmar = function(obj)
    {

        $scope.salvando = true;
        $scope.pessoa = obj;

        $scope.init_filiacao();
        $scope.init_telefone();

        $http.post('/atendimento/129/pessoa/set/'+$scope.pessoa.id+'/').success(function(data){


            $scope.pessoa = data.pessoa;
            $scope.processar_telefone($scope.pessoa.telefones); // telefone > ddd, numero
            $scope.listar_municipios();

            $scope.salvando = false;

            $('#myTab a:last').tab('show');

            if($scope.salvo)
                $('#btn-modal-atendimento').click();

        });

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
    $scope.init_telefone = function(limpar)
    {

        if($scope.pessoa.telefones == undefined || limpar)
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
        if(telefones)
        {
            for(var i = 0; i < telefones.length; i++)
            {
                if(telefones[i].telefone)
                {
                    telefones[i].ddd = telefones[i].telefone.substring(0,2);
                    telefones[i].numero = telefones[i].telefone.substring(2);
                }
                else
                {
                    telefones[i].telefone = telefones[i].ddd + telefones[i].numero;
                }
            }
        }
    }

    $scope.salvar = function()
    {

        if($('#CadastroForm').valid())
        {

            $scope.salvando = true;
            $scope.processar_telefone($scope.pessoa.telefones); // telefone > ddd, numero

            show_stack('Salvando...', false);

            $http.post($('#CadastroForm').attr('action'), $scope.pessoa).success(function(data){

                $scope.salvo = data.success;

                if(data.success)
                {
                    $scope.confirmar(data.pessoa);
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
        else
        {
            $('.alert-error').removeClass('hidden'); //mostra mensagem de erro
        }

    }

    $scope.carregar = function()
    {
        $http.get('/atendimento/129/pessoa/get/').success(function(data){
            if(data.id)
            {

                $scope.pessoa = data;
                $scope.init_filiacao();
                $scope.init_telefone();

                if(data.municipio)
                    $scope.salvo = true;

            }
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

    $scope.listar_municipios = function()
    {

        $http.get('/estado/'+$scope.pessoa.estado+'/municipios/').success(function(data){
            $scope.municipios = data;
        });

    }

    $scope.buscar_key = function(e)
    {
        // Busca automatico se enter (13) ou espaco (32)
        if(e.which==13)
        {
            $scope.buscar();
            // Cancela evento padrao do enter (limpar form)
            e.preventDefault();
        }
    }

    $scope.gerar_declaracao_pessoa = function()
    {
        $('#modal-declaracao-pessoa').modal();
    }

    $scope.gerar = function()
    {
        $scope.relatorio.params.id_pessoa = $scope.pessoa.id;
        Chronus.generate($scope, $scope.relatorio.user, 'declaracao', 'atendimento/atendimento/declaracao', $scope.relatorio.params)
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
        $scope.carregar();
        $scope.init_municipios();
    }

    init();

}
