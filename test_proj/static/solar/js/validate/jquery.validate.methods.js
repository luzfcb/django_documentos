/*
BUGFIX: validar corretamente data no formato pt-br no Chrome
http://stackoverflow.com/questions/6906725/unobtrusive-validation-in-chrome-wont-validate-with-dd-mm-yyyy
http://www.codeproject.com/Tips/579279/Fixing-jQuery-non-US-Date-Validation-for-Chrome
http://levidad.wordpress.com/2011/07/11/mvc-3-validacao-para-culturas-como-pt-br/
*/
$.validator.methods.date = function (value, element) {
	return this.optional(element) || Globalize.parseDate(value, "dd/mm/yyyy", "en");
};

$.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg != value;
}, "Informe um valor válido");

jQuery.validator.addMethod("cpf", function(value, element) {

	value = jQuery.trim(value);
	cpf = value.replace(/[^0-9]+/g,'');

	if(cpf=='') return true;

	while(cpf.length < 11) cpf = "0"+ cpf;
	
	var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
	var a = [];
	var b = new Number;
	var c = 11;
	
	for (i=0; i<11; i++){
		a[i] = cpf.charAt(i);
		if (i < 9) b += (a[i] * --c);
	}
	
	if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11-x }
		b = 0;
	c = 11;
	
	for (y=0; y<10; y++) b += (a[y] * c--);
		if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11-x; }
	if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) return false;
	
	return true;
	
}, "Informe um CPF válido."); // Mensagem padrão