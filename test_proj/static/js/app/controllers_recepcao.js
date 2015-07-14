function RecepcaoMarcadosCtrl($scope, $http, $timeout)
{

    $scope.filtro = {'query': null};
    $scope.atendimentos = null;
    $scope.guiche = null;
    $scope.atendendo_id = null;
    $scope.pnes = {'nome' : ''};
    $scope.carregando = null;

    $scope.popover = function(obj)
    {

        var content = '';
        for(var i = 0; i < obj.telefones.length; i++)
            content += '(' + obj.telefones[i].ddd + ') ' + obj.telefones[i].numero + '<br/>';

        return {"title": obj.requerente, "content": content};
    }

    $scope.alterar_guiche = function() {
        $http.post('/atendimento/recepcao/alterar/guiche/').success(function(data){
            window.location = '/atendimento/recepcao/';
        });
    }

    $scope.excluir = function(atendimento)
    {
        $scope.atendimento = atendimento;
        $('#modal-excluir').modal();
    }

    $scope.realizar_pre_atendimento = function(atendimento_numero) {
        window.location = '/atendimento/recepcao/marcados/' + atendimento_numero;
    }

    $scope.espera = function(atendimento) {
        if(atendimento.atrasado == false && atendimento.historico_recepcao == 0 && atendimento.historico_atendimento == 0) {
            return atendimento;
        }
    }

    $scope.atrasados = function(atendimento) {
        if (atendimento.atrasado == true && atendimento.historico_recepcao == 0 && atendimento.historico_atendimento == 0) {
            return atendimento;
        }
    }

    $scope.atendidos_recepcao = function(atendimento) {
        if(atendimento.historico_recepcao == 1 && atendimento.historico_atendimento == 0) {
            return atendimento;
        }
    }

    $scope.atendidos_defensor = function(atendimento) {
        if(atendimento.historico_atendimento == 1) {
            return atendimento;
        }
    }

    $scope.informacoes = function(atendimento)
    {
        $http.get('/atendimento/'+atendimento.numero+'/json/get/').success(function(data){
            $scope.atendimento = data;
            $('#modal-informacoes').modal();
        });

    }

    function init()
    {
        $scope.guiche = guiche;
        $scope.carregando = true;
        $http.get('get/').success(function(data){
            $scope.atendimentos = data;
            $scope.carregando = false;
        });
    }

    init();

}

function RecepcaoAtendimentoCtrl($scope, $http)
{

    $scope.atendimento = null;
    $scope.predicate = '-responsavel'
    $scope.form_buscar_requerido = false;
    $scope.form_buscar_requerente = false;
    $scope.filtro = {'query': null, 'request': 0, 'atendimento_id': null};
    $scope.last_filtro = '';
    $scope.resultado_busca = null;
    $scope.tipo_edicao = null;
    $scope.editar_cadastrado = null;
    $scope.pessoa_visualizacao = null;
    $scope.requerente_responsavel = null;
    $scope.documento_edicao = null;
    $scope.carregando = null;

    $scope.show_buscar = function(tipo)
    {
        $scope.resultado_busca = null;
        $scope.filtro.query = null;

        if(tipo=='requerido') {
            $scope.form_buscar_requerido = !$scope.form_buscar_requerido;
            $scope.form_buscar_requerente = false;
        } else {
            $scope.form_buscar_requerente = !$scope.form_buscar_requerente;
            $scope.form_buscar_requerido = false;
        }
    }

    $scope.buscar = function(visualizar)
    {
        //Continua se informar CPF OU nome OU filiacao maiores que 3 characteres
        if($scope.filtro.query && $scope.filtro.query.trim().length >= 3 && $scope.filtro.query.trim() != $scope.last_filtro)
        {

            $scope.carregando = true;
            $scope.resultado_busca = null;
            $scope.filtro.request += 1;

            if($scope.filtro.query)
                $scope.last_filtro = $scope.filtro.query.trim();

            $http.post('/atendimento/recepcao/buscar_pessoa/', $scope.filtro).success(function(data){

                if (data.request == $scope.filtro.request)
                {

                    data = data.pessoas;

                    // transforma nome em array de nomes
                    if ($scope.filtro.query)
                        var filtro_nome = removeDiacritics($scope.filtro.query).toUpperCase().split(' ');
                    else
                        var filtro_nome = [];

                    // marca palavras do filtro que contenham no nome ou filiacao
                    for(var i = 0; i < data.length; i++)
                    {

                        data[i].nome_mark = removeDiacritics(data[i].nome);

                        for(var j = 0; j < filtro_nome.length; j++)
                        {
                            data[i].nome_mark = data[i].nome_mark.replace(filtro_nome[j],'<mark>'+filtro_nome[j]+'</mark>');
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
                    $scope.resultado_busca = result;

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

                }
                else
                {
                    console.log('Request ' + data.request + ' ignorado! Registros: ' + data.pessoas.length)
                }

            $scope.carregando = false;

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

    $scope.buscar_pessoa = function(tipo)
    {
        if($scope.filtro.query.length > 3) {
            $http.post('/atendimento/recepcao/buscar_pessoa/', $scope.filtro).success(function(data){
                $scope.resultado_busca = data;
            });
        }
    }

    $scope.visualizar_pessoa = function(assistido, tipo, index, editar_cadastrado)
    {
        $scope.pessoa_visualizacao = assistido;
        $scope.tipo_edicao = tipo;
        $scope.pessoa_visualizacao.index = index;
        $scope.editar_cadastrado = editar_cadastrado;
        $('#modal-visualizar-pessoa').modal();
    }

    $scope.gerar_declaracao_pessoa = function(assistido, tipo, index, editar_cadastrado)
    {
        $scope.pessoa_visualizacao = assistido;
        $scope.tipo_edicao = tipo;
        $scope.pessoa_visualizacao.index = index;
        $scope.editar_cadastrado = editar_cadastrado;
        $('#modal-declaracao-pessoa').modal();
    }

    $scope.remover_pessoa = function(assistido, tipo, index, editar_cadastrado)
    {

        if(assistido==undefined)
            assistido = $scope.pessoa_visualizacao;

        $http.post('/atendimento/recepcao/remover_pessoa/', {'pessoa_id': assistido.id, 'atendimento_id': $scope.atendimento.atendimento.id}).success(function(data){
            $('#modal-visualizar-pessoa').modal('hide');
            init();
            show_stack_success("Pessoa removida do atendimento.");
        });
    }

    $scope.alterar_responsavel = function(assistido, tipo, index, editar_cadastrado)
    {

        if(assistido==undefined)
            assistido = $scope.pessoa_visualizacao;

        $http.post('/atendimento/recepcao/alterar_responsavel/', {'pessoa_id': assistido.id, 'atendimento_id': $scope.atendimento.atendimento.id, 'tipo': assistido.tipo}).success(function(data){
            $('#modal-visualizar-pessoa').modal('hide');
            init();
            show_stack_success((assistido.tipo == 0 ? 'Requerente ' : 'Requerido ') + "responsável alterado.");
        });

    }

    $scope.editar = function(assistido, tipo, index, editar_cadastrado)
    {

        if(assistido==undefined)
            assistido = $scope.pessoa_visualizacao;

        if(tipo==undefined)
            tipo = $scope.tipo_edicao;

        var min = (tipo == 1 ? 1 : 0);

        if(editar_cadastrado==undefined)
            editar_cadastrado = $scope.editar_cadastrado;

        if(editar_cadastrado == 1)
            var url = '/assistido/editar/';
        else
            var url = '/assistido/cadastrar/';

        window.location = '/assistido/editar/' + assistido.id + '?tipo=' + tipo + '&min=' + min + '&next=/atendimento/recepcao/marcados/' + $scope.atendimento.atendimento.numero + '/tipo/' + tipo + '/responsavel/' + assistido.responsavel + '/cadastrado/' + editar_cadastrado + '/pessoa/';

    }

    $scope.editar_documento = function(documento){
        $scope.documento_edicao = documento;
    }

    $scope.cancelar_update_documento = function() {
        $scope.documento_edicao = null;
    }

    $scope.gerar = function()
    {
        $scope.relatorio.params.id_pessoa = $scope.pessoa_visualizacao.id;
        Chronus.generate($scope, $scope.relatorio.user, 'declaracao', 'atendimento/atendimento/declaracao', $scope.relatorio.params)
    }

    function init()
    {
        $http.post('#').success(function(data){
            $scope.atendimento = data;
            $scope.filtro.atendimento_id = data.atendimento.id;
            $(data.pessoas).each(function(i, o){
                if(o.responsavel && o.tipo == 0) {
                    $scope.requerente_responsavel = o;
                }
            })
        });
    }

    init();
}

function RecepcaoPublicoCtrl($scope, $http, $socket, $timeout)
{

    $scope.atendimento = null;

    $socket.on('proximo', function (data) {
        $scope.atendimento = data;
        document.getElementById('beep').play();
    });

    function init()
    {
        $socket.emit('setcomarca', {comarca_id: comarca_id});
        $http.post('/comarca/guiches/', {comarca_id: comarca_id}).success(function(data){
            $scope.atendimentos = data;
            $socket.emit('get_atendendo', {comarca_id: comarca_id});
        });
    }

    init();

}
