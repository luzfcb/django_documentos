function Chronus() {}

Chronus.base_url = "http://chronus.defensoria.to.gov.br/";
Chronus.base_scope = null;

Chronus.generate = function($scope, user, name, resource, params, format) {

    Chronus.base_scope = $scope;

    for(var param in params)
    {
        if(params[param]==null || params[param]=='')
            delete params[param];
    }

    if(format==undefined)
        format = 'pdf';

    $.ajax({
        url: Chronus.base_url + 'reports.json',
        data: {
            'report': {
                "app": 'solar',
                "user": user,
                "name": name,
                "resource": resource,
                "format": format,
                "params": JSON.stringify(params)
            }
        },
        type: 'POST',
        crossDomain: true,
        dataType: 'json',
        success: function (data) {
            Chronus.getReport(data)
        },
        error: function (xhr) {
            fail('Erro ao conectar com servidor')
        }
    });

}

Chronus.getReport = function(data) {

    var id = data['id'];
    var report_uri = Chronus.base_url + "reports/" + id + ".json";

    var listenReport = function () {

        $.getJSON(report_uri, {})
            .done(function (rData) {
                switch (rData['status']) {
                    case 'done':
                        Chronus.success(rData['file']);
                        clearInterval(intervalReport);
                        break;
                    case 'pending':
                        Chronus.pending();
                        break;
                    case 'failed':
                        Chronus.fail(rData['reason']);
                        clearInterval(intervalReport);
                        break;
                    default:
                        Chronus.base_scope.relatorio.status = null;
                        clearInterval(intervalReport);
                }
            });
    };

    listenReport();
    intervalReport = setInterval(listenReport, 1000);

}

Chronus.pending = function()
{
    Chronus.base_scope.relatorio.status = {pending: true};
    Chronus.base_scope.$apply();
    console.log("pending...");
}

Chronus.success = function(report) {
    Chronus.base_scope.relatorio.status = {success: true, report: report};
    Chronus.base_scope.$apply();
};

Chronus.fail = function(reason) {
    Chronus.base_scope.relatorio.status = {fail: true, reason: reason};
    Chronus.base_scope.$apply();
}
