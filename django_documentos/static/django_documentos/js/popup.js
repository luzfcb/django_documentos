function infraMonitorarModal() {
    if (infraJanelaModal.closed) {
        infraFecharJanelaModal();
    }
}

function infraFecharJanelaModal() {

    window.clearInterval(infraIntervaloModal);

    var div = parent.document.getElementById('divInfraModalFundo');

    if (div != null) {
        div.style.visibility = 'hidden';
    }
}

function infraAbrirJanela(url, nome, largura, altura, opcoes, modal) {

    if (opcoes === undefined) {
        opcoes = "";
    }

    if (modal === undefined) {
        modal = true;
    }

    if (largura < 100) {
        largura = 100;
    }

    if (altura < 100) {
        altura = 100;
    }

    if (opcoes != "") {
        opcoes = opcoes + ",";
    }
    opcoes = opcoes + "width=" + largura;
    opcoes = opcoes + ",height=" + altura;

    janela = window.open(url, nome, opcoes);

    try {
        if (INFRA_CHROME > 17) {
            setTimeout(function () {
                janela.moveTo(((screen.availWidth / 2) - (largura / 2)), ((screen.availHeight / 2) - (altura / 2)));
            }, 100);
        }
        else {
            janela.moveTo(((screen.availWidth / 2) - (largura / 2)), ((screen.availHeight / 2) - (altura / 2)));
        }
        janela.focus();
    } catch (e) {
        // abrindo endereco de outro servidor ocorre erro de acesso
    }

    if (modal == true && janela != null) {

        infraJanelaModal = janela;

        var div = parent.document.getElementById('divInfraModalFundo');

        if (div == null) {
            div = parent.document.createElement('div');
            div.id = 'divInfraModalFundo';
            div.className = 'infraFundoTransparente';

            if (INFRA_IE > 0 && INFRA_IE < 7) {
                ifr = parent.document.createElement('iframe');
                ifr.className = 'infraFundoIE';
                div.appendChild(ifr);
            } else {
                div.onclick = function () {
                    try {
                        infraJanelaModal.focus();
                    } catch (exc) {
                    }
                }
            }
            parent.document.body.appendChild(div);
        }

        if (INFRA_IE == 0 || INFRA_IE >= 7) {
            div.style.position = 'fixed';
        }

        div.style.width = parent.infraClientWidth() + 'px';
        div.style.height = parent.infraClientHeight() + 'px';
        div.style.visibility = 'visible';

        infraIntervaloModal = window.setInterval("infraMonitorarModal()", 100);
    }

    return janela;

}