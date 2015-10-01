$(document).ready(
    function(){
        $('#redactor').redactor({
            focus: true,
            buttonsAdd: ['|', 'box'],
            buttonsCustom: {
                box: {
                    title: 'Adicionar Caixa',
                    callback: function(button, buttonDOM, buttonObject) {
                        selected = button.getSelectedHtml();
                        html = "<span class='box'>"+selected+"</span>"
                        button.execCommand('inserthtml', html);
                    }
                }
            }
        });
    }
);