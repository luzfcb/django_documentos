function EventoCtrl($scope, $http, $filter)
{

    $scope.eventos = [];
    $scope.comarcas = [];
    $scope.atuacoes = ['Substituição','Acumulação','Titular'];
    $scope.dias_semana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    $scope.evento = {'titulo':null, 'diretoria':null, 'data_ini':(new Date()), 'data_fim':(new Date())};
    $scope.carregando=null;

    $scope.popover = function(obj)
    {

        var content = '<small>Cadastro em: <b>' + $filter('date')($filter('utc')(obj.data_cad), "dd/MM/yyyy hh:mm") + '</b><br/>';
        content += 'Data Início: <b>' + $filter('date')($filter('utc')(obj.data_ini), "dd/MM/yyyy") + '</b><br/>';
        content += 'Data Término: <b>' + $filter('date')($filter('utc')(obj.data_fim), "dd/MM/yyyy") + '</b></small>';

        return {'title': obj.titulo, 'content': content};
    }

    $scope.carregar_defensor = function(obj)
    {

        if(obj==undefined)
            return $scope.listar();

        $scope.evento.defensor = obj;
        $scope.evento.defensor.atuacoes = null;

        $http.get('/defensor/'+obj.id+'/atuacoes/').success(function(data){

            obj.atuacoes = data;
            $scope.validar_datas();

            for(var i = 0; i < obj.atuacoes.length; i++)
                $scope.carregar_defensoria(obj.atuacoes[i]);

            if(obj.atuacoes.length)
            {
                $scope.evento.agenda = obj.atuacoes[0];
                $scope.evento.agenda.dia = obj.atuacoes[0].horarios[0];
            }


            $http.get('/defensor/'+obj.id+'/comarcas/'+(new Date()).getFullYear()+'/').success(function(data){

                $scope.comarcas = data;

                $http.get('/evento/defensor/'+obj.id+'/listar/').success(function(data){
                    $scope.agendas = data;
                    $scope.filtrar_eventos();
                });

            });

        });

        $http.get('/atendimento/agendamento/conflitos/defensor/'+obj.id+'/total/').success(function(data){
            $scope.conflitos = data.qtd;
        });

    }

    $scope.filtrar_eventos = function()
    {

        $scope.eventos_defensor = [];

        for(var i = 0; i < $scope.eventos.length; i++)
        {
            if($scope.eventos[i].comarca.id)
            {
                for(var j = 0; j < $scope.comarcas.length; j++)
                {
                    if($scope.eventos[i].comarca.id==$scope.comarcas[j].id)
                        $scope.eventos_defensor.push($scope.eventos[i]);
                    for(var k = 0; k < $scope.eventos[i].length; k++)
                    {
                        if($scope.eventos[i].eventos[k].comarca.id==$scope.comarcas[j].id)
                            $scope.eventos_defensor.push($scope.eventos[i]);
                    }
                }
            }
            else
            {
                if($scope.eventos[i].defensor == null || ($scope.evento.defensor && $scope.eventos[i].defensor == $scope.evento.defensor.id))
                    $scope.eventos_defensor.push($scope.eventos[i]);
            }
        }

    }

    $scope.carregar_defensoria = function(agenda)
    {

        if(agenda==undefined)
            agenda = $scope.evento.agenda;

        if(agenda.dias==undefined)
        {

            agenda.dias = [];
            agenda.horarios = [];

            for(var i = 0; i < $scope.dias_semana.length; i++)
            {
                agenda.dias.push(true);
                agenda.horarios.push({dia: $scope.dias_semana[i], horarios:[], conciliacao:[], ativo: true});
            }

        }

    }

    $scope.excluir = function(obj)
    {
        if(obj==undefined)
        {
            $http.post('/evento/excluir/', $scope.selecionado).success(function(data){
                if(data.success)
                {
                    $scope.listar();
                    $scope.carregar_defensor($scope.evento.defensor);
                    $('#modal-excluir-evento').modal('hide');
                    show_stack_success('Registro excluído com sucesso!');
                }
                else
                    show_stack_error('Ocorreu um erro ao excluir o registro!');
            });
        }
        else
            $scope.selecionado = obj;
    }

    $scope.listar = function(query, callback)
    {
        $http.get('/evento/listar/').success(function(data){
            $scope.eventos = data;
            $scope.filtrar_eventos();
        });
    }

    $scope.listar_diretorias = function(query, callback)
    {
        $http.get('/diretoria/listar/').success(function(data){
            $scope.diretorias = data;

            //$scope.diretorias = [];
            //
            //for(var i in data)
            //    $scope.diretorias.push(data[i]);

            if($scope.evento.diretoria)
            {
                for(var i = 0; i < data.length; i++)
                {
                    if(data[i].id==$scope.evento.diretoria.id)
                    {
                        $scope.evento.diretoria = data[i];
                        $scope.comarcas = data[i].comarcas;
                    }
                }
            }
        });
    }

    $scope.listar_defensores = function(defensor_id)
    {
        $scope.defensores = null;
        $http.get('/defensor/listar/').success(function(data){
            $scope.defensores = data.defensores;
            $scope.set_defensor(defensor_id);

        });
    }

    $scope.set_defensor = function(defensor_id)
    {
        for(var i = 0;  i < $scope.defensores.length; i++)
        {
            if($scope.defensores[i].id==defensor_id)
            {
                $scope.evento.defensor = $scope.defensores[i];
                $scope.carregar_defensor($scope.evento.defensor);
            }
        }
    }

    $scope.possui_comarcas_selecionadas = function()
    {
        if($scope.evento.diretoria && $scope.evento.diretoria.comarcas)
        {
            for(var i = 0; i < $scope.evento.diretoria.comarcas.length; i++)
            {
                if($scope.evento.diretoria.comarcas[i].selected)
                    return true;
            }
        }
    }

    $scope.show = function(tipo)
    {

        $scope.evento = {'titulo':null, 'diretoria':null, 'data_ini':(new Date()), 'data_fim':(new Date()), 'defensor':$scope.evento.defensor, 'tipo':tipo};

        for(var i = 0; i < $scope.diretorias.length; i++)
        {
            for(var j = 0; j < $scope.diretorias[i].comarcas.length; j++)
            {
                $scope.diretorias[i].comarcas[j].selected = null;
            }
        }

    }

    $scope.min_dias_ativos = function(index)
    {

        if($scope.evento.agenda != undefined && $scope.evento.agenda.dias != undefined)
        {

            var qtd = 0;
            var dias = $scope.evento.agenda.dias;

            for(var i = 0; i < dias.length; i++)
                if(dias[i]) qtd++;

            return (qtd==1 && dias[index]);

        }

    }

    $scope.salvar = function()
    {
        if($scope.evento.tipo || $scope.validar())
        {
            $http.post('/evento/salvar/',$scope.evento).success(function(data){
                if(data.success)
                {
                    $('#modal-cadastrar-evento').modal('hide');
                    $scope.listar();
                }
            });
        }
    }

    $scope.salvar_agenda = function()
    {
        $http.post('/evento/agenda/salvar/',$scope.evento).success(function(data){
            if(data.success)
            {
                window.location.href = "/evento/?defensor=" + $scope.evento.defensor.id;
            }
        });
    }

    $scope.ver_agenda = function(obj)
    {
        $scope.selecionado = obj;
    }

    $scope.chart_margin = function(val,index)
    {

        var ini = new Date(val.data_ini);
        var fim = new Date(val.data_fim);

        if(index==undefined)
            index = 0;

        return({'left':(ini.getDayOnYear()*20)+'px','width':((fim.getDayOnYear()-ini.getDayOnYear()+1)*20)+'px', 'top':((index*25)+50)+'px'});

    }

    function day_in_year(val)
    {
        var start = new Date(val.getFullYear(), 0, 0);
    }

    $scope.validar = function()
    {
        if($scope.evento && $scope.evento.defensor && $scope.evento.defensor.atuacoes)
        {
            var conflitos_data = $filter('filter')($scope.evento.defensor.atuacoes, {agendamento:true, errors:0, hora_fim:null});
            var conflitos_hora = $filter('filter')($scope.evento.defensor.atuacoes, {conflito:true});
            return (conflitos_data && conflitos_data.length==0 && conflitos_hora && conflitos_hora.length==0);
        }
    }

    $scope.validar_datas = function()
    {

        var errors = false;
        var evento = $scope.evento;
        var atuacoes = $scope.evento.defensor.atuacoes;

        for(var i = 0; i < atuacoes.length; i++)
        {

            $scope.recalcular(atuacoes[i]);

            if(
                (new Date(atuacoes[i].data_ini) > evento.data_ini && new Date(atuacoes[i].data_ini) <= evento.data_fim) ||
                (new Date(atuacoes[i].data_fim) < evento.data_fim && new Date(atuacoes[i].data_fim) >= evento.data_ini))
            {
                errors = true;
                atuacoes[i].errors = 2;
            }
            else if(new Date(atuacoes[i].data_ini) > evento.data_fim || (atuacoes[i].data_fim && new Date(atuacoes[i].data_fim) < evento.data_ini))
                atuacoes[i].errors = 1;
            else
                atuacoes[i].errors = 0;
        }

        if(errors)
            console.log('Erro: Uma atuação começa ou termina durante o evento!');;

        $scope.conflitos = errors;

    }

    $scope.validar_horarios = function()
    {

        // Continua se defensor selecionado e possui atuacoes
        if($scope.evento.defensor && $scope.evento.defensor.atuacoes)
        {

            // Cria atalho para as agendas
            var agendas = $scope.evento.defensor.atuacoes;

            // Passa por todas agendas
            for(var i = 0; i < agendas.length; i++)
            {

                // Reinicia registro de conflitos
                agendas[i].conflitos = [];

                // Transforma string hora inicio/termino em data
                var ini_1 = time_to_date(agendas[i].hora_ini);
                var fim_1 = time_to_date(agendas[i].hora_fim);

                // Passa pelas proximas agendas
                for(var j = i + 1; j < agendas.length; j++)
                {
                    // Continua se existem dias marcados marcados nas duas agendas
                    if(agendas[i].dias && agendas[j].dias && agendas[i].defensoria.nucleo == null && agendas[j].defensoria.nucleo == null)
                    {
                        // Transforma string hora inicio/termino em data
                        var ini_2 = time_to_date(agendas[j].hora_ini);
                        var fim_2 = time_to_date(agendas[j].hora_fim);
                        // Passa por todos dias da semana
                        for(var k = 0; k < agendas[i].dias.length; k++)
                        {
                            // Conflito se: mesmo dia marcado nas duas agendas e intervalo de inicio/termino coincidem
                            if(agendas[i].dias[k] && agendas[j].dias[k] && ((ini_1 >= ini_2 && ini_1 < fim_2) || (fim_1 <= fim_2 && fim_1 > ini_2)))
                                agendas[i].conflitos.push({'dia': k, 'hora_ini':agendas[j].hora_ini, 'hora_fim':agendas[j].hora_ini, 'defensoria': agendas[j].defensoria.nome});
                        }

                    }
                }

                // Ativa conflito se houve mais de um adicionado
                agendas[i].conflito = (agendas[i].conflitos.length > 0);

            }

        }

    }

    $scope.recalcular = function(agenda)
    {

        if(agenda==undefined)
            agenda = $scope.evento.agenda;

        agenda.hora_fim = null;
        agenda.horarios = [];

        if(agenda && agenda.hora_ini && agenda.vagas && agenda.duracao)
        {

            var ini = time_to_date(agenda.hora_ini);
            var fim = new Date(ini.getTime() + parseInt(agenda.duracao) * parseInt(agenda.vagas) * 60000);

            agenda.hora_fim = $filter('date')(fim, "HH:mm");

            for(var i = 0; i < agenda.dias.length; i++)
            {

                var horarios = [];

                if(agenda.dias[i])
                {
                    for(var j = 0; j < agenda.vagas; j++)
                    {
                        var horario = new Date(ini.getTime() + parseInt(agenda.duracao) * j * 60000);
                        horarios.push($filter('date')(horario, "HH:mm"));
                    }
                }

                agenda.horarios.push({dia: $scope.dias_semana[i], horarios:horarios, conciliacao:[], ativo: agenda.dias[i]});

            }

            agenda.dia = agenda.horarios[0];

        }

        $scope.validar_horarios();

    }

    function time_to_date(str)
    {
        if(str) return new Date(2000, 0, 1, str.substring(0, 2), str.substring(3, 5));
    }

    $scope.adicionar_horario = function(array, value)
    {
        if (value){
            for(var i in array)
            {
                if(array[i]==value)
                {
                    return false;
                };
            }

            array.push(value);
            array.sort();
        }
    }

    $scope.remover_horario = function(array, index)
    {
        array.splice(index, 1);
    }

    $scope.mudar_dia = function(d)
    {
        $scope.dia = d;
    }

    $scope.init = function(defensor_id)
    {

        $scope.listar();
        $scope.listar_diretorias();
        $scope.listar_defensores(defensor_id);

        $scope.meses = [];
        $scope.colunas = [];

        var ano = new Date().getFullYear();
        var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        for(var mes = 1; mes <= meses.length; mes++)
        {
            var dias_mes = new Date(ano, mes, 0).getDate();
            $scope.meses.push({'nome':meses[mes-1],'dias':dias_mes});

            for(var dia = 1; dia <= dias_mes; dia++)
            {
                $scope.colunas.push(new Date(ano, mes-1, dia));
            }
        }

    }

}
