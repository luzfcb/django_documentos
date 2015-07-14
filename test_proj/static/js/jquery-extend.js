$.extend($.validator.messages, {
    required: "Este campo é obrigatório",
    remote: "Corriga esse campo.",
    email: "Informe um endereço de e-mail válido",
    url: "Insira uma URL válida.",
    date: "Insira uma data válida.",
    dateISO: "Insira uma data válida (ISO).",
    number: "Insira um número válido",
    digits: "Insira apenas dígitos",
    creditcard: "Insira um número de cartão de crédito válido.",
    equalTo: "Insira o mesmo valor novamente.",
    maxlength: $.validator.format("Insira no máximo {0} caracteres."),
    minlength: $.validator.format("Insira no mínimo {0} caracteres."),
    rangelength: $.validator.format("Informe um valor entre {0} e {1} caracteres."),
    range: $.validator.format("Informe um valor entre {0} e {1}."),
    max: $.validator.format("Informe um valor menor ou igual a {0}."),
    min: $.validator.format("Informe um valor maior ou igual a {0}.")
});