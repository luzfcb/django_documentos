function CadastrarAudienciaCtrl($scope, $http, $filter)
{
    $scope.fases = [];
    $scope.defensores = [];

    $scope.novo = function()
    {
        $scope.audiencia = {processo:null, audiencia_realizada:false};
    }

    $scope.buscar_processo = function()
    {

        $scope.processo_error = null;

        if($scope.audiencia.processo)
        {
            processo_numero = $scope.audiencia.processo.match(/\d+/g).join('');
            $http.get('/processo/' + processo_numero + '/get/json/').success(function(data){
                $scope.processo_error = data.error;
                if (data.error)
                    $scope.processo = null;
                else
                    $scope.processo = data.processo;
            });
        }

    }

    $scope.limpar_processo = function()
    {

        $scope.processo = null;
        $scope.audiencia.processo = null;
        $scope.processo_error = null;

    }

    $scope.carregar_substitutos = function()
    {
        $scope.substitutos = [];
        $scope.audiencia.substituto = null;

        $http.get('/defensor/' + $scope.audiencia.defensor.id + '/substitutos/').success(function(data){
            $scope.substitutos = data;
            $scope.audiencia.substituto = data[0];
        });
    }

    $scope.set_data_protocolo = function()
    {
        $scope.audiencia.data_hora_protocolo = $filter('date')($filter('utc')($scope.audiencia.data), "dd/MM/yyyy") + ' ' + $scope.audiencia.hora;
    }

    $scope.init = function()
    {

        $http.get('/defensor/listar/').success(function(data){
            $scope.defensores = data.defensores;
        });

        $http.get('/processo/fase/tipo/listar/').success(function(data){
            $scope.fases = data;
        });

        $scope.novo();

    }

    $scope.init();

}

function AudienciaCtrl($scope, $http, $filter)
{

    $scope.processo = null;
    $scope.processo_atual = null;
    $scope.tipos = [];
    $scope.defensores = [];
    $scope.acoes = [];
    $scope.areas = [];
    $scope.comarcas = [];
    $scope.varas = [];
    $scope.lista_tipo = [{id:1,nome:'Físico'},{id:2,nome:'Eletrônico (e-Proc)'}];
    $scope.busca = {};

    $scope.novo = function()
    {

        if(!$scope.defensores.length)
        {
            $http.get('/defensor/listar/').success(function(data){
                $scope.defensores = data.defensores;
            });
        }

        if(!$scope.tipos.length)
        {
            $http.get('/processo/fase/tipo/listar/').success(function(data){
                $scope.tipos = data;
            });
        }

        $scope.audiencia = {processo:null, audiencia_realizada:false};
        $scope.parte = {parte: {tipo: 0}};
        $('#tabFase a:first').tab('show');

    }

    $scope.carregar = function(fase)
    {
        // Aplica objeto tipo a fase selecionada
        for(var i = 0; i < $scope.tipos.length; i ++)
        {
            if($scope.tipos[i].id==fase.tipo.id)
                fase.tipo = $scope.tipos[i];
        }

        // Aplica objeto defensor a fase selecionada
        if(fase.defensor_cadastro!=null)
        {
            for(var i = 0; i < $scope.defensores.length; i ++)
            {
                if($scope.defensores[i].id==fase.defensor_cadastro.id)
                    fase.defensor = $scope.defensores[i];
            }
        }

        fase.data = fase.data_protocolo;
        fase.hora = $filter('date')($filter('utc')(fase.data_protocolo), "HH:mm");

        $scope.audiencia = fase;
        $scope.set_data_protocolo();

        $('#tabFase a:first').tab('show');

    }

    $scope.buscar = function(auto)
    {

        $scope.limpar_busca();

        if($scope.busca.numero)
            processo_numero = $scope.busca.numero.match(/\d+/g);
        else
            processo_numero = null;

        if(processo_numero)
        {

            processo_numero = processo_numero.join('');

            if(processo_numero.length != 20 && auto)
                return;

            $scope.carregando = true;

            $http.get('/processo/' + processo_numero + '/get/json/').success(function(data){

                if(data.processo && data.processo.partes.length)
                    data.processo.editavel = false;

                $scope.processo = (data.processo == null ? {} : data.processo);
                $scope.busca.processo = data.processo;
                $scope.busca.existe = !data.error;
                $scope.busca.eproc = data.eproc;
                $scope.carregando = false;

                if($scope.processo.tipo==undefined)
                    $scope.processo.tipo = $scope.lista_tipo[(data.eproc==null ? 0 : 1)];

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

    $scope.editar_processo = function(processo, parte)
    {
        $scope.load_data();
        $scope.processo = processo_atual;
        $scope.parte = processo_atual.parte;
    }

    // Recupera informacoes do processo e fases processuais
    $scope.carregar_processo = function(processo_numero, atendimento_numero, fase_id)
    {

        $scope.carregando_processo = true;

        if(processo_numero && atendimento_numero)
        {

            $scope.processo_atual = null;

            // Recupera informacoes do processo
            $http.get('/processo/' + processo_numero + '/get/json/').success(function(data){

                $scope.processo_error = data.error;

                if(data.error)
                {
                    $scope.carregando_processo = false;
                }
                else
                {

                    processo_atual = data.processo;

                    //Procura parte vinculada ao atendimento
                    for(var i = 0; i < data.processo.partes.length; i++)
                    {
                        if(data.processo.partes[i].atendimento==atendimento_numero || data.processo.partes[i].atendimento_inicial==atendimento_numero)
                            processo_atual.parte = data.processo.partes[i];
                    }

                    if(processo_atual.parte)
                        processo_atual.editavel = (processo_atual.parte.id==data.processo.partes[0].id);

                    $scope.fase = fase_id;
                    $scope.fases = null;

                    // Recupera informacoes das fases processuais
                    $http.get('/processo/' + processo_atual.numero_puro + '/fase/listar/').success(function(data){

                        $scope.fases = data;

                        for(var i = 0; i < data.length; i++)
                        {
                            if($scope.fases[i].id==$scope.fase)
                            {
                                $scope.carregar($scope.fases[i]);
                                $('#modal-dados-fase').modal();
                                $('#tabFase a:last').tab('show');
                            }
                        }

                        $scope.carregando_processo = false;

                    });

                    $scope.processo_atual = processo_atual;

                }

            });

        }

    }

    $scope.carregar_eproc = function(processo)
    {

        $scope.processo_atual = processo

        if(processo.numero.length)
        {

            $scope.eproc = null;
            $scope.carregando = true;

            $http.get('/processo/' + processo.numero_puro + '/eproc/get/json/').success(function(data){
                $scope.eproc = data;
                $scope.carregando = false;
            });

        }

    }

    $scope.carregar_substitutos = function()
    {
        $scope.substitutos = [];
        $scope.audiencia.substituto = null;

        $http.get('/defensor/' + $scope.audiencia.defensor.id + '/substitutos/').success(function(data){
            $scope.substitutos = data;
            $scope.audiencia.substituto = data[0];
        });
    }

    $scope.set_data_protocolo = function()
    {
        $scope.audiencia.data_hora_protocolo = $filter('date')($filter('utc')($scope.audiencia.data), "dd/MM/yyyy") + ' ' + $scope.audiencia.hora;
    }

    $scope.carregar_defensores = function(query, callback)
    {
        $http.get('/defensor/listar/').success(function(data){
            callback($filter('filter')(data, query));
        });
    }

    $scope.carregar_defensorias = function(defensor_id)
    {

        $scope.defensorias = [];

        if(defensor_id!=undefined)
        {
            $http.get('/defensor/'+defensor_id+'/atuacoes/').success(function(data){
                for(var i = 0; i < data.length; i++)
                    $scope.defensorias.push(data[i].defensoria);
            });
        }

    }

    $scope.limpar_busca = function(forcar)
    {

        $scope.load_data();

        if($scope.busca.numero==undefined || forcar==true)
            $scope.busca.numero = null;

        $scope.busca = {numero: $scope.busca.numero};

    }

    $scope.load_data = function()
    {

        if(!$scope.defensores.length)
        {
            $http.get('/defensor/listar/').success(function(data){
                $scope.defensores = data.defensores;
            });
        }

        if(!$scope.acoes.length)
        {
            $http.get('/processo/acao/listar/').success(function(data){
                $scope.acoes = data;
            });
        }

        if(!$scope.areas.length)
        {
            $http.get('/area/listar/').success(function(data){
                $scope.areas = data;
            });
        }

        if(!$scope.comarcas.length)
        {
            $http.get('/comarca/listar/').success(function(data){
                $scope.comarcas = data;
            });
        }

        if(!$scope.varas.length)
        {
            $http.get('/vara/listar/').success(function(data){
                $scope.varas = data;
            });
        }

    }

    $scope.init = function(processo_sem_atendimento)
    {

        $http.get('atender/processos/get/').success(function(data){
            $scope.processos = data;
        });

    }

}
