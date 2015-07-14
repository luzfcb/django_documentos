
function AgendamentoCtrl($scope, $http, $filter)
{

    $scope.diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    $scope.atuacao = null;
    $scope.remarcando = false;

    $scope.init = function(ano, mes, comarca, defensoria, defensor)
    {

        if($scope.atuacao!=undefined && $scope.atuacao.nucleo)
            $scope.conciliacao = 0;

        if(comarca!=undefined)
            $scope.comarca = comarca;

        if(comarca!=undefined)
            $scope.comarca = comarca;

        if(defensoria!=undefined)
            $scope.defensoria = defensoria;

        if(defensor!=undefined)
            $scope.defensor = defensor;

        if(ano!=undefined && mes!=undefined)
        {
            $scope.carregarMes(ano, mes-1);
        }
        else
        {
            var dia = new Date();
            $scope.carregarMes(dia.getFullYear(), dia.getMonth());
        }

    }

    $scope.getMesStr = function()
    {
        var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return meses[$scope.mes] + ' - ' + $scope.ano;
    }

    $scope.prevMes = function()
    {
        if($scope.mes==0)
            $scope.carregarMes($scope.ano - 1, 11);
        else
            $scope.carregarMes($scope.ano, $scope.mes - 1);
    }

    $scope.nextMes = function()
    {
        if($scope.mes==11)
            $scope.carregarMes($scope.ano + 1, 0);
        else
            $scope.carregarMes($scope.ano, $scope.mes + 1);
    }

    $scope.carregarMes = function(ano, mes)
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

            semana.push({data:new Date(ano, mes, dia), horarios:null, eventos:[]});

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
        $scope.carregando = true;

        $http.post('', {
                'comarca':$scope.comarca,
                'atuacao':($scope.atuacao ? $scope.atuacao.id : null),
                'defensor':($scope.defensor ? $scope.defensor : null),
                'defensoria':($scope.defensoria ? $scope.defensoria : null),
                'ano':$scope.ano,
                'mes':$scope.mes+1,
                'conciliacao':$scope.conciliacao
            }).success(function(data){

            $scope.carregando = false;

            $scope.comarca = data.comarca;
            $scope.comarcas = data.comarcas;
            $scope.atuacoes = data.atuacoes;
            $scope.atuacao = data.atuacao;
            $scope.agendas = data.agendas;
            $scope.eventos = data.eventos;
            $scope.agendamentos = data.agendamentos;
            $scope.impedimentos = data.impedimentos;
            $scope.extra = data.extra;
            $scope.consulta = data.consulta;

            var hoje = $filter('utc')(data.hoje);
            var semanas = $scope.semanas;
            var agendas = $scope.agendas;
            var eventos = $scope.eventos;

            if($scope.atuacoes)
            {

                for(var i = 0; i < $scope.atuacoes.length; i++)
                {
                    if($scope.atuacao && $scope.atuacao == $scope.atuacoes[i].id)
                    {
                        $scope.atuacao = $scope.atuacoes[i];
                    }
                }

                if(!isNaN($scope.atuacao))
                    $scope.atuacao = null;

                if($scope.defensoria)
                    $scope.defensoria = null;

                if($scope.atuacao)
                {
                    $http.get('/atendimento/agendamento/conflitos/defensor/'+$scope.atuacao.defensor_id+'/total/'+$scope.ano+'/'+($scope.mes+1)+'/').success(function(data){
                        $scope.conflitos = data.qtd;
                    });
                }
                else
                {
                    $scope.conflitos = null;
                }

            }

            for(var k = 0; k < agendas.length; k++)
            {
                agendas[k].data_ini = $filter('utc')(agendas[k].data_ini);
                agendas[k].data_fim = $filter('utc')(agendas[k].data_fim);
            }

            for(var k = 0; k < eventos.length; k++)
            {
                eventos[k].data_ini = $filter('utc')(eventos[k].data_ini);
                eventos[k].data_fim = $filter('utc')(eventos[k].data_fim);
            }

            // Passa por todas semanas do mes
            for(var i = 0; i < semanas.length; i++)
            {
                // Passa por todos dias da semana
                for(var j = 0; j < semanas[i].length; j++)
                {
                    // Vincula dia a um evento
                    for(var k = 0; k < eventos.length; k++)
                    {
                        if(semanas[i][j].data >= eventos[k].data_ini && semanas[i][j].data <= eventos[k].data_fim)
                        {
                            if(eventos[k].defensor == null || eventos[k].defensor == $scope.atuacao.defensor_id)
                                semanas[i][j].evento = k;
                            else
                                semanas[i][j].eventos.push(k);
                        }
                    }
                    // Vincula dia a uma agenda
                    for(var k = 0; k < agendas.length; k++)
                    {
                        if(semanas[i][j].data >= agendas[k].data_ini && semanas[i][j].data <= agendas[k].data_fim)
                        {
                            $scope.carregarDia(semanas[i][j], k, hoje);
                            break;
                        }
                    }
                }
            }

            if($scope.impedimentos.length)
                $('#modal-impedimento').modal();

        });

    }

    $scope.carregarDia = function(dia, agenda, hoje)
    {

        var horarios = $scope.agendas[agenda].horarios[dia.data.getDay()-1];
        var conciliacao = $scope.agendas[agenda].conciliacao[dia.data.getDay()-1];

        var agendamentos = $scope.agendamentos[dia.data.getDate()];
        var conflitos = 0;

        if(dia.data < hoje || horarios==undefined || horarios.length==0)
            return false;

        horarios = horarios.slice();

        if(horarios[0]=="00:00")
            horarios = [];

        var total_pauta = $scope.agendas[agenda].simultaneos * horarios.length;
        var total_extra = $scope.extra[dia.data.getDate()];

        var vagas = {};
        for(var i = 0; i < horarios.length; i++)
            vagas[horarios[i]] = $scope.agendas[agenda].simultaneos;

        if(agendamentos!=undefined)
        {
            for(hora in agendamentos)
            {
                existe = false;
                if(hora != 'length')
                {
                    for(var i = 0; i < horarios.length; i++)
                    {
                        if(hora == horarios[i])
                        {
                            if(agendamentos[hora] >= $scope.agendas[agenda].simultaneos)
                                horarios.splice(i,1);
                            else
                                vagas[hora] -= agendamentos[hora];
                            existe = true;
                            break;
                        }
                    }
                    if(!existe)
                        conflitos += 1;
                }
            }
        }

        if($scope.atuacao.defensor_id != $scope.agendas[agenda].defensor)
        {

            dia.substituto = $scope.get_substituto(dia);

            for(var i = 0; i < dia.eventos.length; i++)
            {
                if($scope.eventos[dia.eventos[i]].defensor == null || $scope.eventos[dia.eventos[i]].defensor == $scope.agendas[agenda].defensor)
                    dia.evento = dia.eventos[i];
            }

        }

        if(dia.evento != undefined && total_extra)
            conflitos += total_extra;

        if(conflitos)
        {
            dia.conflitos = conflitos;
            if(!$scope.remarcando)
                horarios = [];
        }

        if(total_extra!=undefined)
            dia.total_extra = total_extra;

        dia.horarios = horarios;
        dia.total_pauta = total_pauta;
        dia.agendamentos = agendamentos;
        dia.vagas = vagas;
        dia.simultaneos = ($scope.agendas[agenda].simultaneos > 1);

    }

    $scope.visualizar = function(dia)
    {

        if(dia.horarios==undefined || dia.evento!=null || $scope.impedimentos.length || $scope.consulta)
            return false;

        $scope.dia = dia;
        $scope.horario = null;
        $scope.horario_str = null;
        $scope.atuacao.substituto = $scope.get_substituto(dia);

        $('#modal-agendar').modal();

    }

    $scope.get_substituto = function(dia)
    {
        for(var i = 0; i < $scope.atuacao.substituicoes.length; i++)
        {
            if(dia.data >= $filter('utc')($scope.atuacao.substituicoes[i].data_ini) && dia.data <= $filter('utc')($scope.atuacao.substituicoes[i].data_fim))
                return $scope.atuacao.substituicoes[i].defensor;
        }
    }

    $scope.selecionar = function(horario)
    {
        if(horario==undefined)
        {
            $scope.horario_str = null;
            $scope.horario = null;
        }
        else
        {
            $scope.horario_str = horario;
            $scope.horario = new Date($scope.ano, $scope.mes, $scope.dia.data.getDate(), parseInt(horario.substring(0,2)), parseInt(horario.substring(3,5)), 0);
        }
    }

    $scope.formatarDia = function(dia)
    {

        var agora = new Date();
        var hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

        if(dia.evento!=null)
            return 'error';
        else if(dia.horarios && dia.horarios.length && $scope.impedimentos.length == 0)
        {
            if(dia.substituto)
                return 'info';
            else
                return 'success';
        }
        else if(dia.horarios && $scope.impedimentos.length == 0)
            return 'warning';
        else
            return 'disabled';

    }

    $scope.popover = function(obj)
    {

        var title = '[[ dia.data|date:\'dd/MM/yyyy\' ]]<small class="label label-success pull-right" ng-hide="dia.substituto">T</small><small class="label label-info pull-right" ng-show="dia.substituto">S</small><br><b>[[ eventos[dia.evento].titulo ]]</b>';
        var content = '<small class="muted" ng-show="dia.substituto">[[ dia.substituto ]]</small>';
        content += '<p class="text-success">Pauta: <b>[[(dia.agendamentos.length?dia.agendamentos.length+\' agendada(s)\':\'Nenhuma\')]]</b></p>';
        content += '<p class="text-warning">Extra Pauta: <b>[[(dia.total_extra?dia.total_extra+\' agendada(s)\':\'Nenhuma\')]]</b></p>';
        content += '<p class="text-error" ng-show="dia.conflitos">Conflitos: <b>[[(dia.conflitos?dia.conflitos+\' conflitos(s)\':\'Nenhum\')]]</b></p>';

        return {"title": title, "content": content};

    }

    $scope.justificar = function()
    {

        $scope.carregando = true;
        $http.post('/atendimento/agendamento/justificar/',{'justificativa':$scope.justificativa}).success(function(data){
            $('modal-impedimento').modal('toggle');
            $scope.impedimentos = [];
            $scope.carregando = false;
        });

    }

}

function AgendamentoNucleoConfirmarCtrl($scope, $http)
{

    $scope.init = function(data)
    {
        $scope.relatorio = data;
    }

    $scope.imprimir = function()
    {
        Chronus.generate($scope, $scope.relatorio.user, 'carta_convite', 'atendimento/atendimento/conciliacao', $scope.relatorio.params);
    }

}
