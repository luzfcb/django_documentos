
var INFRA_IE = infraVersaoIE();
var INFRA_FF = infraVersaoFirefox();
var INFRA_CHROME = infraVersaoChrome();
var INFRA_SAFARI = infraVersaoSafari();
var INFRA_WEBKIT = infraVersaoWebkit();
var INFRA_XHTML = infraVersaoXHTML();
var INFRA_IOS = infraVersaoIOS();


var infraJanelaModal = null;
var infraIntervaloModal = null;
var infraFlagResize = false;

function infraAdicionarEvento(obj, evento, funcao){
    if( obj.attachEvent ){
      obj.attachEvent("on"+evento, funcao);
    }
    else if( obj.addEventListener ){
         obj.addEventListener(evento, funcao, false);
    }
}

function infraRemoverEvento(obj, evento, funcao) {
  if ( obj.detachEvent ) {
    obj.detachEvent( 'on'+evento, funcao );
  } else {
    obj.removeEventListener( evento, funcao, false );
  }
}

function infraProcessarResize() {
  infraResize();
  infraAdicionarEvento(window,'resize',infraResize);
}

function infraOffsetTopTotal(elemento){
	var y = 0;
	var el=elemento;
	while (el.offsetParent && el.tagName.toUpperCase() != 'BODY'){
		y += el.offsetTop;
		el = el.offsetParent;
	}
	y += el.offsetTop;
	return y;
}

function infraOffsetLeftTotal(elemento){
	var y = 0;
	var el=elemento;
	while (el.offsetParent && el.tagName.toUpperCase() != 'BODY'){
		y += el.offsetLeft;
		el = el.offsetParent;
	}
	y += el.offsetLeft;
	return y;
}

function infraResize(){

  if (!infraFlagResize){

	infraFlagResize = true;

	var divAreaTela = document.getElementById('divInfraAreaTela');
	var divAreaE = document.getElementById('divInfraAreaTelaE');
	var divAreaD = document.getElementById('divInfraAreaTelaD');


	if (divAreaTela != null){

	  var hTotalTela = infraClientHeight();

	  if (hTotalTela > 115){
	    hTotalTela -= 115;
	  }

	  if (divAreaE != null && divAreaD!=null){

	    var y = infraOffsetTopTotal(divAreaTela);

	    if (INFRA_IOS) {

	      if (divAreaE.offsetHeight < 100){
	        divAreaE.style.height='100px';
	      }

	      if (divAreaD.offsetHeight < 100){
	        divAreaD.style.height='100px';
	      }
	    }

	  	var hTotalE = (y + divAreaE.offsetHeight);
	   	var hTotalD = (y + divAreaD.offsetHeight);

	   	if (hTotalTela < hTotalE){
	   	  hTotalTela = hTotalE;
	   	}

	   	if (hTotalTela < hTotalD){
	   	  hTotalTela = hTotalD;
	   	}

	   	// div global menor que o tamanho disponivel ou ocupando mais espaço do que devia
	    if (divAreaTela.offsetHeight < hTotalTela || (hTotalE < hTotalTela && hTotalD < hTotalTela)){
	      divAreaTela.style.height = hTotalTela + 'px';
    	}

      }else if (divAreaTela.offsetHeight < hTotalTela){
	    divAreaTela.style.height = hTotalTela + 'px';
	  }
	}

	if (INFRA_IOS){

	  var hScroll = divAreaTela.offsetHeight;

	  if (divAreaE!=null && hScroll < divAreaE.scrollHeight) {
		hScroll = divAreaE.scrollHeight;
	  }

	  if (divAreaD!=null && hScroll < divAreaD.scrollHeight) {
	    hScroll = divAreaD.scrollHeight;
	  }

	  if (divAreaTela.offsetHeight < hScroll){
		divAreaTela.style.height = hScroll + 'px';
	  }
	}

	if (document.getElementById('divInfraAviso')!=null){

	  var divAviso = document.getElementById('divInfraAviso');
	  divAviso.style.top = Math.floor(infraClientHeight()/3) + 'px';
	  divAviso.style.left = Math.floor((infraClientWidth()-200)/2) + 'px';
	  var divFundo = document.getElementById('divInfraAvisoFundo');
	  if (INFRA_IOS) {
	    divFundo.style.width = document.documentElement.clientWidth + 200 +'px';
	    divFundo.style.height = document.documentElement.clientHeight + 200 + 'px';
	  } else {
	    divFundo.style.width = infraClientWidth() + 'px';
	    divFundo.style.height = infraClientHeight() + 'px';
	  }
	}

	infraFlagResize = false;
  }
}

function infraDesabilitarCamposDiv(div){
  var el;
  var els;
  var e;

  e = 0;
  els = div.getElementsByTagName('input');
  while (el = els.item(e++)){
    if (el.type != 'hidden'){
      if (INFRA_IE > 0){
        el.disabled=true;
      }else{
        if (el.type == 'checkbox' || el.type == 'radio'){
          el.disabled=true;
        }else{
          el.readOnly = true;
        }
      }
    }
  }

  e = 0;
  els = div.getElementsByTagName('select');
  while (el = els.item(e++)){
    if (!el.multiple){
      el.disabled=true;
    }
  }

  e = 0;
  els = div.getElementsByTagName('textarea');
  while (el = els.item(e++)){
    // No IE a barra de rolagem fica bloqueada se usando disabled
    if (INFRA_IE > 0){
      el.readOnly = true;
    }else{
      el.disabled = true;
    }
  }

  e = 0;
  els = div.getElementsByTagName('img');
  while (el = els.item(e++)){
    el.style.visibility='hidden';
  }
}

function infraHabilitarCamposDiv(div){
 var el;
 var els;
 var e;

 e = 0;
 els = div.getElementsByTagName('input');
 while (el = els.item(e++)){
   if (el.type != 'hidden'){
     if (INFRA_IE > 0){
       el.disabled=false;
     }else{
       if (el.type == 'checkbox' || el.type == 'radio'){
         el.disabled=false;
       }else{
         el.readOnly = false;
       }
     }
   }
 }


 e = 0;
 els = div.getElementsByTagName('select');
 while (el = els.item(e++)){
   if (!el.multiple){
     el.disabled=false;
   }
 }

 e = 0;
 els = div.getElementsByTagName('textarea');
 while (el = els.item(e++)){
   // No IE a barra de rolagem fica bloqueada se usando disabled
   if (INFRA_IE > 0){
     el.readOnly = false;
   }else{
     el.disabled=false;
   }
 }

 e = 0;
 els = div.getElementsByTagName('img');
 while (el = els.item(e++)){
   el.style.visibility='visible';
 }
}

function infraDesabilitarCamposAreaDados(){
  var arr = null;

  arr = document.getElementsByTagName('div');

  for(var i=0;i<arr.length;i++){
    if (arr[i].className == 'infraAreaDados' || arr[i].className == 'infraAreaDadosDinamica'){
      infraDesabilitarCamposDiv(arr[i]);
    }
  }
}

function infraDesabilitarAutoCompleteTxt(objInputText) {
  if (objInputText.type == 'text') {
    objInputText.setAttribute("autocomplete","off");
  }
}

function infraDesabilitarAutoCompleteFrm(objFrm) {
  var arrInputs = objFrm.getElementsByTagName('input');
  for(i=0;i < arrInputs.length;i++) {
    infraDesabilitarAutoCompleteTxt(arrInputs[i]);
  }
}

function infraSelecionarCampo(obj,selStart,selEnd){
 if (typeof selStart=="undefined") selStart = 0;
 if (typeof selEnd=="undefined")   selEnd = obj.value.length;

 if (obj.setSelectionRange) {
  obj.focus();
  obj.setSelectionRange(selStart, selEnd);
 } else if (obj.createTextRange) {
  var range = obj.createTextRange();
  range.collapse(true);
  range.moveEnd('character', selEnd);
  range.moveStart('character', selStart);
  range.select();
 }
 obj.focus();
}

function infraGetSelecaoCampo(obj){
  var start,end;
  if (typeof obj.selectionStart!="undefined") {
    if (obj.selectionStart!=obj.selectionEnd) {
      start=obj.selectionStart < obj.selectionEnd?obj.selectionStart:obj.selectionEnd;
      end=obj.selectionStart > obj.selectionEnd?obj.selectionStart:obj.selectionEnd;
    }
    else {
  	  start=end=obj.selectionStart;
    }
  } else {
    var bookmark = document.selection.createRange().getBookmark();
    var selection = obj.createTextRange();
    selection.moveToBookmark(bookmark);

    var before = obj.createTextRange();
    before.collapse(true);
    before.setEndPoint("EndToStart", selection);

    start = before.text.length;
    end = start+selection.text.length;
  }
  return { "start":start, "end":end };
}

function infraNroItensSelecionados() {
  var infraNroItens = document.getElementById('hdnInfraNroItens');
  var n = 0;
  var i;
  for (i=0; i<infraNroItens.value; i++) {
    box = document.getElementById('chkInfraItem'+i);
    if (box!=null && box.checked && !box.disabled) {
      n++;
    }
  }
  return n;
}

function infraDetalhesExcecao(){
  var infraBotaoDetalhes = document.getElementById('btnInfraDetalhesExcecao');
  if(infraBotaoDetalhes.value=='Exibir Detalhes'){
    document.getElementById('divInfraDetalhesExcecao').style.visibility='visible';
    infraBotaoDetalhes.value='Ocultar Detalhes';
  }
  else {
    document.getElementById('divInfraDetalhesExcecao').style.visibility='hidden';
    infraBotaoDetalhes.value='Exibir Detalhes';
  }
}

function infraRTrim(String){
  if (String!=null && String.length>0){
    while(String.charAt((String.length -1))==' '){
      String = String.substring(0,String.length-1);
    }
  }
  return String;
}

function infraLTrim(String){
  if (String!=null && String.length>0){
    while(String.charAt(0)==' '){
      String = String.replace(String.charAt(0),'');
    }
  }
  return String;
}

function infraTrim(String){
  String = infraLTrim(String);
  return infraRTrim(String);
}

function infraLPad(str, tam, car){
	var dif = tam - str.length;
	var ch = String(car).charAt(0);
	for (; dif>0; dif--) str = ch.concat(str);
	return str;
}

function infraRPad(str, tam, car){
	var dif = tam - str.length;
	var ch = String(car).charAt(0);
	for (; dif>0; dif--) str = str.concat(ch);
	return str;
}

function infraIsNumber(str) {
  var i;
  var c;
  for(i=0;i<str.length;i++){
    c = str.charAt(i);
    if (c != '0' && c != '1' && c != '2' && c != '3' &&	c != '4' && c != '5' && c != '6' && c != '7' && c != '8' && c != '9') {
      return false;
    }
  }
  return true;
}

function infraGetElementById(element){

  var e = element;

  if (typeof(e)=='string'){
    e = document.getElementById(e);
  }

  if (e==null || typeof(e)!='object'){
    alert('Elemento \''+element+'\' não encontrado na página.');
    return false;
  }

  return e;
}
/*
 * function infraTrimValue(element){ element = infraGetElementById(element);
 * return infraTrim(element.value); }
 */

function infraSelectLimpar(select){
  var select = infraGetElementById(select);
  select.length = 0;
}

function infraSelectSelecionado(select){

  var select = infraGetElementById(select);

  if (select.length==0 || select.value=='null'){
    return false;
  }
  return true;
}

function infraSelectSelecionarItem(select,valor){

  var select = infraGetElementById(select);
  for (var i=0; i<select.length; i++) {
    if (select.options[i].value == valor) {
      select.options[i].selected = true;
      return;
    }
  }
}

function infraSelectToTable(idSelect) {

  if (window.dialogArguments) {
    window.opener = window.dialogArguments;
  }


  var obj = new Object(window.opener.document.getElementById(idSelect));
  var tamanho = obj.length;

  var objInfraNroItens = document.getElementById('hdnInfraNroItens');
  if (objInfraNroItens!=null){
    var infraNroItens = objInfraNroItens.value;
    for (var j=0; j < tamanho; j++) {
      opt = obj.options[j];
      for (var i=0; i < infraNroItens; i++) {
        box = document.getElementById('chkInfraItem'+i);
        if ( box!=null && box.value == opt.value  ) {

          box.checked=true;

          infraFormatarTrMarcada(box.parentNode.parentNode);

          if (box.type=="checkbox"){
            box.disabled=true;
          }

          // novo
          opt.text = box.title;

          var acao = document.getElementById('lnkInfraT-'+box.value);
          if (acao!=null){
            acao.style.visibility = 'hidden';
          }
        }
      }
    }
    infraSelecionarItens();
  }
}

function infraHiddenTextToTable(idHidden,idText) {

  if (window.dialogArguments) {
    window.opener = window.dialogArguments;
  }

  var objHidden = new Object(window.opener.document.getElementById(idHidden));
  var objText = new Object(window.opener.document.getElementById(idText));

  // alert(objHidden.value);
  var objInfraNroItens = document.getElementById('hdnInfraNroItens');
  if (objInfraNroItens!=null){
    var infraNroItens = objInfraNroItens.value;
    for (var i=0; i < infraNroItens; i++) {
      box = document.getElementById('chkInfraItem'+i);
      if ( box!=null && box.value == objHidden.value ) {
        box.checked=true;
        box.parentNode.parentNode.className='inrfraTrMarcada';

        // novo
        objText.value = box.title;

        var acao = document.getElementById('lnkInfraT-'+box.value);
        if (acao!=null){
          acao.style.visibility = 'hidden';
        }

        infraSelecionarItens();
        return;
      }
    }
  }
}

function infraTableToTable(objInfraLupaTable, item){

  if (window.dialogArguments) {
    window.opener = window.dialogArguments;
  }

  //var objTable = new Object(window.opener.document.getElementById(objInfraLupaTable.tbl.id));
  var objTable = objInfraLupaTable.tbl;

  var n = 0;
  var opt = null;
  var i,j;

  // Se é transporte individual
  if (item!=undefined){

    for (i = 0; i < objTable.rows.length; i++) {
      if (item.value == String(infraTrim(objInfraLupaTable.objInfraTabelaDinamica.lerCelula(objTable.rows[i].cells[0]))) ) {
        break;
      }
    }

    if (i == objTable.rows.length){
      objInfraLupaTable.objInfraTabelaDinamica.adicionar([item.value, item.title]);
      // opt.selected = true;
      n++;
    }
  }else{

    var infraNroItens = document.getElementById('hdnInfraNroItens').value;
    for (var i=0; i < infraNroItens; i++) {
      box = document.getElementById('chkInfraItem'+i);

      if (box!=null && box.checked && !box.disabled) {

        // Somente se o item não esta na tabela
        for (j = 0; j < objTable.rows.length; j++) {
          if (box.value == String(infraTrim(objInfraLupaTable.objInfraTabelaDinamica.lerCelula(objTable.rows[j].cells[0]))) ) {
            break;
          }
        }

        if (j==objTable.rows.length){

          objInfraLupaTable.objInfraTabelaDinamica.adicionar([box.value, box.title]);

          // opt.selected = true;
          if (box.type=="checkbox"){
            box.disabled=true;
          }
          n++;
        }
      }
    }
  }
  return n;
}

function infraTableToSelect(idSelect,item){

  if (window.dialogArguments) {
    window.opener = window.dialogArguments;
  }

  var obj = new Object(window.opener.document.getElementById(idSelect));

  // obj.options.length=0;
  var n = 0;
  var opt = null;
  var i,j;

  for(i=0; i<obj.length; i++){
    obj.options[i].selected=false;
  }

  // Se é transporte individual
  if (item!=undefined){

    for(i=0; i <obj.length; i++){
      opt = obj.options[i];
      if (item.value==opt.value){
        break;
      }
    }
    if (i==obj.length){
      opt = window.opener.infraSelectAdicionarOption(obj,item.title,item.value);
      opt.selected = true;
      n++;
    }
  }else{

    var infraNroItens = document.getElementById('hdnInfraNroItens').value;
    for (var i=0; i < infraNroItens; i++) {
      box = document.getElementById('chkInfraItem'+i);

      if (box!=null && box.checked && !box.disabled) {
        // Somente se o item não esta no select adiciona
        for(var j=0; j <obj.length; j++){
          opt = obj.options[j];
          if (box.value==opt.value){
            break;
          }
        }
        if (j==obj.length){
          opt = window.opener.infraSelectAdicionarOption(obj,box.title,box.value);
          opt.selected = true;
          if (box.type=="checkbox"){
            box.disabled=true;
          }
          n++;
        }
      }
    }
  }
  return n;
}

function infraTableToHiddenText(idHidden,idText,item){

  if (window.dialogArguments) {
    window.opener = window.dialogArguments;
  }

  var objHidden = new Object(window.opener.document.getElementById(idHidden));
  var objText = new Object(window.opener.document.getElementById(idText));

  objHidden.value = '';
  objText.value = '';

  // Se é transporte individual
  if (item!=undefined){
    objHidden.value = item.value;
    objText.value = objText.value + item.title;
    return true;
  }else{
    var infraNroItens = document.getElementById('hdnInfraNroItens').value;
    for (var i=0; i < infraNroItens; i++) {
      var box = document.getElementById('chkInfraItem'+i);
      if ( box!=null && box.checked ) {
        // Retorna o primeiro que encontrar
        objHidden.value = box.value;
        objText.value = box.title;
        return true;
      }
    }
  }
  return false;
}

function infraTableToTextArea(idTextArea,item){

  if (window.dialogArguments) {
    window.opener = window.dialogArguments;
  }

  var objTextArea = new Object(window.opener.document.getElementById(idTextArea));

  // Se é transporte individual
  if (item!=undefined){
    // objTextArea.value = objTextArea.value + item.title;
    infraInserirCursor(objTextArea,item.title);
    return true;
  }else{
    var infraNroItens = document.getElementById('hdnInfraNroItens').value;
    for (var i=0; i < infraNroItens; i++) {
      var box = document.getElementById('chkInfraItem'+i);
      if ( box!=null && box.checked ) {
        // objTextArea.value = objTextArea.value + box.title;
        infraInserirCursor(objTextArea,box.title);
        return true;
      }
    }
  }
  return false;
}

function infraRemoverFormatacaoXML(str){
  var temp = str;
  temp = temp.infraReplaceAll('&quot;','"');
  temp = temp.infraReplaceAll('&lt;','<');
  temp = temp.infraReplaceAll('&gt;','>');
  temp = temp.infraReplaceAll('&amp;','&');
  return temp;
}

function infraFormatarXML(str){
  var temp = str;
  temp = temp.infraReplaceAll('&','&amp;');
  temp = temp.infraReplaceAll('<','&lt;');
  temp = temp.infraReplaceAll('>','&gt;');
  temp = temp.infraReplaceAll('"','&quot;');
  temp = temp.infraReplaceAll('&amp;lt;','&lt;');
  temp = temp.infraReplaceAll('&amp;gt;','&gt;');
  temp = temp.infraReplaceAll('&amp;quot','&quot;');
  return temp;
}

function infraInserirCursor(objTextArea,texto){

  texto = infraRemoverFormatacaoXML(texto);

  if(document.all){
    if (objTextArea.createTextRange && objTextArea.caretPos) {
      objTextArea.caretPos.text = ' ' + texto + ' ';
    }else{
      if (objTextArea.value != ''){
        objTextArea.value = ' ' + objTextArea.value;
      }
      objTextArea.value = texto + objTextArea.value;
    }
  }else{
    if(objTextArea.setSelectionRange){
      var rangeStart = objTextArea.selectionStart;
      var rangeEnd = objTextArea.selectionEnd;
      var tempStr1 = objTextArea.value.substring(0,rangeStart);
      var tempStr2 = objTextArea.value.substring(rangeEnd);

      if (tempStr1!=''){
        tempStr1 = tempStr1 + ' ';
      }

      if (tempStr2!=''){
        tempStr2 = ' ' + tempStr2;
      }

      objTextArea.value = tempStr1 + texto + tempStr2;

      var pos = tempStr1.length + texto.length;

      objTextArea.setSelectionRange(pos, pos);
    }else{
      alert("Este navegador não suporta esta operação.");
    }
  }
  objTextArea.focus();
}

function infraPosicionarCursor(txa) {
  if (txa.createTextRange) {
    txa.caretPos = document.selection.createRange().duplicate();
  }
}


function infraSelectRemoverItensSelecionados(idSelect,idHidden){
  var obj = new Object(document.getElementById(idSelect));
  var i;

  if (obj.length==0){
    alert('Não existem itens para esta ação.');
    return;
  }

  for (i=0; i<obj.length; i++) {
    if (obj.options[i].selected){
      break;
    }
  }

  if (i==obj.length){
    alert('Nenhum item selecionado.');
    return;
  }

  var flagRemoveuItem;
  do{
    flagRemoveuItem=false;

    var i = 0;
    while(i<obj.length && !flagRemoveuItem){
      if (obj.options[i].selected){
        obj.options[i]=null;
        flagRemoveuItem = true;
      }
      i++;
    }

    /*
	 * for (i=0; i<obj.length; i++) { if (obj.options[i].selected){
	 * obj.options[i]=null; flagRemoveuItem = true; break; } }
	 */
  }while(flagRemoveuItem);

  if (idHidden!=undefined){
    var objHidden = new Object(document.getElementById(idHidden));
    infraSelectConcatenarItens(obj,objHidden);
  }
}

function infraSelectAdicionarOption(obj,texto,valor){
  var opt = new Option(texto, valor);
  var indice = 0;
  if (obj.options!=null){
    indice = obj.options.length;
  }
  obj.options[indice] = opt;
  return opt;
}

/*
 * function infraBrowserIE(){ var agt=navigator.userAgent.toLowerCase(); if
 * (agt.indexOf('msie')!=-1){ return true; } return false; }
 */

function infraVersaoIE() {

  var ua = navigator.userAgent.toLowerCase();
  var MSIEOffset = ua.indexOf("msie ");

  if (MSIEOffset == -1) {
  	var TridentOffset=ua.indexOf("trident/");
  	var rvOffset=ua.indexOf("rv:", TridentOffset)
  	if(TridentOffset!=-1){ //verifica tag Trident para IE>=11
  		return parseFloat(ua.substring(rvOffset + 3, ua.indexOf(")", rvOffset)));
  	}
    return 0;
  } else {
      return parseFloat(ua.substring(MSIEOffset + 5, ua.indexOf(";", MSIEOffset)));
  }
}

function infraVersaoFirefox() {
  var ua = navigator.userAgent.toLowerCase();
  var FFOffset = ua.indexOf("firefox/");
  if (FFOffset == -1) {
    return 0;
  } else {
    return parseFloat(ua.substring(FFOffset + 8, ua.indexOf(".", FFOffset)));
  }
}

function infraBrowserChrome(){
    var agt=navigator.userAgent.toLowerCase();
    if (agt.indexOf('chrome')!=-1){
      return true;
    }
    return false;
}

function infraVersaoChrome(){
  var agt=navigator.userAgent.toLowerCase();
  var chromeOffset = agt.indexOf('chrome/');
  if (chromeOffset == -1){
    return 0;
  }else{
	return parseFloat(agt.substring(chromeOffset + 7, agt.indexOf(".", chromeOffset)));
  }
}

function infraVersaoSafari(){
  var agt=navigator.userAgent.toLowerCase();
  var safariOffset = agt.indexOf('safari/');
  if (safariOffset == -1){
    return 0;
  }else{
	return parseFloat(agt.substring(safariOffset + 7, agt.indexOf(".", safariOffset)));
  }
}

function infraVersaoIOS(){
	var ua=navigator.userAgent;
	if (ua.indexOf("Mac") > -1 && ua.indexOf("Mobile") > -1){
	  if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
	    return parseFloat(RegExp.$1.replace("_", "."));
	  } else {
		  return 2; // can’t really detect - so guess
	  }
	}
	return 0;
}

function infraVersaoWebkit(){
  var agt=navigator.userAgent.toLowerCase();
  var webkitOffset = agt.indexOf('webkit/');
  if (webkitOffset == -1){
    return 0;
  }else{
	return parseFloat(agt.substring(webkitOffset + 7, agt.indexOf(".", webkitOffset)));
  }
}

function infraVersaoXHTML() {

  if (INFRA_FF && INFRA_FF > 10){
    if (document.createElement("infraxhtml").tagName == "INFRAXHTML"){
      return 0;
    }else{
      return 1;
    }
  }

  if (document.xmlVersion==undefined){
    return 0;
  }

  if (document.xmlVersion==null){
    return 0;
  }

  return document.xmlVersion
}

function infraSelectInicializarHidden(select, hidden){
  objSelect = infraGetElementById(select);
  objHidden = infraGetElementById(hidden);
  infraSelectConcatenarItens(objSelect,objHidden);
}


function infraSelectConcatenarItens(objSelect, objCampo){
  objCampo.value = '';
  for (var i=0; i<objSelect.length; i++) {
    if ( objCampo.value != '' ){
      objCampo.value = objCampo.value + ',';
    }
    objCampo.value = objCampo.value + objSelect.options[i].value;
  }
}

function infraSelectConcatenarItensComTexto(objSelect, objCampo){
  objCampo.value = '';
  for (var i=0; i<objSelect.length; i++) {
    if ( objCampo.value != '' ){
      objCampo.value = objCampo.value + ',';
    }
    objCampo.value = objCampo.value + objSelect.options[i].value + '#' + objSelect.options[i].text;
  }
}

function infraAcaoOrdenar(strCampoOrd, strTipoOrd){
  var objInfraCampoOrd = document.getElementById('hdnInfraCampoOrd');

  var ret = true;

  if(typeof(objInfraCampoOrd.form.onsubmit)=='function'){
    ret = objInfraCampoOrd.form.onsubmit();
  }

  if (ret){
    document.getElementById('hdnInfraCampoOrd').value=strCampoOrd;
    document.getElementById('hdnInfraTipoOrd').value=strTipoOrd;

    // Reseta paginação, se existir
    if (document.getElementById('hdnInfraPaginaAtual')!=null){
      document.getElementById('hdnInfraPaginaAtual').value = 0;
    }

    document.getElementById('hdnInfraCampoOrd').form.submit();
  }
}

function infraAcaoPaginar(tipo,pag){
  var objInfraPaginaAtual = document.getElementById('hdnInfraPaginaAtual');

  var ret = true;

  if(typeof(objInfraPaginaAtual.form.onsubmit)=='function'){
    ret = objInfraPaginaAtual.form.onsubmit();
  }

  if (ret){
    var paginaAtual = objInfraPaginaAtual.value;
    var idText = document.getElementById('hdnInfraSelecaoIdText');

    if (tipo=='-'){
      paginaAtual--;
      if (paginaAtual < 0){
        paginaAtual = 0;
      }
    }else if (tipo=='+'){
      paginaAtual++;
    }else if (tipo == '='){
      paginaAtual = pag;
    }

    if (idText==null || idText.value==''){
      if (document.getElementById('hdnInfraPaginaSelecao')!=null){
        var nroSelecionados = infraNroItensSelecionados();

        if (nroSelecionados>0){
          var msg = '';
          if (nroSelecionados==1){
            msg = 'Existe um item selecionado que não foi transportado.';
          }else{
            msg = 'Existem '+nroSelecionados+' itens selecionados que não foram transportados.';
          }
          msg += '\nSe você continuar a seleção será perdida.\n\nDeseja continuar?'
          if (!confirm(msg)){
            return;
          }
        }
      }
    }

    objInfraPaginaAtual.value = paginaAtual;
    objInfraPaginaAtual.form.submit();

  }else{
    // volta o combo de página para o item anterior
    var objSelInfraPaginacao = document.getElementById('selInfraPaginacaoInferior');
    if (objSelInfraPaginacao!=null){
      infraSelectSelecionarItem(objSelInfraPaginacao,objInfraPaginaAtual.value);
    }
  }
}

function infraValidarEmail(email){
  reEmail = /^\#([\w-]+(\.[\w-]+)*@(([A-Za-z\d][A-Za-z\d-]{0,61}[A-Za-z\d]\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])|([^<^>^"]*)\<[\w-]+(\.[\w-]+)*@(([A-Za-z\d][A-Za-z\d-]{0,61}[A-Za-z\d]\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])\>|((\s)*"[^"]*"(\s)*)\<[\w-]+(\.[\w-]+)*@(([A-Za-z\d][A-Za-z\d-]{0,61}[A-Za-z\d]\.)+[A-Za-z]{2,6}|\[\d{1,3}(\.\d{1,3}){3}\])\>)\#$/;
  return reEmail.test('#'+email+'#');
}

function infraValidarDin(din){
	reDinheiro = /^(R\$[ ]*)?[0-9]{1,3}(?:.?[0-9]{3})*(?:,[0-9]{2})?$/;
	return reDinheiro.test(infraTrim(din));
}

function infraValidarCaracter(carac,tipo){
  var LetrasU = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÃÀÄÂÉÈËÊÍÏÓÕÔÚÜÇ';
  var LetrasL = 'abcdefghijklmnopqrstuvwxyzáãàäâéèëêíïóõôúüç';
  var Numeros = '0123456789';

  if(tipo=="#"){
    if(Numeros.indexOf(carac)==-1){
      return false;
    }
  }else if(tipo=="A"){
    if(LetrasU.indexOf(carac)==-1){
      return false;
    }
  }else if(tipo=="a"){
    if(LetrasL.indexOf(carac)==-1){
      return false;
    }
  }else if(tipo=="L"){
    if(LetrasU.indexOf(carac)==-1 && LetrasL.indexOf(carac)==-1){
      return false;
    }
  }
  return true;
}

/*
function infraMascaraExcecao(evt){

    var ntecla = infraGetCodigoTecla(evt);

    // alert(ntecla);

    if (ntecla == 37 || // seta esquerda
        ntecla == 39 || // seta direita
        ntecla == 36 || // home
        ntecla == 35 || // end
        ntecla == 33 || // page up
        ntecla == 34 || // page down
        ntecla == 45 || // insert
        ntecla == 46 || // delete
        ntecla == 8  || // backspace
        ntecla == 9  || // tab
        ntecla == 27 || // esc
        ntecla == 0  || // controle
        ntecla == 13 || // enter
        evt.ctrlKey){

      return true;
    }

    return false;
}
*/

function infraMascaraExcecao(evt){

    var ntecla = infraGetCodigoTecla(evt);

    if (evt.ctrlKey || (evt.charCode == 0 && (ntecla == 37 || // seta esquerda
                                              ntecla == 39 || // seta direita
                                              ntecla == 36 || // home
                                              ntecla == 35 || // end
                                              ntecla == 33 || // page up
                                              ntecla == 34 || // page down
                                              ntecla == 45 || // insert
                                              ntecla == 46 || // delete
                                              ntecla == 8  || // backspace
                                              ntecla == 9  || // tab
                                              ntecla == 27 || // esc
                                              ntecla == 0  || // controle
                                              ntecla == 13))){
      return true;
    }

    return false;
}


function infraMascaraTexto(objeto,evt, qtd){

  if (objeto.readOnly || objeto.disabled){
    return false;
  }

  if (infraMascaraExcecao(evt)){
    return true;
  }

  if (qtd != undefined){
    if (!infraLimitarTexto(objeto,evt,qtd)){
      return false;
    }
  }

  var ntecla = infraGetCodigoTecla(evt);

  // Não aceita aspas
  if (ntecla==34){
    return false;
  }
  return true;
}

function infraMascaraProcessoSei(objeto, evt) {
  return infraMascara(objeto, evt, '##.#.#########-#');
}

function infraMascaraData(objeto, evt) {
  return infraMascara(objeto, evt, '##/##/####');
}

function infraMascaraDataHora(objeto, evt) {
  return infraMascara(objeto, evt, '##/##/#### ##:##:##');
}

function infraMascaraHora(objeto, evt) {
  return infraMascara(objeto, evt, '##:##');
}

function infraMascaraCEP(objeto, evt) {
  return infraMascara(objeto, evt, '#####-###');
}

function infraMascaraTelefone(objeto, evt) {
  setTimeout(function(){
    var v=objeto.value;
    v=v.replace(/\D/g,"");     //Remove tudo o que não é dígito
    var l=v.length;
    if (l>11) v=v.substr(0,11);
    if (l<3 && l>0) {  v='('+v; }
    else { v=v.replace(/^(\d{2})(\d*)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    }
    if (l>6) v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    objeto.value=v;},1);
}

function infraMascaraDinheiro(objeto, evt, numDec, numTotal,sinNegativo) {
  return infraMascaraDecimais(objeto, '.', ',', evt, numDec, numTotal,sinNegativo);
}

function infraMascaraCPF(objeto, evt) {
  return infraMascara(objeto, evt, '###.###.###-##');
}

function infraMascaraPlacaCarro(objeto, evt) {
  return infraMascara(objeto, evt, 'AAA-####');
}

function infraMascaraCnpj(objeto,evt){
  return infraMascara(objeto, evt, '##.###.###/####-##');
}

function infraMascaraCpf(objeto,evt){
  return infraMascara(objeto, evt, '###.###.###-##');
}


function infraMascaraNumero(objeto, evt, qtd, exc){

  if (objeto.readOnly || objeto.disabled){
    return false;
  }

  if (infraMascaraExcecao(evt)){
    return true;
  }

  if (qtd != undefined && qtd != null){
    if (!infraLimitarTexto(objeto,evt,qtd)){
      return false;
    }
  }

  if (exc==undefined){
    exc = '';
  }

  var key = infraGetCodigoTecla(evt);

  if ((key < 48 || key > 57) && exc.indexOf(String.fromCharCode(key))==-1){
    return false
  }
}

function infraMascara(objeto, evt, mask) {

  if (objeto.readOnly || objeto.disabled){
    return false;
  }

  var Separadores = ' "|/?!@$%¨&*(),.;<>:~^_-=+[{]}';

  if (infraMascaraExcecao(evt)){
    return true;
  }


  var ntecla = infraGetCodigoTecla(evt);

  var tempObj = objeto.value;
  var tempObjSize = tempObj.length;
  var objRetorno = "";
  var i;

  ntecla = String.fromCharCode(ntecla);
  var selected_text = "";
  if(document.selection){selected_text = document.selection.createRange().text;}
  else{selected_text = objeto.value.substring(objeto.selectionStart, objeto.selectionEnd);}

  var tempObjSize = tempObj.length;

  if(selected_text.length>0){
    tempObjSize = mask.length - selected_text.length;
  }

  if(tempObjSize<mask.length){
    for(i=0;i<mask.length;i++){
      if(i<tempObjSize){
        if(Separadores.indexOf(mask.substr(i,1))!=-1){
          objRetorno = objRetorno+mask.charAt(i);
          objRetorno = objRetorno+tempObj.charAt(i);
        }else{
          objRetorno = objRetorno+tempObj.charAt(i);
        }
      }
    }

    if(Separadores.indexOf(mask.substr(tempObjSize,1))!=-1){
      objeto.value = tempObj+mask.substr(tempObjSize,1);
      tempObj = objeto.value;
      tempObjSize = tempObj.length;
    }

    if(infraValidarCaracter(ntecla,mask.substr(tempObjSize,1))){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }

  return true;
}

function infraMascaraNumeroSeparador(objeto, evt, sep){

  if (objeto.readOnly || objeto.disabled){
    return false;
  }

  if (infraMascaraExcecao(evt)){
    return true;
  }

  var key = infraGetCodigoTecla(evt);

  if ((key < 48 || key > 57) && (objeto.value.indexOf(sep)!=-1 || String.fromCharCode(key)!=sep)){
    return false
  }

  return true;
}


function infraMascaraDecimais(input, milSep, decSep, e, numDec, numTotal,sinNegativo) {

  if (input.readOnly || input.disabled){
    return false;
  }

  var selAtual = infraGetSelecaoCampo(input);
  var ntecla = infraGetCodigoTecla(e);
  var strFmt = input.value;
  if (typeof numDec == 'undefined' || numDec < 0) numDec = 2;
  var strNFmt = infraRemoverFormatacaoDecimal(strFmt,numDec);
  if (typeof numTotal == 'undefined' || numTotal < 0) numTotal = 0;
  if (typeof sinNegativo == 'undefined') sinNegativo = false;
  if (typeof milSep != 'string') milSep = '.';
  if (typeof decSep != 'string') decSep = ',';
  var strFinal = '';
  var selNova = {start:null, end:null};
  var digitoRegex;

  var negativo = (strNFmt.length > 0 && strNFmt.charAt(0) == '-') ? 1 : 0;
  var contaDigitos = function (str, posAtual) {
    var len = str.length;
    if (posAtual > len) posAtual=len;
    if (posAtual == 0) return 0;
    var numDigitos = 0;
    for (var a = 0; a < posAtual; a++) {
      if (digitoRegex.test(str.charAt(a))) numDigitos++;
    }
    return numDigitos;
  };
  var calculaPosicao = function (str, numDigitos) {
    var len = str.length;
    if (numDigitos == 0) return 0;
    if (numDigitos >= len) return len;
    var digitoAtual = 0;
    for (var a = 0; a < len; a++) {
      if (digitoRegex.test(str.charAt(a))) digitoAtual++;
      if (digitoAtual == numDigitos) return a + 1;
    }
    return len;
  };

  var changeSignal = function () {
    strFmt = strFmt.length > 0 && strFmt.charAt(0) == '-' ? strFmt.substring(1) : '-' + strFmt;
  };

  //conta digitos
  var aplicarAlteracoes;
  aplicarAlteracoes = function () {
    strFinal=infraRemoverFormatacaoDecimal(strFinal,numDec);
    negativo = strFinal.charAt(0) == '-' ? 1:0;
    if (numTotal>0 && strFinal.length > numTotal + negativo) return false;

    input.value = infraAplicarFormatacaoDecimal(strFinal, numDec, milSep, decSep);
    if (selNova.start == null || selNova.end == null) {
      if (numDigitoAtual > strFinal.length && strFinal.length>numDec+negativo+1) numDigitoAtual = strFinal.length;
      selNova.start = selNova.end = calculaPosicao(input.value, numDigitoAtual);
    }
    infraSelecionarCampo(input, selNova.start, selNova.end);
  };

  digitoRegex = sinNegativo ? /[0-9-]/ : /[0-9]/;
  var possuiSelecao = selAtual.start != selAtual.end;

  //valida teclas
  if (ntecla >= 96 && ntecla <= 105 && e.type == 'keydown')  ntecla -= 48; //teclado numerico
  if (e.type == 'keydown' && (ntecla == 109 || ntecla == 189)) ntecla = 45; //tecla -
  var charCode = String.fromCharCode(ntecla);
  if (infraMascaraExcecao(e) && ntecla != 46 && ntecla != 8)  return true;
  if (!digitoRegex.test(charCode) && ntecla != 46 && ntecla != 8) return false; // Chave invalida
  if (ntecla == 46 || ntecla == 8) charCode = '';

  if (ntecla == 45) {
    if (negativo) {
      strFinal = strNFmt.substring(1);
      selNova.start = (selAtual.start == 0 ? 0 : selAtual.start - 1);
      selNova.end = (selAtual.end == 0 ? 0 : selAtual.end - 1);
    } else {
      strFinal = '-' + strNFmt;
      selNova.start = selAtual.start + 1;
      selNova.end = selAtual.end + 1;
    }
    aplicarAlteracoes();
    return false;
  }
  var append = true;
  var numDigitoAtual;
  if (selAtual.end != strFmt.length) {
    append = false;
    numDigitoAtual = contaDigitos(strFmt, selAtual.start);
  } else numDigitoAtual = contaDigitos(strFmt, selAtual.end);
  if (!possuiSelecao && ntecla == 46) //del
  {
    strFinal = strNFmt.substring(0, numDigitoAtual) + strNFmt.substring(numDigitoAtual + 1);
    if (strFinal.length==numDec+negativo) numDigitoAtual++;
    aplicarAlteracoes();
    return false;
  }
  if (!possuiSelecao && ntecla == 8) //backspace
  {
    strFinal = strNFmt.substring(0, numDigitoAtual - 1) + strNFmt.substring(numDigitoAtual);
    if (strFinal.length > (numDec + negativo) || (negativo == 1 && selAtual.start == 1)) numDigitoAtual--;
    aplicarAlteracoes();
    return false;
  }
  if (selAtual.start == negativo && charCode == '0' && strNFmt.length > negativo) return false; //zero a esquerda
  if (selAtual.end == 0 && negativo == 1) return false; //digito a esquerda do sinal negativo
  if (possuiSelecao) append = false;
  if (!append) {
    var numdigadir = strNFmt.length - contaDigitos(strFmt, selAtual.end);
    strFmt = strFmt.substring(0, selAtual.start) + charCode + strFmt.substring(selAtual.end);
    strFinal = infraRemoverFormatacaoDecimal(strFmt,numDec);
    if (strFinal.length > numDec + negativo + 1 && charCode != '') numDigitoAtual++;
    else selNova.start = selNova.end = strFinal.length - numdigadir + 1;
    aplicarAlteracoes();
    return false;
  }
  if (append) {
    strFinal = strNFmt + charCode;
    numDigitoAtual = strFinal.length > (numDec + negativo + 1) ? strFinal.length : numDec + negativo + 1;
  }
  //***************************
  aplicarAlteracoes();
  return false;
}

function infraAplicarFormatacaoDecimal(str,casas, milSep, decSep){
	if (str=='' || str=='-') return str;
	if(!casas) casas=2;
	var ret=infraTrim(str)||'';
	var negativo=(str.charAt(0)=='-');
	if(negativo) ret=ret.substring(1);

	var size=ret.length;
	if (size<=casas){
		for(var a=casas-size+1;a>0;a--) ret='0'+ret;
		size=casas+1;
	}
	var i=size-casas;
	ret=ret.substr(0,i)+decSep+ret.substring(i);
	i-=3;
	for(;i>0;i-=3)
		ret=ret.substr(0,i)+milSep+ret.substring(i);
	if (negativo) ret='-'+ ret;
  return ret;
}

function infraRemoverFormatacaoDecimal(str,numDec) {
  if (str=='' || str=='-') return str;
  var ret=str.replace(/\.|,/g,'');
  var negativo=(str.charAt(0)=='-');
  if(negativo) ret=ret.substring(1);
  var ret=/[0]*([1-9]\d*)/.exec(ret);
  ret=ret?ret[1]:'0';
  if(typeof numDec=='undefined') numDec=0;
  for (var a=ret.length;a<=numDec;a++) ret='0'+ret;
  if (negativo) ret='-'+ret;
  return ret;
}

function infraValidaDataHora(objeto){
  return infraValidarDataHora(objeto);
}

function infraValidarDataHora(objeto){

  var temp = null;

  if (typeof(objeto) == 'object'){
	temp = objeto.value;
  }else{
	temp = objeto;
  }

  temp = temp.split(" ");

  var data = '';
  var hora = '';
  if (temp[0]!=undefined){
	data = temp[0];
  }

  if (temp[1]!=undefined){
	hora = temp[1];
  }

  if(infraValidarData(data)&&infraValidarHora(hora)){
    return true;
  }else{
    return false;
  }
}

function infraValidaHora(objeto){
  return infraValidarHora(objeto);
}

function infraValidarHora(objeto){

  if (objeto==null){
	return true;
  }

  var temp = null;

  if (typeof(objeto) == 'object'){
	temp = objeto.value;
  }else{
	temp = objeto;
  }
  if (temp != ''){
	  temp = temp.split(":");

	  var hora = temp[0];
	  var min = temp[1];
	  var sec = temp[2];

	  if(hora>23||hora<0){
	    alert("Hora "+hora+" inválida [0 a 23].");
	    return false;
	  }

	  if(min>59||min<0){
	    alert("Minutos "+min+" inválidos [0 a 59].");
	    return false;
	  }

	  if(sec>59||sec<0){
	    alert("Segundos "+sec+" inválidos [0 a 59].");
	    return false;
	  }
  }
  return true;
}

function infraValidaData(objeto){
  return infraValidarData(objeto);
}

function infraValidarData(objeto){

  if (objeto==null){
    return true;
  }

  var strdata = null;

  if (typeof(objeto) == 'object'){
	strdata = objeto.value;
  }else{
	strdata = objeto;
  }

  if(strdata != ''){
    // Verifica a quantidade de digitos informada esta correta.
    if (strdata.length != 10){
      alert('Formato de data inválido.');
      if (typeof(objeto) == 'object') objeto.focus();
      return false
    }
    // Verifica máscara da data
    if ('/' != strdata.substr(2,1) || '/' != strdata.substr(5,1)){
      alert('Formato de data inválido.');
      if (typeof(objeto) == 'object') objeto.focus();
      return false
    }

    var dia = strdata.substr(0,2)
    var mes = strdata.substr(3,2);
    var ano = strdata.substr(6,4);

    // Verifica o dia
    if (isNaN(dia) || dia > 31 || dia < 1){
      alert('Formato do dia inválido.');
      if (typeof(objeto) == 'object') objeto.focus();
      return false
    }

    if (mes == 4 || mes == 6 || mes == 9 || mes == 11){
      if (dia == '31'){
        alert('O mês informado não possui 31 dias.');
        if (typeof(objeto) == 'object') objeto.focus();
        return false
      }
    }

    if (mes == '02'){
      var bissexto = 0;

			if (ano % 400 == 0){
			  bissexto = 1;
			}else if (ano % 100 == 0){
			  bissexto = 0;
			}else if (ano % 4 == 0){
			  bissexto = 1;
			}else {
			  bissexto = 0;
			}

      if (bissexto == 1){
        if (dia > 29){
          alert('O mês informado possui somente 29 dias.');
          if (typeof(objeto) == 'object') objeto.focus();
          return false
        }
      }else{
        if (dia > 28){
          alert('O mês informado possui somente 28 dias.');
          if (typeof(objeto) == 'object') objeto.focus();
          return false
        }
      }
    }

    // Verifica o mês
    if (isNaN(mes) || mes > 12 || mes < 1){
      alert('Formato do mês inválido.');
      if (typeof(objeto) == 'object') objeto.focus();
      return false
    }

    // Verifica o ano
    if (isNaN(ano)){
      alert('Formato do ano inválido.');
      if (typeof(objeto) == 'object') objeto.focus();
      return false
    }

    if (ano<1800 || ano>3000){
      alert('Ano inválido.');
      if (typeof(objeto) == 'object') objeto.focus();
      return false
    }
  }
  return true;
}

function infraCompararDatas(strDataIni, strDataFim){

  if (infraTrim(strDataIni)=='' || infraTrim(strDataFim)==''){
    return null;
  }

  if (strDataIni.length != 10 || strDataFim.length != 10){
    return null;
  }

  var date1 = strDataIni.split('/');
  var date2 = strDataFim.split('/');
  var iniDate = new Date(date1[1]+'/'+date1[0]+'/'+date1[2]);
  var fimDate = new Date(date2[1]+'/'+date2[0]+'/'+date2[2]);

  return Math.round((fimDate-iniDate)/86400000);
}

function infraCompararDataHora(strDataHoraIni, strDataHoraFim){

  strDataHoraIni = infraTrim(strDataHoraIni);
  strDataHoraFim = infraTrim(strDataHoraFim);

  if ((strDataHoraIni.length != 10 && strDataHoraIni.length != 19) || (strDataHoraFim.length != 10 && strDataHoraFim.length != 19)){
    return null;
  }

  var dataIni = strDataHoraIni.split('/');
  var dataFim = strDataHoraFim.split('/');

  var horaIni = null;
  if (dataIni[2].length == 13){
    horaIni = dataIni[2].substr(5).split(':');
    dataIni[2] = dataIni[2].substr(0,4);
  }else{
    horaIni = Array(0,0,0);
  }

  var horaFim = null;
  if (dataFim[2].length == 13){
    var horaFim = dataFim[2].substr(5).split(':');
    dataFim[2] = dataFim[2].substr(0,4);
  }else{
    horaFim = Array(0,0,0);
  }


  // mês começa em zero
  dataIni[1]--;
  dataFim[1]--;

  var iniDate = new Date(dataIni[2],dataIni[1],dataIni[0],horaIni[0],horaIni[1],horaIni[2]);
  var fimDate = new Date(dataFim[2],dataFim[1],dataFim[0],horaFim[0],horaFim[1],horaFim[2]);

  return (fimDate-iniDate)/1000;
}

function infraDataAtual(){
  var d = new Date();
  var dia = (d.getDate()<10)?'0'+d.getDate():d.getDate();
  var mes = ((d.getMonth()+1)<10)?'0'+(d.getMonth()+1):(d.getMonth()+1);
  return  dia+'/'+mes+'/'+d.getFullYear();
}

function infraDataHoraAtual(){
  var d = new Date();
  var dia = (d.getDate()<10)?'0'+d.getDate():d.getDate();
  var mes = ((d.getMonth()+1)<10)?'0'+(d.getMonth()+1):(d.getMonth()+1);
  var hor = (d.getHours()<10)?'0'+d.getHours():d.getHours();
  var min = (d.getMinutes()<10)?'0'+d.getMinutes():d.getMinutes();
  var seg = (d.getSeconds()<10)?'0'+d.getSeconds():d.getSeconds();

  return  dia+'/'+mes+'/'+d.getFullYear()+' '+hor+':'+min+':'+seg;
}

function infraFormatarTimestamp(timestamp){
	var result="",x=0;
	if (timestamp>=86400) {
		x=Math.floor(timestamp/86400);
		result=x+"d ";
		timestamp%=86400;
	}
	if (timestamp>=3600){
		x=Math.floor(timestamp/3600);
		result+=(x<10?"0"+x.toString():x)+"h ";
		timestamp%=3600;
	}
	if (timestamp>=60){
		x=Math.floor(timestamp/60);
		result+=(x<10?"0"+x.toString():x)+"m ";
		timestamp%=60;
	}
	if (timestamp>0){
		result+=(timestamp<10?"0"+timestamp.toString():timestamp)+"s ";
	}
	return result;
}

function infraGerarArrayItensSelecionados(){
  var vetOptions = Array();
  infraNroItens = document.getElementById('hdnInfraNroItens').value;
  var i;
  var j = 0;
  for (i=0; i < infraNroItens; i++) {
    box = document.getElementById('chkInfraItem'+i);
    if ( box!=null && box.checked ) {
      vetOptions[j++]=new Option(box.title, box.value);
    }
  }
  return vetOptions;
}



function infraTransportarItem(n){
  var box = document.getElementById('chkInfraItem'+n);
  if (box==null){
    alert('Item não encontrado.');
    return;
  }
  infraTransportarSelecao(box);
}

function infraTransportarSelecao(item){

  if (window.dialogArguments) {
    window.opener = window.dialogArguments;
  }

  var infraNroItens = document.getElementById('hdnInfraNroItens');

  if (infraNroItens==null){
    alert('Não existem itens para executar a ação.');
    return;
  }

  if (item==undefined && infraNroItens.value==0){
    alert('Nenhum item novo foi selecionado.');
    return;
  }

  var idObject = document.getElementById('hdnInfraSelecaoIdObject');

  if ((idObject!=null && idObject.value!='')){

    var obj = eval('window.opener.'+idObject.value);

    if (obj.Type == 'infraLupaText'){

      var temp = null;
      if (item!=undefined){
        temp = item;
      }else{
        var infraNroItens = document.getElementById('hdnInfraNroItens').value;
        for (var i=0; i < infraNroItens; i++) {
          var box = document.getElementById('chkInfraItem'+i);
          if ( box!=null && box.checked ) {
            temp = box;
            break;
          }
        }
      }

      if (obj.processarSelecao(temp)){
        infraTableToHiddenText(obj.hdn.id,obj.txt.id, item);
        window.close();
        obj.finalizarSelecao();
      }

      window.focus();

    }else if (obj.Type == 'infraLupaTable'){

        var temp = null;
        if (item!=undefined){
          temp = new Array(item);
        }else{
          temp = new Array();
          var j = 0;
          var infraNroItens = document.getElementById('hdnInfraNroItens').value;
          for (var i=0; i < infraNroItens; i++) {
            box = document.getElementById('chkInfraItem'+i);
            if (box!=null && box.checked && !box.disabled) {
              temp[j++] = box;
            }
          }
        }

        if (obj.processarSelecao(temp)){

          var n = infraTableToTable(obj, item);

          //obj.atualizar();

          if (n==0){
            alert('Nenhum item foi transportado.');
          }

          obj.finalizarSelecao();

          if (item!=undefined){
            window.close();
          }
        }


    }else{

      var temp = null;
      if (item!=undefined){
        temp = new Array(item);
      }else{
        temp = new Array();
        var j = 0;
        var infraNroItens = document.getElementById('hdnInfraNroItens').value;
        for (var i=0; i < infraNroItens; i++) {
          box = document.getElementById('chkInfraItem'+i);
          if (box!=null && box.checked && !box.disabled) {
            temp[j++] = box;
          }
        }
      }

      if (obj.processarSelecao(temp)){
        var n = infraTableToSelect(obj.sel.id, item);
        obj.atualizar();

        if (n==0){
          alert('Nenhum item foi transportado.');
        }

        obj.finalizarSelecao();

        if (item!=undefined){
          window.close();
        }
      }
    }
  }

  var idSelect = document.getElementById('hdnInfraSelecaoIdSelect');

  if (idSelect!=null && idSelect.value!=''){

    var n = infraTableToSelect(idSelect.value, item);
    if (idHidden!=null && idHidden.value!=''){
       var objSelect = new Object(window.opener.document.getElementById(idSelect.value));
       var objHidden = new Object(window.opener.document.getElementById(idHidden.value));
       infraSelectConcatenarItens(objSelect,objHidden);
    }

    if (n==0){
      alert('Nenhum item foi transportado.');
    }

    if (item!=undefined){
      window.close();
    }

    return;
  }

  var idHidden = document.getElementById('hdnInfraSelecaoIdHidden');
  var idText = document.getElementById('hdnInfraSelecaoIdText');

  if (idHidden!=null && idHidden.value!='' && idText!=null && idText.value!=''){
    infraTableToHiddenText(idHidden.value,idText.value, item);
    window.close();
    return;
  }

  var idTextArea = document.getElementById('hdnInfraSelecaoIdTextArea');

  if (idTextArea!=null && idTextArea.value!=''){
    infraTableToTextArea(idTextArea.value, item);
    window.close();
    return;
  }
}

function infraHiddenTableToTable(objInfraLupaTable) {

  if (window.dialogArguments) {
    window.opener = window.dialogArguments;
  }

  var objTable = new Object(window.opener.document.getElementById(objInfraLupaTable.tbl.id));

  var objInfraNroItens = document.getElementById('hdnInfraNroItens');
  if (objInfraNroItens!=null){
    var infraNroItens = objInfraNroItens.value;
    for (var i=0; i < infraNroItens; i++) {
      box = document.getElementById('chkInfraItem'+i);
      for (j = 0; j < objTable.rows.length; j++) {

	  	  if ( box!=null && box.value == String(infraTrim(objInfraLupaTable.objInfraTabelaDinamica.lerCelula(objTable.rows[j].cells[0]))) ) {
		    box.checked=true;
		    infraFormatarTrMarcada(box.parentNode.parentNode);

			if (box.type=="checkbox"){
			  box.disabled=true;
			}

			// novo
			// opt.text = box.title;

			var acao = document.getElementById('lnkInfraT-'+box.value);
			if (acao!=null){
			  acao.style.visibility = 'hidden';
			}

			break;
	      }
      }
    }
    infraSelecionarItens();
  }
}


function infraReceberSelecao(){
  var idObject = document.getElementById('hdnInfraSelecaoIdObject');
  if (idObject!=null && idObject.value!=''){
	var obj = eval('window.opener.'+idObject.value);
    if (obj.Type=='infraLupaText'){
      infraHiddenTextToTable(obj.hdn.id,obj.txt.id);
    }else if (obj.Type=='infraLupaTable'){
      infraHiddenTableToTable(obj);
    }else{
      infraSelectToTable(obj.sel.id);
    }
    return;
  }

  var idSelect = document.getElementById('hdnInfraSelecaoIdSelect');

  if (idSelect!=null && idSelect.value!=''){
    infraSelectToTable(idSelect.value);
    return;
  }

  var idHidden = document.getElementById('hdnInfraSelecaoIdHidden');
  var idText = document.getElementById('hdnInfraSelecaoIdText');

	if (idHidden!=null && idHidden.value!='' && idText!=null && idText.value!=''){
    infraHiddenTextToTable(idHidden.value,idText.value);
    return;
  }
}

function infraEfeitoImagens(){

  return;

  /*
	 * var imagens = document.images; for(i=0;i<imagens.length;i++){ if
	 * (imagens[i].className=='infraImgNormal'){
	 * imagens[i].onmouseover=function(){this.className='infraImgOpaca';};
	 * imagens[i].onmouseout=function(){this.className='infraImgNormal';};
	 * //imagens[i].onfocus=function(){this.className='infraImgOpaca'}; } }
	 */
}

function infraGetAnchor(){
  var strAnchor = null;
  var url = document.location;
  var arrUrl = url.toString().split('#');
  if(arrUrl.length > 1){
    strAnchor = arrUrl[1];
  }
  return strAnchor;
}

function infraPosicionarTrAcessada(tr){

  if (tr!=null){

    var arr = tr.getElementsByTagName('input');

    if (arr.length>0){
      if (arr[0].type=='checkbox'){
        if (arr[0].id!=''){

          var el = arr[0];
        	var y = 0;
        	while (el.offsetParent && el.tagName.toUpperCase() != 'BODY'){
        		y += el.offsetTop;
        		el = el.offsetParent;
        	}
        	y += el.offsetTop;

        	var tamanhoTela = infraClientHeight();

        	// se o elemento esta fora da área de tela
        	if ((y+50) > tamanhoTela){
        	  if (INFRA_IE == 0){
        	    window.scrollTo(0,(y - (tamanhoTela/3)));
        	  }else{
        	    self.setTimeout('window.scrollTo(0,'+(y - (tamanhoTela/3))+');',100);
        	  }
        	}

        	if (arr[0].parentNode.style.display!='none' && arr[0].parentNode.style.visibility!='hidden' && !arr[0].disabled && arr[0].style.display!='none' && arr[0].style.visibility!='hidden'){
	          	if (INFRA_IE==0){
	          	  document.getElementById(arr[0].id).focus();
	          	}else{
	          	  self.setTimeout('document.getElementById(\''+arr[0].id+'\').focus();',200);
	          	}
        	}
        }
      }
    }
  }
}

function infraFormatarTrAcessada(tr){

  var css = tr.className;

  if (css.indexOf('infraTrClara')>-1){
    tr.className = 'infraTrClara';
  }else if(css.indexOf('infraTrEscura')>-1){
    tr.className = 'infraTrEscura';
  }

  tr.className += ' infraTrAcessada';

  if (typeof(tr.onacessada)=='function'){
    tr.onacessada();
  }
}

function infraFormatarTrMarcada(tr){
  var css = tr.className;
  if (css.indexOf('infraTrClara')>-1){
    tr.className = 'infraTrClara';
  }else if(css.indexOf('infraTrEscura')>-1){
    tr.className = 'infraTrEscura';
  }

  tr.className += ' infraTrMarcada';

  if (typeof(tr.onmarcada)=='function'){
    tr.onmarcada();
  }
}

function infraFormatarTrDesmarcada(tr){
  if (tr.className == 'infraTrMarcada') {
    tr.className = ''  ;
  }else{
    tr.className = tr.className.split(' ')[0];
  }

  if (typeof(tr.ondesmarcada)=='function'){
    tr.ondesmarcada();
  }
}

function infraEfeitoTabelas(){

  var i,j;
  var tabs = document.getElementsByTagName("table");

  for(i=0;i<tabs.length;i++){

    // Adiciona eventos para modificar a linha com o passar do mouse
    var trs = tabs[i].getElementsByTagName("tr");
    var bolInfraTable = false;

    if (tabs[i].className.indexOf('infraTable') > -1){
      bolInfraTable = true;
    }

    for(j=0;j<trs.length;j++){

      if (bolInfraTable){

        if (trs[j].className=='infraTrClara' || trs[j].className=='infraTrEscura'){
          trs[j].onmouseover=function(){
            if (this.className.indexOf('infraTrSelecionada')==-1){
              this.className = 'infraTrSelecionada '+this.className;
            }
          };
        }

        if (trs[j].className=='infraTrClara'){
          trs[j].onmouseout=function(){
            var c = this.className;

            this.className = 'infraTrClara';

            if (c.indexOf('infraTrAcessada')>-1){
              this.className += ' infraTrAcessada';
            }

            if (c.indexOf('infraTrMarcada')>-1){
              this.className += ' infraTrMarcada';
            }
          };
        }else if (trs[j].className=='infraTrEscura'){
          trs[j].onmouseout=function(){
            var c = this.className;

            this.className = 'infraTrEscura';

            if (c.indexOf('infraTrAcessada')>-1){
              this.className += ' infraTrAcessada';
            }

            if (c.indexOf('infraTrMarcada')>-1){
              this.className += ' infraTrMarcada';
            }
          };
        }
      }

      var arr = trs[j].getElementsByTagName('input');
      if (arr.length>0 && arr[0].type=='checkbox' && arr[0].checked){
        if (trs[j].className.indexOf('infraTrMarcada')==-1){
          trs[j].className += ' infraTrMarcada';
        }
      }
    }
  }

  var ancora = infraGetAnchor();

  var selecoes = '';
  if (document.getElementById('hdnInfraSelecoes')!=null){
    selecoes = document.getElementById('hdnInfraSelecoes').value;
  }

  if (selecoes != ''){
    var arrSelecoes = selecoes.split(',');

    // Se tem ancora, muda classe CSS da linha correspondente
    if (ancora!=null){
      ancora = ancora.replace('ID-','');

      var arr = ancora.split(',');

      if (arr.length>1){

        // Procura em todas as seleções da página
      	for(var i=0;i<arrSelecoes.length;i++){
      	  for (var j=0; j<arr.length;j++){
            var infraAncora = document.getElementById('lnk' + arrSelecoes[i] + 'ID-' + arr[j]);
            if(infraAncora!=null){
              if (infraAncora.parentNode!=null){
                var tr = infraAncora.parentNode.parentNode;
                if (tr!=null){
                  infraFormatarTrAcessada(tr);
                }
              }
            }
          }
      	}
      }

      // Procura em todas as seleções da página
    	for(var i=0;i<arrSelecoes.length;i++){
        var infraAncora = document.getElementById('lnk' + arrSelecoes[i] + 'ID-' + arr[0]);
        if(infraAncora!=null){
          if (infraAncora.parentNode!=null){
            var tr = infraAncora.parentNode.parentNode;
            if (tr!=null){
              infraFormatarTrAcessada(tr);
              infraPosicionarTrAcessada(tr);
              break;
            }
          }
        }
    	}

    }else{

      for(var i=0;i<arrSelecoes.length;i++){


        var nroItensSelecao = 0;
        if (document.getElementById('hdn'+arrSelecoes[i]+'NroItens')!=null){
          nroItensSelecao = document.getElementById('hdn'+arrSelecoes[i]+'NroItens').value;
        }

        if (nroItensSelecao > 0){
          var itemId = '';

          if (document.getElementById('hdn'+arrSelecoes[i]+'ItemId')!=null){
            itemId = document.getElementById('hdn'+arrSelecoes[i]+'ItemId').value;
          }

          // se alguma seleção possui valor no campo de ID individual
          if (itemId != ''){
            for (var j=0; j<nroItensSelecao; j++) {
              box = document.getElementById('chk'+arrSelecoes[i]+'Item'+j);
              if (box!=null && !box.disabled && itemId==box.value){
                var tr = box.parentNode.parentNode;
                infraFormatarTrAcessada(tr);
                infraPosicionarTrAcessada(tr);
                break;
              }
            }
          // posiciona no primeiro check marcado que encontrar
          }else {
            // marca todos os itens
            for (var j=0; j<nroItensSelecao; j++) {
              box = document.getElementById('chk'+arrSelecoes[i]+'Item'+j);
              if (box!=null && box.checked){
                // alert(arrSelecoes[i]);
                infraFormatarTrMarcada(box.parentNode.parentNode);
              }
            }
            for (var j=0; j<nroItensSelecao; j++) {
              box = document.getElementById('chk'+arrSelecoes[i]+'Item'+j);
              if (box!=null && !box.disabled && box.checked){
                infraPosicionarTrAcessada(box.parentNode.parentNode);
                break;
              }
            }
          }
        }
      }
    }
  }
}


// Utilizar no onkeydown
function infraLimitarCaracteres(evt,obj,max) {
  var mensagem = obj;

  if (infraMascaraExcecao(evt)){
    return true;
  }

  var iTotal;
  var iAux;
  var qtdeChar = 0;

  qtdeChar = max;

  var key = infraGetCodigoTecla(evt);

  iTotal = mensagem.value.length;
  if (key == 8) {
    iAux = iTotal - 1;
  } else {
    iAux = iTotal + 1;
  }

  if(iTotal > (qtdeChar-1) && key != 8 && key != 46) { return false; }

  if (iAux >= 0) return true;
}


function infraSelecaoMultipla(nomeSelecao) {
  if (nomeSelecao==undefined){
    nomeSelecao='Infra';
  }

  var nomeHdnNroItens = 'hdn'+nomeSelecao+'NroItens';
  var nomeImg = 'img'+nomeSelecao+'Check';
  var nomeChk = 'chk'+nomeSelecao+'Item';

  infraNroItens = document.getElementById(nomeHdnNroItens);
  infraCheck = document.getElementById(nomeImg);

  if (infraCheck.title == 'Selecionar Tudo') {

    for (var i=0; i<infraNroItens.value; i++) {
      box = document.getElementById(nomeChk+i);
      if (box!=null && !box.disabled){
        box.checked = true;
        infraFormatarTrMarcada(box.parentNode.parentNode);
      }
    }
    infraCheck.title = 'Remover Seleção';
    infraCheck.alt = 'Remover Seleção';
  }else{
    infraSelecaoLimpar(nomeSelecao);
    infraCheck.title = 'Selecionar Tudo';
    infraCheck.alt = 'Selecionar Tudo';
  }

  infraSelecionarItens(null,nomeSelecao);
}


function infraSelecaoLimpar(nomeSelecao) {
  if (nomeSelecao==undefined){
    nomeSelecao='Infra';
  }

  var nomeHdnNroItens = 'hdn'+nomeSelecao+'NroItens';
  var nomeChk = 'chk'+nomeSelecao+'Item';

  infraNroItens = document.getElementById(nomeHdnNroItens);
  for (var i=0; i<infraNroItens.value; i++) {
    box = document.getElementById(nomeChk+i);
    if (box!=null && !box.disabled){
      box.checked = false;
      infraFormatarTrDesmarcada(box.parentNode.parentNode);

      // box.parentNode.parentNode.className =
		// box.parentNode.parentNode.className.split(' ')[0];
    }
  }
  infraSelecionarItens(null,nomeSelecao);
}


function infraSelecionarItens(objCheck,nomeSelecao) {

  if (objCheck==undefined){
    objCheck=null;
  }

  if (nomeSelecao==undefined){
    nomeSelecao='Infra';
  }

  nomeHdnSelecionados = 'hdn'+nomeSelecao+'ItensSelecionados';
  nomeHdnNroItens = 'hdn'+nomeSelecao+'NroItens';
  nomeImg = 'img'+nomeSelecao+'Check';
  nomeChk = 'chk'+nomeSelecao+'Item';

  infraNroItens = document.getElementById(nomeHdnNroItens);
  infraItensSelecionados = document.getElementById(nomeHdnSelecionados);

  if(objCheck==null){
    temp = '';
    for (var i=0; i<infraNroItens.value; i++) {
      objCheck = document.getElementById(nomeChk+i);
      if(objCheck!=null && objCheck.checked){
        if ( temp != '') {
          temp = temp.concat(',');
        }
        temp = temp.concat(objCheck.value);
      }
    }
  }else{

	var temp = infraItensSelecionados.value;

    if (objCheck.type=='radio'){
      // tira marcação das linhas
      for (var i=0; i<infraNroItens.value; i++) {
        box = document.getElementById(nomeChk+i);
        if(box!=null && !box.checked){
          infraFormatarTrDesmarcada(box.parentNode.parentNode);
          // box.parentNode.parentNode.className =
			// box.parentNode.parentNode.className.split(' ')[0];
        }
      }
      temp = '';
    }

    if(objCheck.checked){
      infraFormatarTrMarcada(objCheck.parentNode.parentNode);

      if(temp!=""){
        temp = temp.concat(',');
      }
      temp = temp.concat(objCheck.value);

    }else{

      if (objCheck.type='checkbox'){
        infraFormatarTrDesmarcada(objCheck.parentNode.parentNode);
        // objCheck.parentNode.parentNode.className =
		// objCheck.parentNode.parentNode.className.split(' ')[0];
      }

      var sel = temp.split(",");
      temp="";

      for(var i=0;i<sel.length;i++){
        if(sel[i]!=objCheck.value){
          if(temp != ""){
            temp = temp.concat(',');
          }
          temp = temp.concat(sel[i]);
        }
      }
    }

  }
  infraItensSelecionados.value=temp.toString();
}



function infraGetCodigoTecla(ev){
  if (window.event){
    return window.event.keyCode;
  } else if (ev) {
    return (ev.which) ? ev.which : ev.keyCode;
  }
};

function infraGetFonteEvento(ev)
{
	if(ev){
		return ev.target;
	}

	if(window.event){
		return window.event.srcElement;
	}
};

function infraCancelarEvento(ev)
{
	if(ev)			// Moz
	{
		ev.preventDefault();
		ev.stopPropagation();
	}
	if(window.event)	// IE
	{
		window.event.returnValue = false;
	}
}

function infraFormatarProcessoTrf4(pProcesso){
    var processo = infraRetirarFormatacao(pProcesso);

    if (processo.length==0){
      return '';
    }

    if (processo.length==10){
     reProc  = /(\d{2})(\d{2})(\d{5})(\d{1})$/;
     processo = processo.replace(reProc, "$1.$2.$3-$4");
    }else if (processo.length==20){
      processo = infraLPad(processo, 20, '0');
      reProc  = /(\d{7})(\d{2})(\d{4})(\d{3})(\d{4})$/;
      processo = processo.replace(reProc, "$1-$2.$3.$4.$5");
     }else{
       processo = infraLPad(processo, 15, '0');
       reProc  = /(\d{4})(\d{2})(\d{2})(\d{6})(\d{1})$/;
       processo = processo.replace(reProc, "$1.$2.$3.$4-$5");
    }
    return processo;
}



function infraFormatarCpf(pCpf){
	var numero = infraRetirarFormatacao(pCpf);
	numero = infraLPad(numero, 11, '0');
	reCpf  = /(\d{3})(\d{3})(\d{3})(\d{2})$/;
	numero = numero.replace(reCpf, "$1.$2.$3-$4");
	return numero;
}


function infraFormatarCnpj(pCnpj){
  var numero = infraRetirarFormatacao(pCnpj);
	numero = infraLPad(numero, 14, '0');
	reCnpj = /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
	numero = numero.replace(reCnpj, "$1.$2.$3/$4-$5");
	return numero;
}

function infraValidarCpf(pCpf){

  var numero = infraRetirarFormatacao(pCpf);

  if (numero.length > 11) return false;

  // if (!infraIsNumber(numero)) return false;

	var base = numero.substring(0, numero.length - 2);
	var algUnico;
	var i, j, k, soma, dv;
	var calculado = infraLPad(base, 11, '0');
	calculado = calculado.substring(2, 11);
	var digitos = '';
	for (j = 1; j <= 2; j++){
		k = 2;
		soma = 0;
		for (i = calculado.length-1; i >= 0; i--)	{
			soma += (calculado.charAt(i) - '0') * k;
			k = (k-1) % 11 + 2;
		}
		dv = 11 - soma % 11;
		if (dv > 9) dv = 0;
		calculado += dv;
		digitos += dv
	}

	// Valida dígitos verificadores
	if (numero != base + digitos) return false;

	// Não serão considerados válidos os seguintes CPF:
	// 000.000.000-00, 111.111.111-11, 222.222.222-22, 333.333.333-33,
	// 444.444.444-44,
	// 555.555.555-55, 666.666.666-66, 777.777.777-77, 888.888.888-88,
	// 999.999.999-99.

	algUnico = true;
	for (i=1; i<11; i++){
		algUnico = algUnico && (numero.charAt(i-1) == numero.charAt(i));
	}
	return (!algUnico);
}


function infraValidarCnpj(pCnpj){

  var numero = infraRetirarFormatacao(pCnpj);

  if (numero.length > 14) return false;

  // if (!infraIsNumber(numero)) return false;

	var base = numero.substring(0, 8);
	var ordem = numero.substring(8, 12);
	var i, j, k, soma, dv;
	var calculado = infraLPad(base+ordem, 14, '0');
	calculado = calculado.substring(2, 14);
	var digitos = '';

	for (j = 1; j <= 2; j++){
		k = 2;
		soma = 0;
		for (i = calculado.length-1; i >= 0; i--)	{
			soma += (calculado.charAt(i) - '0') * k;
			k = (k-1) % 8 + 2;
		}
		dv = 11 - soma % 11;
		if (dv > 9) dv = 0;
		calculado += dv;
		digitos += dv
	}

	var algUnico;

	// Valida dígitos verificadores
	if (numero != base + ordem + digitos) return false;

	// Não serão considerados válidos os CNPJ com os seguintes números BÁSICOS:
	// 11.111.111, 22.222.222, 33.333.333, 44.444.444, 55.555.555,
	// 66.666.666, 77.777.777, 88.888.888, 99.999.999.

	algUnico = numero.charAt(0) != '0';
	for (i=1; i<8; i++){
		algUnico = algUnico && (numero.charAt(i-1) == numero.charAt(i));
	}

	if (algUnico) return false;

	// Não será considerado válido CNPJ com número de ORDEM igual a 0000.
	// Não será considerado válido CNPJ com número de ORDEM maior do que 0300
	// e com as três primeiras posições do número BÁSICO com 000 (zeros).
	// Esta crítica não será feita quando o no BÁSICO do CNPJ for igual a
	// 00.000.000.


	if (ordem == "0000") return false;

	return (base == "00000000" || parseInt(ordem, 10) <= 300 || base.substring(0, 3) != "000");
}

function infraImprimirTabela(bolOcultarColunaCheck, cabecalhosExtras){
	  var numSelecionados = 0;
	  var bolRemoverCheck = false;
	  var bolRemoverAcoes = false;
	  var div = document.getElementById('infraDivImpressao');

	  if (document.getElementById('hdnInfraNroItens')!=null){
	    numSelecionados = infraNroItensSelecionados();
	    if (numSelecionados==0){
	      alert('Nenhum registro selecionado.');
	      return;
	    }
	  }

	  //insere cabeçalhos extras (string contendo nomes de divs separados por ";")
	  var titulos = '';
	  if(cabecalhosExtras != undefined && cabecalhosExtras.length > 0){
	          var arrCabecalhoExtra = cabecalhosExtras.split(';');
	          for(i=0; i < arrCabecalhoExtra.length; i++){
	        	   if (titulos!=''){
	        		   titulos += '<br />';
	        	   }
	               titulos = titulos + '<div class="infraTituloImprimirTabela">' + arrCabecalhoExtra[i] + '</div>';
	          }
	  }

	  div.innerHTML = titulos + document.getElementById('divInfraAreaTabela').innerHTML;

	  if (numSelecionados>0){

	    var tab = div.getElementsByTagName('table');

	    if (tab.length>0){
	      infraAtualizarCaption(tab[0],numSelecionados);
	    }
	  }

	  // Pega checks da div original porque os copiados não contem informação de
	        // seleção
	  boxs = document.getElementById('divInfraAreaTabela').getElementsByTagName("input");

	  document.getElementById('divInfraAreaGlobal').style.display='none';

	  ths = document.getElementById('infraDivImpressao').getElementsByTagName("th");

	  if (ths.length>0){

	    if (bolOcultarColunaCheck==undefined || bolOcultarColunaCheck==true){
	      bolRemoverCheck = true;
	      for(i=0;i<ths.length;i++){
	        // Verifica se é o check box da infra e apaga o TH
	        img = ths[i].getElementsByTagName("img");
	        if (img.length>0){
	          if (img[0].id=='imgInfraCheck'){
	            ths[i].style.display='none';
	          }
	        }
	      }
	    }


	    // Apaga todos os THs de ações
	    for (i=0;i < ths.length;i++){
	      // Se a ultima coluna é de ações
	      if (infraTrim(ths[i].innerHTML)=='Ações'){
	        bolRemoverAcoes = true;
	        // Apaga coluna header
	        ths[i].style.display='none';
	      }
	    }

	    var classNameLinha = 'infraTrEscura';

	    if (bolRemoverCheck || bolRemoverAcoes){

	      // Apaga ultimos tds
	      trs = document.getElementById('infraDivImpressao').getElementsByTagName("tr");
	      for(i=0;i < trs.length;i++){

	        if (trs[i].className != 'infraTrOrdenacao'){

	          // alert(trs[i].parentNode.className + ':' + trs[i].innerHTML);

	          tds = trs[i].getElementsByTagName("td");
	          if (tds.length > 0){

	            // Pega check box da primeira coluna
	            box = tds[0].getElementsByTagName("input");
	            if (box.length > 0){
	              // Verifica se o checkbox original esta marcado
	              // ja que os checboxes copiados não levam esta informacao
	              for(j=0;j < boxs.length;j++){
	                if (boxs[j].id==box[0].id){
	                  if (!boxs[j].checked || boxs[j].disabled){
	                    // se não esta marcado apaga linha
	                    trs[i].style.display='none';
	                  }
	                  // Se ja achou o id não adianta continuar a varredura
	                  break;
	                }
	              }

	              if (trs[i].style.display!='none'){
	                trs[i].className = classNameLinha;
	                classNameLinha = (classNameLinha=='infraTrClara')?'infraTrEscura':'infraTrClara';
	              }

	              if (bolRemoverCheck){
	                // apaga coluna do checkbox
	                tds[0].style.display='none';
	              }
	            // apaga linhas onde a primeira coluna nao tem checkbox (exceto a
	                        // linha de cabecalho)
	            }else if (i > 0){
	              trs[i].style.display='none';
	            }

	            if (bolRemoverAcoes){
	              // apaga coluna de ações
	              tds[tds.length-1].style.display='none';
	            }
	          }
	        }else{

	          var tds = trs[i].getElementsByTagName("td");
	          for(k=0;k < tds.length;k++){
	            if (tds[k].className=='infraTdSetaOrdenacao'){
	              tds[k].style.display = 'none';
	            }
	          }

	        }
	      }
	    }
	  }

	  window.print();

	  // chama restauração via setTimeout para sincronizar a caixa de impressao
	  // no Firefox (mostrava a caixa depois que tinha restaurado)
	  self.setTimeout('infraRestaurarImpressao()', 1000);

	}

function infraImprimirDiv(div){
  document.getElementById('infraDivImpressao').innerHTML = document.getElementById(div).innerHTML;
  document.getElementById('divInfraAreaGlobal').style.display='none';
  window.print();
  // chama restauração via setTimeout para sincronizar a caixa de impressao
  // no Firefox (mostrava a caixa depois que tinha restaurado)
  self.setTimeout('infraRestaurarImpressao()', 1000);
}

function infraRestaurarImpressao(){
  document.getElementById('infraDivImpressao').innerHTML = '';
  document.getElementById('divInfraAreaGlobal').style.display='';
}


function infraProcessarMouseDown() {
  infraConfigurarMenu();
  document.onmousedown = infraMouseDown;
}

function infraMouseDown(evt){

  origem = infraGetFonteEvento(evt);

  if (!evt){
    evt = window.event;
  }

  // se clicou fora da area util não apaga
  // assim pode acessar a barra de rolagem
  if (evt.clientX < infraClientWidth()){
    infraApagarMenu();
    infraApagarMenuAcoes(origem);
    infraApagarBotaoMenu(origem);
  }

  if (INFRA_IE > 0 && INFRA_IE < 7){
    infraEsconderMostrarSelect("visible");
  }

  return true;
}

function infraVerificarProcessoTrf4(strProcesso){

  var ret = infraRetirarFormatacao(strProcesso);

  switch (ret.length) {
    // processos com 10 dígitos
    case 10:
      var mult = 1;
      var qtd = 9;
      break;

      // processos com 15 dígitos
    case 15:
      var mult = 7;
      var qtd = 14;
      break;

    case 20:
      var n = ret.substr(0,7);
      var dv = ret.substr(7,2);
      var a = ret.substr(9,4);
      var jtr = ret.substr(13,3);
      var o = ret.substr(16,4);
      var calc = (98-((((n%97)+a+jtr)%97)+o+'00')%97);
      if (dv == calc) {
        return true;
      }
      return false;
      break;

    default:
      return false;
  }

  var total = 0;
  for (var i = 0;i < qtd; i++) {
    total += ret.charAt(i) * mult;
    if (ret.length == 15){
      mult = (mult == 2 ? 9 : mult - 1);
    }else{
      mult++;
    }
  }
  var mod11 = total % 11;

  var dv = (mod11 < 10 ? mod11 : 0);

  if (ret.charAt(qtd)==dv){
    return true;
  }

  return false;
}

function infraRetirarFormatacao(str) {
  var str = infraTrim(str);

  if (infraIsNumber(str)){
    return str;
  }

  ret = '';
  for(var i=0;i<str.length;i++){
    if (infraIsNumber(str.charAt(i))){
      ret = ret.concat(str.charAt(i));
    }
  }
  return ret;
}


function infraLimitarTexto(obj,ev,qtd) {
  var BACKSPACE = 8;
  var TAB = 9;
	var ESC = 27;
	var KEYUP = 38;
	var KEYDN = 40;
	var KEYLEFT = 37;
	var KEYRIGHT = 39;
	var END = 35;
	var HOME = 36;
	var DEL = 46;
	// var ENTER = 13;

  var key = infraGetCodigoTecla(ev);

	switch(key){
	  case BACKSPACE:
		case ESC:
		case KEYUP:
		case KEYDN:
		case KEYLEFT:
		case KEYRIGHT:
		case TAB:
		case END:
		case HOME:
		case DEL:
		// case ENTER:

		  return true;

		default:
		  // alert(key);

		  if (obj.value.length >= qtd){

  		  if (ev.altKey){
  		    // alert('ALT');
  		    return true;
  		  }

  		  if (ev.ctrlKey) {
  		    // alert('CTRL');
  		    return true;
  		  }

  		  // if (ev.shiftKey) {
  		    // alert('SHIFT');
  		    // return false;
  		  // }

		    alert('Tamanho do campo excedido (máximo '+qtd+' caracteres).');
		    return false;
		  }

		  return true;
	}
}

function infraClientWidth() {
  return window.innerWidth ? window.innerWidth :
         document.documentElement ? document.documentElement.clientWidth :
         document.body ? document.body.clientWidth :
         window.screen.width;
}

function infraClientHeight() {
  return window.innerHeight ? window.innerHeight :
         document.documentElement ? document.documentElement.clientHeight :
         document.body ? document.body.clientHeight :
         window.screen.height;
}

/*
 * function infraClientWidth() { return infraClientScroll ( window.innerWidth ?
 * window.innerWidth : 0, document.documentElement ?
 * document.documentElement.clientWidth : 0, document.body ?
 * document.body.clientWidth : 0 ); }
 *
 * function infraClientHeight() { return infraClientScroll ( window.innerHeight ?
 * window.innerHeight : 0, document.documentElement ?
 * document.documentElement.clientHeight : 0, document.body ?
 * document.body.clientHeight : 0 ); }
 */

function infraScrollLeft() {
	return infraClientScroll (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}
function infraScrollTop() {
	return infraClientScroll (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}

function infraClientScroll(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

// Desabilita / abilita os botões das barras de comandos
function infraDesabilitarComandos(bolDisabled) {
  var i;
  var div;
  var arr;

  div = document.getElementById('divInfraBarraComandosSuperior');

  if (div!=null){
    arr = div.getElementsByTagName("button");
    for(i=0; i < arr.length; i++) {
     arr[i].disabled = bolDisabled;
    }
  }

  div = document.getElementById('divInfraBarraComandosInferior');

  if (div!=null){
    arr = div.getElementsByTagName("button");
    for(i=0; i < arr.length; i++) {
     arr[i].disabled = bolDisabled;
    }
  }
}

function infraAtualizarCaption(tab,num){
  if (tab != null){
    captions = tab.getElementsByTagName('caption');
    if (captions.length>0){

      if (num==undefined){
        num = tab.rows.length;

        // descartar TH
        // if (INFRA_XHTML == 0){
          num--;
        // }
      }

      str = new String(captions[0].innerHTML);

      for(i=0;i<str.length;i++){
        if (str.charAt(i)=='('){
          str = str.substr(0,i+1);
          str = str.concat(num);
          if (num==1){
            str = str.concat(' registro');
          }else{
            str = str.concat(' registros');
          }
          str = str.concat('):');
        }
      }
      captions[0].innerHTML = str;
    }
  }
}

String.prototype.infraReplaceAll = function(de, para){
  var str = this;
  var pos = str.indexOf(de);
  while (pos > -1){
	str = str.replace(de, para);
	pos = str.indexOf(de,(pos+para.length+1));
  }
  return (str);
}

/*
 * function infraSelectFromInput(idSelect, idInput, numTamNumero) { var strCod =
 * document.getElementById(idInput).value; if (strCod != '') { if
 * (infraIsNumber(strCod)) { if (numTamNumero!=undefined){ if (strCod.length <
 * numTamNumero) { strCod = infraLPad(strCod, numTamNumero, '0');
 * document.getElementById(idInput).value = strCod; } }
 * infraSelectSelecionarItem(idSelect, 'null');
 * infraSelectSelecionarItem(idSelect, strCod); if
 * (!infraSelectSelecionado(idSelect)) { alert('Opção não encontrada.');
 * document.getElementById(idInput).focus(); } } else { alert('Número
 * inválido.'); document.getElementById(idInput).focus(); } } }
 */

function infraSelectFromText(txtCodigo,selItens,objProxTab){
	var me = this;
	this.prepararText = null;
	this.txt = infraGetElementById(txtCodigo);
	this.sel = infraGetElementById(selItens);
	this.tab = null;
	if (objProxTab!=undefined){
	  this.tab = infraGetElementById(objProxTab);;
	}


	// Keycodes que devem ser monitorados
	var TAB = 9;
	var ESC = 27;
	var KEYUP = 38;
	var KEYDN = 40;
	var KEYLEFT = 37;
	var KEYRIGHT = 39;
	var ENTER = 13;

	// Desabilitar autocomplete IE
	this.txt.setAttribute("autocomplete","off");
	this.txt.onkeypress = function(ev){
	  var key = infraGetCodigoTecla(ev);
	  if (key==ENTER){
  	  return false;
	  }
	}

	this.txt.onkeydown = function(ev)
	{
		var key = infraGetCodigoTecla(ev);

		switch(key)
		{
		case ESC:
		case KEYUP:
		case KEYDN:
		case KEYLEFT:
		case KEYRIGHT:
		// case TAB:
			return;

		case ENTER:
		case TAB:

		  me.limpar();

			if (me.txt.value.length >= 1){
			   if (me.prepararText!=null){
			     me.txt.value = me.prepararText(me.txt.value);
			   }
         var strCod = me.txt.value;
         infraSelectSelecionarItem(me.sel.id, 'null');
         infraSelectSelecionarItem(me.sel.id, strCod);
         if (!infraSelectSelecionado(me.sel.id)) {
           alert('Opção não encontrada.');
         }else{
           if (me.tab!=null){
             me.tab.focus();
           }else{
             me.sel.focus();
           }
         }
			}else{
			  if (key == TAB) return true;
			}

			return false;
			break;

		default:
		  // limpa tudo menos texto
  	  me.limpar();
	  }
	};

	this.limpar = function(){
	  infraSelectSelecionarItem(me.sel.id, 'null');
	}

	this.sel.onchange = function(){
	  if (me.sel.value=='null'){
	    me.txt.value = '';
	  }else{
	    me.txt.value = me.sel.value;
	  }
	}

  if (window.attachEvent) { // Limpar as referências do IE
    window.attachEvent("onunload", function(){
      me.txt = null;
   	  me.sel = null;
   	  me.tab = null;
  	  me = null;
    });
  }
}

function infraAviso(bolMostrarBotaoCancelar, texto){

  if (bolMostrarBotaoCancelar == undefined){
    bolMostrarBotaoCancelar = true;
  }

  if (texto == undefined) {
	  texto = 'Processando...';
  }

  // Cria fundo
  divFundo = document.createElement('div');
  divFundo.id = 'divInfraAvisoFundo';
  divFundo.className = 'infraFundoTransparente';

  var div = document.createElement('div');
  div.id = 'divInfraAviso';
  div.className = 'infraAviso';


  var html = '';
  html += '<table border="0" width="100%" cellspacing="4">';
  html += '<tr>';
  html += '<td><img id="imgInfraAviso" src="/infra_css/imagens/aguarde.gif" alt="..." /></td>';
  html += '<td align="left"><span id="spnInfraAviso">' + texto + '</span></td>';
  html += '</tr>';
  html += '<tr><td colspan="2" align="center"><button type="button" id="btnInfraAvisoCancelar" value="Cancelar" class="infraButton" onclick="infraAvisoCancelar();" style="font-size:1em;';
  if (!bolMostrarBotaoCancelar) {
	  html += 'display:none;'
  }
  html += '">Cancelar</button></td></tr>';
  html += '</table>';


  div.innerHTML = html;

  divFundo.appendChild(div);

  if (INFRA_IE > 0 && INFRA_IE < 7){
    ifr = document.createElement('iframe');
    ifr.className =  'infraFundoIE';
    divFundo.appendChild(ifr);
  }
  document.body.appendChild(divFundo);

	return divFundo;
}

function infraExibirAviso(bolMostrarBotaoCancelar, texto){

  if (bolMostrarBotaoCancelar == undefined) {
	bolMostrarBotaoCancelar = true;
  }

  if (texto == undefined) {
	  texto = 'Processando...';
  }

  var divFundo = document.getElementById('divInfraAvisoFundo');

  if (divFundo==null){
    divFundo = infraAviso(bolMostrarBotaoCancelar, texto);
  }else{

	if (bolMostrarBotaoCancelar){
	  document.getElementById('btnInfraAvisoCancelar').style.display = '';
	}else{
	  document.getElementById('btnInfraAvisoCancelar').style.display = 'none';
	}

	document.getElementById('spnInfraAviso').innerHTML = texto;
  }

  if (INFRA_IE==0 || INFRA_IE>=7){
    divFundo.style.position = 'fixed';
  }

  var divAviso = document.getElementById('divInfraAviso');
  divAviso.style.top = Math.floor(infraClientHeight()/3) + 'px';
  divAviso.style.left = Math.floor((infraClientWidth()-200)/2) + 'px';
  divAviso.style.width = '200px';

  // divFundo.style.width = (screen.width - 21) + 'px';
  divFundo.style.width = infraClientWidth() + 'px';
  // divFundo.style.height = screen.height + 'px';
  divFundo.style.height = infraClientHeight() + 'px';
  divFundo.style.visibility = 'visible';

  setTimeout('document.getElementById(\'imgInfraAviso\').src=\'/infra_css/imagens/aguarde.gif\'', 100);

}

function infraOcultarAviso(){
  var div = document.getElementById('divInfraAvisoFundo');
  if (div!=null){
    div.style.visibility = 'hidden';
  }
}

function infraAvisoCancelar(){
  if (INFRA_IE != 0){
   document.execCommand("Stop");
  }else{
   window.stop();
  }
  infraOcultarAviso();
}

function infraIsNumero(valor){
  validos = '0123456789.,-';
  for(var i=0;i<valor.length;i++){
    if(validos.indexOf(valor.substr(i,1))<0){
      return false;
    }
  }
  return true;
}


function infraValidarOAB(objeto) {

  var oab = infraTrim(objeto.value);

  if (oab != ''){

    oab = oab.toUpperCase();

    if (oab.length < 3) {
      alert("A OAB deve ser composta pela sigla da UF (Unidade Federativa) e pelo menos um número.");
      objeto.focus();
      return false;
    }else{
      var estado = oab.substring(0,2);
      var digitos = oab.substring(2,oab.length);
      var regexDigitos = regraOAB(estado);

      if ((!regexDigitos.test(digitos))) {
        alert("A OAB deve ser composta por duas letras e pelo menos um número.");
        objeto.focus();
        return false;
      }else{
        oab = "000000"+digitos;
        var ultimoCaracter = oab.substr(oab.length - 1);

  if(estado == 'DF' && ultimoCaracter.match(/[A-Z]/i) != null) {
        objeto.value = estado+oab.substring((oab.length-7),oab.length);
        } else {
        objeto.value = estado+oab.substring((oab.length-6),oab.length);
        }
        return true;
      }
    }
  }
  return true;
}

function regraOAB(estado) {
  var regexDigitos

  if (estado == 'DF') {
    regexDigitos = /^\d{0,6}[a-zA-Z]{0,1}$/;
  } else {
  	regexDigitos = /^\d+$/;
  }
  return regexDigitos;
}

function infraPrepararDbl(dbl){
  if (dbl != null && dbl != ''){
    dbl = new String(dbl).replace(',','.');
  }
  return dbl;
}

function infraPrepararDin(din){
  if (din != null && infraTrim(din) != ''){
	din = new String(din);
	din = din.infraReplaceAll('.','');
    din = din.replace(',','.');
  }
  return din;
}

function infraFormatarDbl(dbl,dec){

  if (dbl!=null && infraTrim(dbl)!=''){

    dbl = new String(dbl).replace('.',',');

    if (dec != undefined){

      var i = dbl.indexOf(',');

      if (i<0){
        dbl = dbl + ',';
        for(;dec>0;dec--) dbl = dbl + '0';
      }else if ((dbl.length - i- 1) < dec){
        dbl = dbl.substr(0,i) + ',' + infraRPad(dbl.substr(i+1), dec, '0');
      }else {
        dbl = dbl.substr(0, i + 1 + dec);
      }
    }
  }
  return dbl;
}

function infraFormatarDin(din,dec){
  if (din!=null && din!=''){

    din = infraTrim(din);

    sinal = '';
    if (din.substr(0,1)=='-'){
      sinal = '-';
      din = din.substr(1);
    }

    var pos = din.indexOf('.');

    var inteiros = '';
    var decimais = '';

    if (pos!=-1){
      decimais = din.substr(pos+1);
      inteiros = din.substr(0,pos);
    }else{
      inteiros = din;
    }

    din = '';

    var j = 0;
    for(var i=inteiros.length-1;i>=0;i--){
      if (j>=3 && (j%3)==0){
        din = '.' + din;
      }
      din = inteiros.charAt(i) + din;
      j++;
    }

    // Se os decimais possuirem menos de 2 casas completa com zeros
    // Se tiver mais que 2 casas deixa como esta
    var numTamDec = decimais.length;

    if (dec == undefined){
      if (numTamDec==0){
        decimais = '00';
      }else if(numTamDec==1){
        decimais = decimais.concat('0');
      }
    }else{

      if (numTamDec==0){
        for(;dec>0;dec--) decimais = decimais.concat('0');
      }else if (numTamDec < dec){
        decimais = infraRPad(decimais, dec, '0');
      }else {
        decimais = decimais.substr(0,dec);
      }
    }

    din = sinal + din + ',' + decimais;
  }
  return din;
}

function infraInArray(item, arr) {
  var key = '';
  for (key in arr) {
    if (arr[key] == item) {
        return true;
    }
  }
  return false;
}

function infraGetIndiceArray(item, arr) {
   var key = '';
   for (key in arr) {
    if (arr[key] == item) {
        return key;
     }
   }
   return -1;
}



function infraRetirarAcentos(palavra) {

  // return palavra;

  var com_acento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
  var sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
  var nova='';
  for(var i=0;i<palavra.length;i++) {

    var c = palavra.substr(i,1);

    if ( (pos = com_acento.indexOf(c))>=0) {
      nova += sem_acento.substr(pos,1);
    }
    else {
      nova += c;
    }
  }
  return nova;
}

function infraBase64(){
	  var me = this;

	  this.base64Str;
		this.base64Count;

		this.base64Chars = new Array(
		    'A','B','C','D','E','F','G','H',
		    'I','J','K','L','M','N','O','P',
		    'Q','R','S','T','U','V','W','X',
		    'Y','Z','a','b','c','d','e','f',
		    'g','h','i','j','k','l','m','n',
		    'o','p','q','r','s','t','u','v',
		    'w','x','y','z','0','1','2','3',
		    '4','5','6','7','8','9','+','/'
		);

		this.reverseBase64Chars = new Array();
		for (var i=0; i < me.base64Chars.length; i++){
		  me.reverseBase64Chars[me.base64Chars[i]] = i;
		}

		this.setBase64Str = function(str){
		  me.base64Str = str;
		  me.base64Count = 0;
		}

		this.readBase64 = function(){
		  if (!me.base64Str){
		    return -1;
		  }

		  if (me.base64Count >= me.base64Str.length){
		    return -1;
		  }

		  var c = me.base64Str.charCodeAt(me.base64Count) & 0xff;
		  me.base64Count++;
		  return c;
		}

		this.codificar = function(str){
		  me.setBase64Str(str);
		  var result = '';
		  var inBuffer = new Array(3);
		  var lineCount = 0;
		  var done = false;
		  while (!done && (inBuffer[0] = me.readBase64()) != -1){
		    inBuffer[1] = me.readBase64();
		    inBuffer[2] = me.readBase64();
		    result += (me.base64Chars[ inBuffer[0] >> 2 ]);
		    if (inBuffer[1] != -1){
		      result += (me.base64Chars [(( inBuffer[0] << 4 ) & 0x30) | (inBuffer[1] >> 4) ]);
		      if (inBuffer[2] != -1){
		        result += (me.base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6) ]);
		        result += (me.base64Chars [inBuffer[2] & 0x3F]);
		      } else {
		        result += (me.base64Chars [((inBuffer[1] << 2) & 0x3c)]);
		        result += ('=');
		        done = true;
		      }
		    } else {
		      result += (me.base64Chars [(( inBuffer[0] << 4 ) & 0x30)]);
		      result += ('=');
		      result += ('=');
		      done = true;
		    }
		    lineCount += 4;
		    if (lineCount >= 76){
		      result += ('\n');
		      lineCount = 0;
		    }
		  }
		  return result;
		}

		this.readReverseBase64 = function(){
		  if (!me.base64Str){
		    return -1;
		  }

		  while (true){
		    if (me.base64Count >= me.base64Str.length){
		      return -1;
		    }
		    var nextCharacter = me.base64Str.charAt(me.base64Count);
		    me.base64Count++;
		    if (me.reverseBase64Chars[nextCharacter]){
		      return me.reverseBase64Chars[nextCharacter];
		    }
		    if (nextCharacter == 'A'){
		      return 0;
		    }
		  }
		  return -1;
		}

		this.ntos = function(n){
		  n=n.toString(16);
		  if (n.length == 1) n="0"+n;
		  n="%"+n;
		  return unescape(n);
		}

		this.decodificar = function(str){
		  me.setBase64Str(str);
		  var result = "";
		  var inBuffer = new Array(4);
		  var done = false;
		  while (!done && (inBuffer[0] = me.readReverseBase64()) != -1 && (inBuffer[1] = me.readReverseBase64()) != -1){
		    inBuffer[2] = me.readReverseBase64();
		    inBuffer[3] = me.readReverseBase64();
		    result += me.ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
		    if (inBuffer[2] != -1){
	        result +=  me.ntos((((inBuffer[1] << 4) & 0xff)| inBuffer[2] >> 2));
		      if (inBuffer[3] != -1){
	          result +=  me.ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
		      } else {
		        done = true;
		      }
		    } else {
		      done = true;
		    }
		  }
		  return result;
		}
	}

/**
 * Abre/Fecha elementos HTML.
 *
 * idElementoHTML - id do elemento que deseja realizar ação - Obrigatório.
 * idElementoHTMLImagem - id da tag "img" onde deve existir os gifs "+" e "-" -
 * Não obrigatório.
 *
 * Por gustavo_db 12/11/2011
 *
 */
function infraAbrirFecharElementoHTML(idElementoHTML, idElementoHTMLImagem) {

    var elementoHTML = document.getElementById(idElementoHTML);

    if (idElementoHTMLImagem != undefined) {
      var elementoHTMLImagem = document.getElementById(idElementoHTMLImagem);
      var strImagem = (elementoHTML.style.display == 'block') ? 'ver_tudo.gif' : 'ver_resumo.gif';
      elementoHTMLImagem.setAttribute('src', '/infra_css/imagens/' + strImagem);
    }

    elementoHTML.style.display = (elementoHTML.style.display == 'block') ? 'none' : 'block';
}

/*
 * Converte XML em um array js. @param XML xmlDoc * @return arrayJs
 */
function infraConverterXmlArray(xmlDoc) {
  var output = {};
  var i;
  var num = 0;

  for (i = 0; i < xmlDoc.childNodes.length; i++) {
	if (xmlDoc.childNodes[i].nodeType == 1){
	  num++;
	}
  }

  if (num == 0){
    return (typeof xmlDoc.text != 'undefined') ? xmlDoc.text : xmlDoc.textContent;   // Tratamento
																						// para
																						// IE;
  }

  for (i = 0; i < xmlDoc.childNodes.length; i++) {
    if (xmlDoc.childNodes[i].nodeType == 1) {
	  if (typeof output[xmlDoc.childNodes[i].tagName] == 'undefined'){
        output[xmlDoc.childNodes[i].tagName] = [];
	  }
      output[xmlDoc.childNodes[i].tagName].push(infraConverterXmlArray(xmlDoc.childNodes[i]));
    }
  }
  return output;
}

/**
 * Exibe/Oculta um ou mais elementos separados por ",". Exemplo:
 * infraExibeOcultaElementos('idElemento1,idElemento2', false);
 *
 * idElementos - string com id's de elementos bolExibir - boleano com a ação
 * desejada TRUE (exibir) FALSE (ocultar)
 */
function infraExibirOcultarElementos(idElementos, bolExibir) {
  var arrIdElementos = idElementos.split(',');
  for (var i=0; i < arrIdElementos.length; i++){
    infraGetElementById(arrIdElementos[i]).style.display = (bolExibir) ? 'inline' : 'none';
  }
}

function infraGerarPlanilhaTabela(link, cabecalhosExtras){
	  var numSelecionados = 0;
	  var div = document.getElementById('infraDivImpressao');
	  var csv = '';
	  var indexFinal = null;

	  //insere cabeçalhos extras (strings concatenadas por ";", cada uma delas será colocada em uma linha separada)
	  if(cabecalhosExtras != undefined && cabecalhosExtras.length > 0){
	          var arrCabecalhoExtra = cabecalhosExtras.split(';');
	          for(i=0; i < arrCabecalhoExtra.length; i++){
	                  csv = csv + arrCabecalhoExtra[i] + '\n';
	          }
	  }

	  if (document.getElementById('hdnInfraNroItens')!=null){
	    numSelecionados = infraNroItensSelecionados();
	    if (numSelecionados==0){
	      alert('Nenhum registro selecionado.');
	      return;
	    }
	  }
	  div.innerHTML = document.getElementById('divInfraAreaTabela').innerHTML;

	  // Pega o cabeçalho da tabela
	  ths = div.getElementsByTagName("th");

	  // Pega checks da div original porque os copiados não contem informação de
	        // seleção
	  boxs = document.getElementById('divInfraAreaTabela').getElementsByTagName("input");

	                // Se a ultima coluna é de ações
	                if (infraTrim(ths[ths.length-1].innerHTML)=='Ações'){
	                        bolRemoverAcoes = true;
	                } else {
	                        bolRemoverAcoes = false;
	                }

	                // Se não é uma tabela vazia, processa tabela
	                if (ths.length > 0){
	                        // Concatena os cabeçalhos, exceto a primeira coluna (que é a
	                        // dos checkboxes) e a última (se for a coluna das ações)
	                        indexFinal = (bolRemoverAcoes)? (ths.length-1) : (ths.length);
	                        for(var i=1;i < indexFinal;i++){
	                                var tdsOrdenacao = ths[i].getElementsByTagName("td");
	                                var separador = '';
	                                if(i>1){
	                                        separador = ';';
	                                }

	                                if(tdsOrdenacao.length==0){
	                                        csv = csv + separador + ths[i].innerHTML;
	                                }else{
	                                        for(var j=0;j < tdsOrdenacao.length;j++){
	                                                if(tdsOrdenacao[j].className=='infraTdRotuloOrdenacao'){
	                                                        csv = csv + separador + tdsOrdenacao[j].innerHTML;
	                                                        ths[i].innerHTML = '';
	                                                        break;
	                                                }
	                                        }
	                                }
	                        }

	                        // Se não for uma tabela que contém apenas a coluna dos checkboxes e
	                        // das
	                        // ações, processa os dados
	                        if (csv!=''){
	                                // Insere quebra de linha do cabeçalho
	                                csv = csv + '\n';

	                                // Extrai todas as linhas da tabela e processa todas a partir da
	                                // segunda, pois a primeira é o cabeçalho
	                                trs = div.getElementsByTagName("tr");

	                                for(var i=1;i < trs.length;i++){
	                                        // De cada linha em processamento, extrai as colunas
	                                        tds = trs[i].getElementsByTagName("td");

	                                        // Pega check box da primeira coluna
	                                        box = tds[0].getElementsByTagName("input");

	                                        bolIncluirCheckbox = false;

	                                        if(box.length > 0){ // se o checkbox existe, faz

	                                                // Verifica se o checkbox original esta marcado
	                                                // ja que os checkboxes copiados não levam esta
	                                                // informacao
	                                                for(j=0;j < boxs.length;j++){
	                                                        if (boxs[j].id==box[0].id){
	                                                                if (boxs[j]!= null && boxs[j].checked && !boxs[j].disabled){
	                                                                        bolIncluirCheckbox = true;
	                                                                }
	                                                                // Se ja achou o id não adianta continuar a
	                                                                // varredura
	                                                                break;
	                                                        }
	                                                }

	                                                // Se a checkbox foi maracada, pega os valores da linha
	                                                if(bolIncluirCheckbox){
	                                                        // Processa todas as colunas exceto a primeira (que
	                                                        // é a dos
	                                                        // checkboxes) e a última (se for a das ações)
	                                                        for(var k=1;k < indexFinal;k++){
	                                                                var separador = '';
	                                                                if (k>1){
	                                                                        separador = ';';
	                                                                }
	                                                                if (tds[k]==undefined){ // teste se a célula
	                                                                                                                // existe mesmo (pode
	                                                                                                                // ser excluída por
	                                                                                                                // colspan)
	                                                                        strCelula = '""';
	                                                                } else {
	                                                                        strCelula = tds[k].innerHTML;
	                                                                        strCelula = strCelula.replace("\"", "\"\""); // escapa
	                                                                                                                                                                        // aspas
	                                                                        strCelula = '"'+strCelula+'"';
	                                                                }
	                                                                csv = csv + separador + strCelula;
	                                                        }
	                                                        // insere quebra de linha
	                                                        csv = csv + '\n';
	                                                }
	                                        }
	                                }
	                        }
	                }

	                div.innerTEXT = csv;
	                infraAbrirJanela(link,'InfraGerarPlanilha',300,100,'location=0,status=0,resizable=1,scrollbars=1');
	                div.innerHTML = '';
	        }

(function () {
	infraMd5 = function (string) {

		function cmn(q, a, b, x, s, t) {
			a = add32(add32(a, q), add32(x, t));
			return add32((a << s) | (a >>> (32 - s)), b);
		}


		function ff(a, b, c, d, x, s, t) {
			return cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}

		function gg(a, b, c, d, x, s, t) {
			return cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}

		function hh(a, b, c, d, x, s, t) {
			return cmn(b ^ c ^ d, a, b, x, s, t);
		}

		function ii(a, b, c, d, x, s, t) {
			return cmn(c ^ (b | (~d)), a, b, x, s, t);
		}



		function md5cycle(x, k) {
			var a = x[0], b = x[1], c = x[2], d = x[3];

			a = ff(a, b, c, d, k[0], 7, -680876936);
			d = ff(d, a, b, c, k[1], 12, -389564586);
			c = ff(c, d, a, b, k[2], 17,  606105819);
			b = ff(b, c, d, a, k[3], 22, -1044525330);
			a = ff(a, b, c, d, k[4], 7, -176418897);
			d = ff(d, a, b, c, k[5], 12,  1200080426);
			c = ff(c, d, a, b, k[6], 17, -1473231341);
			b = ff(b, c, d, a, k[7], 22, -45705983);
			a = ff(a, b, c, d, k[8], 7,  1770035416);
			d = ff(d, a, b, c, k[9], 12, -1958414417);
			c = ff(c, d, a, b, k[10], 17, -42063);
			b = ff(b, c, d, a, k[11], 22, -1990404162);
			a = ff(a, b, c, d, k[12], 7,  1804603682);
			d = ff(d, a, b, c, k[13], 12, -40341101);
			c = ff(c, d, a, b, k[14], 17, -1502002290);
			b = ff(b, c, d, a, k[15], 22,  1236535329);

			a = gg(a, b, c, d, k[1], 5, -165796510);
			d = gg(d, a, b, c, k[6], 9, -1069501632);
			c = gg(c, d, a, b, k[11], 14,  643717713);
			b = gg(b, c, d, a, k[0], 20, -373897302);
			a = gg(a, b, c, d, k[5], 5, -701558691);
			d = gg(d, a, b, c, k[10], 9,  38016083);
			c = gg(c, d, a, b, k[15], 14, -660478335);
			b = gg(b, c, d, a, k[4], 20, -405537848);
			a = gg(a, b, c, d, k[9], 5,  568446438);
			d = gg(d, a, b, c, k[14], 9, -1019803690);
			c = gg(c, d, a, b, k[3], 14, -187363961);
			b = gg(b, c, d, a, k[8], 20,  1163531501);
			a = gg(a, b, c, d, k[13], 5, -1444681467);
			d = gg(d, a, b, c, k[2], 9, -51403784);
			c = gg(c, d, a, b, k[7], 14,  1735328473);
			b = gg(b, c, d, a, k[12], 20, -1926607734);

			a = hh(a, b, c, d, k[5], 4, -378558);
			d = hh(d, a, b, c, k[8], 11, -2022574463);
			c = hh(c, d, a, b, k[11], 16,  1839030562);
			b = hh(b, c, d, a, k[14], 23, -35309556);
			a = hh(a, b, c, d, k[1], 4, -1530992060);
			d = hh(d, a, b, c, k[4], 11,  1272893353);
			c = hh(c, d, a, b, k[7], 16, -155497632);
			b = hh(b, c, d, a, k[10], 23, -1094730640);
			a = hh(a, b, c, d, k[13], 4,  681279174);
			d = hh(d, a, b, c, k[0], 11, -358537222);
			c = hh(c, d, a, b, k[3], 16, -722521979);
			b = hh(b, c, d, a, k[6], 23,  76029189);
			a = hh(a, b, c, d, k[9], 4, -640364487);
			d = hh(d, a, b, c, k[12], 11, -421815835);
			c = hh(c, d, a, b, k[15], 16,  530742520);
			b = hh(b, c, d, a, k[2], 23, -995338651);

			a = ii(a, b, c, d, k[0], 6, -198630844);
			d = ii(d, a, b, c, k[7], 10,  1126891415);
			c = ii(c, d, a, b, k[14], 15, -1416354905);
			b = ii(b, c, d, a, k[5], 21, -57434055);
			a = ii(a, b, c, d, k[12], 6,  1700485571);
			d = ii(d, a, b, c, k[3], 10, -1894986606);
			c = ii(c, d, a, b, k[10], 15, -1051523);
			b = ii(b, c, d, a, k[1], 21, -2054922799);
			a = ii(a, b, c, d, k[8], 6,  1873313359);
			d = ii(d, a, b, c, k[15], 10, -30611744);
			c = ii(c, d, a, b, k[6], 15, -1560198380);
			b = ii(b, c, d, a, k[13], 21,  1309151649);
			a = ii(a, b, c, d, k[4], 6, -145523070);
			d = ii(d, a, b, c, k[11], 10, -1120210379);
			c = ii(c, d, a, b, k[2], 15,  718787259);
			b = ii(b, c, d, a, k[9], 21, -343485551);

			x[0] = add32(a, x[0]);
			x[1] = add32(b, x[1]);
			x[2] = add32(c, x[2]);
			x[3] = add32(d, x[3]);

		}


		function md51(s) {
			txt = '';
			var n = s.length,
			state = [1732584193, -271733879, -1732584194, 271733878], i;
			for (i=64; i<=n; i+=64) {
				md5cycle(state, md5blk(s.substring(i-64, i)));
			}
			s = s.substring(i-64);
			var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], sl=s.length;
			for (i=0; i<sl; i++) 	tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
			tail[i>>2] |= 0x80 << ((i%4) << 3);
			if (i > 55) {
				md5cycle(state, tail);
				i=16;
				while (i--) { tail[i] = 0 }
	//			for (i=0; i<16; i++) tail[i] = 0;
			}
			tail[14] = n*8;
			md5cycle(state, tail);
			return state;
		}

		/* there needs to be support for Unicode here,
		 * unless we pretend that we can redefine the MD-5
		 * algorithm for multi-byte characters (perhaps
		 * by adding every four 16-bit characters and
		 * shortening the sum to 32 bits). Otherwise
		 * I suggest performing MD-5 as if every character
		 * was two bytes--e.g., 0040 0025 = @%--but then
		 * how will an ordinary MD-5 sum be matched?
		 * There is no way to standardize text to something
		 * like UTF-8 before transformation; speed cost is
		 * utterly prohibitive. The JavaScript standard
		 * itself needs to look at this: it should start
		 * providing access to strings as preformed UTF-8
		 * 8-bit unsigned value arrays.
		 */
		function md5blk(s) { 		/* I figured global was faster.   */
			var md5blks = [], i; 	/* Andy King said do it this way. */
			for (i=0; i<64; i+=4) {
			md5blks[i>>2] = s.charCodeAt(i)
			+ (s.charCodeAt(i+1) << 8)
			+ (s.charCodeAt(i+2) << 16)
			+ (s.charCodeAt(i+3) << 24);
			}
			return md5blks;
		}

		var hex_chr = '0123456789abcdef'.split('');

		function rhex(n)
		{
			var s='', j=0;
			for(; j<4; j++)	s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]	+ hex_chr[(n >> (j * 8)) & 0x0F];
			return s;
		}

		function hex(x) {
			var l=x.length;
			for (var i=0; i<l; i++)	x[i] = rhex(x[i]);
			return x.join('');
		}

		/* this function is much faster,
		so if possible we use it. Some IEs
		are the only ones I know of that
		need the idiotic second function,
		generated by an if clause.  */

		function add32(a, b) {
			return (a + b) & 0xFFFFFFFF;
		}

		if (hex(md51("hello")) != "5d41402abc4b2a76b9719d911017c592") {
			function add32(x, y) {
				var lsw = (x & 0xFFFF) + (y & 0xFFFF),
				msw = (x >> 16) + (y >> 16) + (lsw >> 16);
				return (msw << 16) | (lsw & 0xFFFF);
			}
		}

		return hex(md51(string));
	}
})();


function infraGerarHashDadosDiv(div, arrDesconsiderar){
	  var el;
	  var els;
	  var e;
	  var conteudo = '';
	  e = 0;
	  els = div.getElementsByTagName('input');
	  while (el = els.item(e++)){
	    if (arrDesconsiderar == undefined || el.id == null || !infraInArray(el.id,arrDesconsiderar)){
	      if (el.type == 'checkbox' || el.type == 'radio'){
	        conteudo += String(el.checked);
	      }else{
	        conteudo += el.value;
	      }
	    }
	  }

	  e = 0;
	  els = div.getElementsByTagName('select');
	  while (el = els.item(e++)){
	    if (arrDesconsiderar == undefined || el.id == null || !infraInArray(el.id,arrDesconsiderar)){
	      if (!el.multiple){
	        conteudo += el.value;
	      }else{
	        for(i=0;i < el.options.lenght;i++){
	          conteudo += el.options[i].value;
	        }
	      }
	    }
	  }

	  e = 0;
	  els = div.getElementsByTagName('textarea');
	  while (el = els.item(e++)){
	    if (arrDesconsiderar == undefined || el.id == null || !infraInArray(el.id,arrDesconsiderar)){
	      conteudo += el.value;
	    }
	  }

	  return infraMd5(conteudo);
	}

  function infraAbrirBarraProgresso(form, action, largura, altura){

    if (typeof(form.onsubmit) == 'function' && !form.onsubmit()){
      return;
    }

    var nomeJanela = 'janelaProgresso' + (new Date()).getTime();
    var janelaProgresso = infraAbrirJanela('',nomeJanela,largura,altura,'location=0,status=0,resizable=0,scrollbars=1',true);
    form.target = nomeJanela;
    form.action = action;
    form.submit();
  }

  function infraCancelarBarraProgresso(){
    if (INFRA_IE != 0){
      document.execCommand("Stop");
    }else{
      window.stop();
    }
    window.close();
  }

  function infraFormatarTamanhoBytes(numBytes){
    ret = null;
    if (numBytes > 1099511627776){
      ret = Math.round(numBytes/1099511627776 * 100) / 100 + ' Tb';
    }else if (numBytes > 1073741824){
      ret = Math.round(numBytes/1073741824 * 100) / 100 + ' Gb';
    }else if (numBytes > 1048576){
      ret = Math.round(numBytes/1048576 * 100) / 100 + ' Mb';
    }else /* if (numBytes > 1024) */ {
      ret = Math.round(numBytes/1024* 100) / 100 +' Kb';
    /* }else{
      ret = numBytes + ' bytes'; */
    }
    return ret;
  }

  function infraSelecaoMultiplaMarcarTodos(obj, true_false){
     itens   = document.getElementById(obj);
     tamanho = itens.length;
     for (var cont=0; cont < tamanho; cont++ ){
         itens.options[cont].selected = true_false;
     }
  }



var bolRedimensionando = false;
var objLupaBloco = null;

function redimensionar() {

    if (!bolRedimensionando && parent.document.getElementById('ifrVisualizacao') != null && document.getElementById('divArvoreAcoes') != null) {

        bolRedimensionando = true;

        var hVisualizacao = parent.document.getElementById('ifrVisualizacao').offsetHeight;
        var hAcoes = document.getElementById('divArvoreAcoes').offsetHeight;
        var hCliqueAqui = 0;

        if (document.getElementById('divInformacao') != null) {
            hCliqueAqui = document.getElementById('divInformacao').offsetHeight;
        }

        var hRedimensionamento = hVisualizacao - hAcoes - hCliqueAqui - 15;

        if (hRedimensionamento > 0 && hRedimensionamento < 1920) { //FullHD
            document.getElementById('divArvoreAguarde').style.height = hRedimensionamento + 'px';
            document.getElementById('divArvoreHtml').style.height = hRedimensionamento + 'px';
            document.getElementById('ifrEditor').style.height = hRedimensionamento + 'px';
        }

        bolRedimensionando = false;
    }
}

function inicializar() {

    //exclusão/renúncia volta para o controle de processos
    if (('arvore_visualizar' == 'procedimento_excluir' && '' == '1') ||
        ('arvore_visualizar' == 'procedimento_credencial_renunciar' && '' == '1')) {
        parent.parent.document.location.href = 'controlador.php?acao=procedimento_controlar&acao_origem=arvore_visualizar&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=f9cbc504f8b6da7e0fe79ebee5301a74d99cf67ea7e3cb4853b964c4d9fd237e';
        return;
    }

    if ('procedimento_visualizar' == 'rel_bloco_protocolo_cadastrar') {
        parent.parent.document.location.href = 'controlador.php?acao=rel_bloco_protocolo_listar&acao_origem=arvore_visualizar&id_bloco=&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=efb8a3353597b6f852d665c9d395061ed99cf67ea7e3cb4853b964c4d9fd237e#' + infraGetAnchor();
        return;
    }

    if ('arvore_visualizar' == 'procedimento_ciencia' && '' == '1') {
        atualizarArvore('');
        return;
    }

    if ('arvore_visualizar' == 'procedimento_anexado_ciencia' && '' == '1') {
        atualizarArvore('');
        return;
    }

    if ('arvore_visualizar' == 'documento_ciencia' && '' == '1') {
        atualizarArvore('');
        return;
    }

    if ('' != '') {

        infraAdicionarEvento(document.getElementById('ifrEditor'), 'load', loadEditarConteudo);

        infraAbrirJanela('', 'janelaEditor_100000809_12910', infraClientWidth(), infraClientHeight(), 'location=0,status=0,resizable=1,scrollbars=1', false);
    }

    //ações que precisam atualizar a árvore
    if (('procedimento_visualizar' == 'procedimento_alterar') ||
        ('arvore_visualizar' == 'procedimento_reabrir' && '' == '1') ||
        ('arvore_visualizar' == 'procedimento_concluir' && '' == '1') ||
        ('procedimento_visualizar' == 'procedimento_relacionar') ||
        ('procedimento_visualizar' == 'documento_assinar') ||
        ('procedimento_visualizar' == 'documento_gerar') ||
        ('procedimento_visualizar' == 'documento_alterar') ||
        ('procedimento_visualizar' == 'publicacao_gerar_relacionada') ||
        ('procedimento_visualizar' == 'procedimento_email_interessados' && '' == '1') ||
        ('procedimento_visualizar' == 'documento_receber') ||
        ('procedimento_visualizar' == 'documento_alterar_recebido') ||
        ('procedimento_visualizar' == 'procedimento_enviar' && '' == '1') ||
        ('procedimento_visualizar' == 'procedimento_credencial_conceder' && '' == '1') ||
        ('procedimento_visualizar' == 'publicacao_agendar' && '' == '1') ||
        ('procedimento_visualizar' == 'publicacao_alterar_agendamento' && '' == '1') ||
        ('procedimento_visualizar' == 'publicacao_listar') ||
        ('procedimento_visualizar' == 'procedimento_enviar_email') ||
        ('procedimento_visualizar' == 'documento_enviar_email') ||
        ('procedimento_visualizar' == 'email_encaminhar') ||
        ('procedimento_visualizar' == 'responder_formulario_ouvidoria') ||
        ('procedimento_visualizar' == 'responder_formulario_corregedoria') ||
        ('procedimento_visualizar' == 'responder_formulario_pedido') ||
        ('procedimento_visualizar' == 'responder_formulario_acordaos') ||
        ('procedimento_visualizar' == 'publicacao_listar') ||
        ('procedimento_visualizar' == 'arvore_ordenar' && '' == '1') ||
        ('procedimento_visualizar' == 'procedimento_sobrestar' && '' == '1') ||
        ('arvore_visualizar' == 'procedimento_remover_sobrestamento' && '' == '1') ||
        ('procedimento_visualizar' == 'procedimento_atribuicao_cadastrar') ||
        ('procedimento_visualizar' == 'protocolo_cancelar') ||
        ('procedimento_visualizar' == 'procedimento_reencaminhar_ouvidoria' && '' == '1') ||
        ('procedimento_visualizar' == 'procedimento_finalizar_ouvidoria' && '' == '1') ||
        ('procedimento_visualizar' == 'protocolo_solicitar_desarquivamento' && '' == '1') ||
        ('arvore_visualizar' == 'procedimento_ciencia' && '' == '1') ||
        ('arvore_visualizar' == 'documento_ciencia' && '' == '1') ||
        ('procedimento_visualizar' == 'rel_bloco_protocolo_cadastrar' && '' == '1') ||
        ('procedimento_visualizar' == 'procedimento_desanexar' && '' == '1')) {

        atualizarArvore('controlador.php?acao=procedimento_visualizar&acao_origem=arvore_visualizar&id_procedimento=4601&id_documento=12910&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=1221487437b6a95d0d9ddfaf3c89eea3d99cf67ea7e3cb4853b964c4d9fd237e');
        return;
    }

    if ('arvore_visualizar' == 'documento_excluir' && '' == '1') {
        atualizarArvore('controlador.php?acao=procedimento_visualizar&acao_origem=arvore_visualizar&id_procedimento=4601&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=cb7888fc44c20ce89896372fa6c14d20d99cf67ea7e3cb4853b964c4d9fd237e');
        return;
    }

    //monta visualização de acordo com o nó selecionado na árvore
    var objArvore = parent.document.getElementById('ifrArvore').contentWindow['objArvore'];

    if (objArvore != null) {
        var noSelecionado = objArvore.getNoSelecionado();
        if (noSelecionado != null) {

            //copia HTML das ações montadas
            document.getElementById('divArvoreAcoes').innerHTML = noSelecionado.acoes;

            document.getElementById('divArvoreAguarde').style.display = 'block';

            if (noSelecionado.src != undefined && noSelecionado.src != '') {

                if (INFRA_IE && noSelecionado.src.indexOf('documento_download_anexo') != -1) {
                    ocultarAguarde();
                }

                //se for um link carrega no iframe
                if (noSelecionado.html != undefined && noSelecionado.html != '') {

                    var innerHtml = '';

                    if (noSelecionado.assinatura == undefined || noSelecionado.assinatura == '') {
                        innerHtml += '<div id="divInformacao" style="float:left">' + noSelecionado.html + '</div><br /><br />';
                    } else {
                        innerHtml += '<div style="width:99%;"><div id="divInformacao" style="float:left">' + noSelecionado.html + '</div><div id="divAssinaturas" style="float:right">' + noSelecionado.assinatura + '</div></div><br /><br />';
                    }

                    innerHtml += '<iframe onload="ocultarAguarde();" id="ifrArvoreHtml" src="' + noSelecionado.src + '" frameborder="0" height="99%" width="100%"></iframe>';


                    document.getElementById('divArvoreHtml').innerHTML = innerHtml;
                } else {
                    document.getElementById('divArvoreHtml').innerHTML = '<iframe id="ifrArvoreHtml" onload="ocultarAguarde();" src="' + noSelecionado.src + '" frameborder="0" height="100%" width="100%"></iframe>';
                }

                setTimeout('ocultarAguarde()', 2000);

            } else {

                if (noSelecionado.html != undefined && noSelecionado.html != '') {

                    var innerHtml = '';

                    if (noSelecionado.assinatura == undefined || noSelecionado.assinatura == '') {
                        innerHtml += '<div id="divInformacao" style="float:left">' + noSelecionado.html + '</div><br /><br />';
                    } else {
                        innerHtml += '<div style="width:99%;"><div id="divInformacao" style="float:left">' + noSelecionado.html + '</div><div id="divAssinaturas" style="float:right">' + noSelecionado.assinatura + '</div></div><br /><br />';
                    }


                    //se for um conteudo HTML copia para a div
                    document.getElementById('divArvoreHtml').innerHTML = innerHtml;
                }

                ocultarAguarde();
            }
        }

        redimensionar();
        infraAdicionarEvento(window, 'resize', redimensionar);
    }

    objLupaBloco = new infraLupaText('txtBloco', 'hdnIdBloco', 'controlador.php?acao=bloco_selecionar_processo&tipo_selecao=1&id_object=objLupaBloco&id_procedimento=4601&id_documento=12910&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=88ba78ac9b945b766fa9d8f57f4bc27ed99cf67ea7e3cb4853b964c4d9fd237e');
    objLupaBloco.finalizarSelecao = function () {
        document.getElementById('frmVisualizar').action = 'controlador.php?acao=rel_bloco_protocolo_cadastrar&acao_origem=arvore_visualizar&id_procedimento=4601&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=1a1a28aff33cf9be5c23b8c5333c1eefd99cf67ea7e3cb4853b964c4d9fd237e';
        document.getElementById('frmVisualizar').submit();
    }
}

function excluirProcesso() {
    if (confirm('Confirma exclusão do processo?')) {
        location.href = 'controlador.php?acao=procedimento_excluir&acao_origem=arvore_visualizar&id_procedimento=4601&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=6ea5975932c91f4c5aef07172ce32193d99cf67ea7e3cb4853b964c4d9fd237e';
    }
}

function removerSobrestamentoProcesso() {
    if (confirm('Confirma remoção de sobrestamento do processo?')) {
        location.href = 'controlador.php?acao=procedimento_remover_sobrestamento&acao_origem=arvore_visualizar&id_procedimento=4601&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=293877b27f59c419d1dbe5cf4f673f3bd99cf67ea7e3cb4853b964c4d9fd237e';
    }
}

function concluirProcesso() {
    //if (confirm('Confirma conclusão do processo?')){
    location.href = 'controlador.php?acao=procedimento_concluir&acao_origem=arvore_visualizar&id_procedimento=4601&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=f1b242e550085639e4b747704c2a8b78d99cf67ea7e3cb4853b964c4d9fd237e';
    //}
}

function reabrirProcesso() {
    //if (confirm('Confirma reabetura do processo?')){
    location.href = 'controlador.php?acao=procedimento_reabrir&acao_origem=arvore_visualizar&id_procedimento=4601&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=99fad2549eb258829eec6478104ce3a5d99cf67ea7e3cb4853b964c4d9fd237e';
    //}
}

function excluirDocumento() {
    if (confirm('Confirma exclusão do documento?')) {
        location.href = 'controlador.php?acao=documento_excluir&acao_origem=arvore_visualizar&id_procedimento=4601&id_documento=12910&sta_editor=I&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=8357ab3c7dbe3d2627867f2fed97d5ccd99cf67ea7e3cb4853b964c4d9fd237e';
    }
}

/////

function cienciaProcesso() {
    //if (confirm('Confirma ciência no processo?')){
    location.href = 'controlador.php?acao=procedimento_ciencia&acao_origem=arvore_visualizar&id_procedimento=4601&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=a4b444bdeac26fbcc18d84c6715d8170d99cf67ea7e3cb4853b964c4d9fd237e';
    //}
}

function cienciaDocumento() {
    //if (confirm('Confirma ciência no documento?')){
    location.href = 'controlador.php?acao=documento_ciencia&acao_origem=arvore_visualizar&id_procedimento=4601&id_documento=12910&sta_editor=I&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=a20df4eab31644b8a3469e9a7a7a7ae6d99cf67ea7e3cb4853b964c4d9fd237e';
    //}
}

function cienciaProcessoAnexado() {
    //if (confirm('Confirma ciência no processo anexado?')){
    location.href = 'controlador.php?acao=procedimento_anexado_ciencia&acao_origem=arvore_visualizar&id_procedimento=4601&id_procedimento_anexado=&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=c3c230bd382fe4feeb809f93b70e050ed99cf67ea7e3cb4853b964c4d9fd237e';
    //}
}


function assinarDocumento() {
    infraAbrirJanela('controlador.php?acao=documento_assinar&acao_origem=arvore_visualizar&id_procedimento=4601&id_documento=12910&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=0b02a8a4d99c67b53ab4cce579b5512bd99cf67ea7e3cb4853b964c4d9fd237e', 'janelaAssinatura', 700, 450, 'location=0,status=1,resizable=1,scrollbars=1');
}

function enviarEmailProcedimento() {
    abrirJanelaEmail('janelaEmail_100000809_4601', 'controlador.php?acao=procedimento_enviar_email&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=4601&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=fd8d0592518a068366f92ff9e4a32038d99cf67ea7e3cb4853b964c4d9fd237e');
}

function enviarEmailDocumento() {
    abrirJanelaEmail('janelaEmailDocumento_100000809_12910', 'controlador.php?acao=documento_enviar_email&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=4601&id_documento=12910&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=b219097c8488ccf85a14d6eed22f0bb8d99cf67ea7e3cb4853b964c4d9fd237e');
}

function enviarEmailOuvidoria() {
    abrirJanelaEmail('janelaEmailOuvidoria_100000809_12910', 'controlador.php?acao=responder_formulario_ouvidoria&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=4601&id_documento=12910&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=3143b19be5ed3caf51bdc4346c752bf1d99cf67ea7e3cb4853b964c4d9fd237e');
}

function enviarEmailCorregedoria() {
    abrirJanelaEmail('janelaEmailCorregedoria_100000809_12910', 'controlador.php?acao=responder_formulario_corregedoria&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=4601&id_documento=12910&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=ad87ed32ca4d9e62b027d8a7ae302af5d99cf67ea7e3cb4853b964c4d9fd237e');
}

function enviarEmailAcordaos() {
    abrirJanelaEmail('janelaEmailAcordaos_100000809_12910', 'controlador.php?acao=responder_formulario_acordaos&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=4601&id_documento=12910&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=7aa8ff751d1517e0fdac9ad32b7995aed99cf67ea7e3cb4853b964c4d9fd237e');
}

function enviarEmailPedido() {
    abrirJanelaEmail('janelaEmailPedido_100000809_12910', 'controlador.php?acao=responder_formulario_pedido&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=4601&id_documento=12910&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=252e9987bd2b2305fa92e6b1b5f0462dd99cf67ea7e3cb4853b964c4d9fd237e');
}

function encaminharEmail() {
    abrirJanelaEmail('janelaEncaminharEmail_100000809_12910', 'controlador.php?acao=email_encaminhar&acao_origem=arvore_visualizar&acao_retorno=arvore_visualizar&id_procedimento=4601&id_documento=12910&arvore=1&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=593775db3ca6692a25cb2b7b60787f69d99cf67ea7e3cb4853b964c4d9fd237e');
}

function abrirJanelaEmail(nomeJanela, link) {
    var janela = infraAbrirJanela('', nomeJanela, 700, 450, 'location=0,status=1,resizable=1,scrollbars=1', false);
    if (janela.location == 'about:blank') {
        janela.location.href = link;
    }
    janela.focus();
}


function editarConteudo(assinado) {


    if (INFRA_FF > 0 && INFRA_FF < 4) {
        alert('Para realizar a edição de documentos no Firefox é recomendado atualizar o navegador para a versão 4 ou posterior.\n\nPara iniciar a atualização automática acesse o menu "Ajuda / Verificar atualizações..." ou "Ajuda / Sobre o Firefox" do navegador.');
        //return;
    }


    if (assinado == 'S') {
        if (!confirm('Este documento já foi assinado. Se for editado perderá a assinatura e deverá ser assinado novamente.\n Deseja editar o documento?')) {
            return;
        }
    }

    infraAdicionarEvento(document.getElementById('ifrEditor'), 'load', loadEditarConteudo);

    var janelaEditor = infraAbrirJanela('', 'janelaEditor_100000809_12910', infraClientWidth(), infraClientHeight(), 'location=0,status=0,resizable=1,scrollbars=1', false);
    if (janelaEditor.location == 'about:blank') {
        janelaEditor.location.href = 'controlador.php?acao=editor_montar&acao_origem=arvore_visualizar&id_procedimento=4601&id_documento=12910&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=de277502331bc9e06f1076feb7d0264dd99cf67ea7e3cb4853b964c4d9fd237e';
    }
    janelaEditor.focus();

}

function imprimirWord() {
    infraAdicionarEvento(document.getElementById('ifrEditor'), 'load', loadEditarConteudo);
    document.getElementById('ifrEditor').src = 'controlador_edoc.php?acao=documento_imprimir_word&id_documento=12910&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=4130824549f40fa9c93a152242e84d6bd99cf67ea7e3cb4853b964c4d9fd237e';
}

function desbloquearDocumento() {
    if (confirm("ATENÇÃO: ao realizar o desbloqueio, a versão visualizada será considerada como sendo a última editada.\n Confirma desbloqueio do documento?")) {
        infraAbrirJanela('controlador_edoc.php?acao=documento_desbloquear&id_documento=12910&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=517979211177fd9efe4e1fd7d2a892f4d99cf67ea7e3cb4853b964c4d9fd237e', 'janelaDesbloqueio', 500, 350, 'location=0,status=0,resizable=1,scrollbars=1');
    }
}

function renunciarCredencial() {
    if (confirm("ATENÇÃO: Confirma renúncia de credenciais do processo nesta unidade?")) {
        location.href = 'controlador.php?acao=procedimento_credencial_renunciar&id_procedimento=4601&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=6dda3a6e10b06cff4bcaacc73b3dff44d99cf67ea7e3cb4853b964c4d9fd237e';
    }
}

function ocultarAguarde(pos) {

    if (detectarExcecao('ifrArvoreHtml')) {
        document.getElementById('divArvoreAcoes').style.display = 'none';
    }

    document.getElementById('divArvoreAguarde').style.display = 'none';
    document.getElementById('divArvoreHtml').style.display = 'block';

    //corrige problema do IE onde a barra de status de vez em quando fica como se estivesse carregando (mesmo após o término)
    if (INFRA_IE > 0) {
        window.status = 'Finalizado.';
    }

    redimensionar();
}

function loadEditarConteudo() {

    document.getElementById('divArvoreAcoes').style.display = 'none';
    document.getElementById('divArvoreHtml').style.display = 'none';

    if (detectarExcecao('ifrEditor')) {
        document.getElementById('ifrEditor').style.display = 'block';
        parent.document.getElementById('ifrArvore').src = 'controlador.php?acao=procedimento_visualizar&acao_origem=arvore_visualizar&id_procedimento=4601&id_documento=12910&montar_visualizacao=0&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=7835004be7cedb6e21acfa9673009377d99cf67ea7e3cb4853b964c4d9fd237e';
    } else {
        document.getElementById('ifrEditor').style.display = 'none';
        //monta árvore atualizando iframe para mostrar avisos
        parent.document.getElementById('ifrArvore').src = 'controlador.php?acao=procedimento_visualizar&acao_origem=arvore_visualizar&id_procedimento=4601&id_documento=12910&infra_sistema=100000100&infra_unidade_atual=110000931&infra_hash=1221487437b6a95d0d9ddfaf3c89eea3d99cf67ea7e3cb4853b964c4d9fd237e';
    }
}

function atualizarArvore(linkArvore) {
    parent.parent.infraOcultarAviso();
    if (detectarExcecao('ifrEditor')) {
        document.getElementById('divArvoreAcoes').style.display = 'none';
    } else {
        parent.document.getElementById('ifrArvore').src = linkArvore;
    }
}

function detectarExcecao(idIFrame) {
    ret = false;

    try {
        var doc = null;
        if (window.frames[idIFrame] != null) {
            if (window.frames[idIFrame].document) {
                doc = window.frames[idIFrame].document;
            } else if (window.frames[idIFrame].contentDocument) {
                doc = window.frames[idIFrame].contentDocument;
            }
        }
        ret = (doc != null && doc.getElementById('divInfraExcecao') != null);
    } catch (exc) {
    }

    return ret;
}

function restaurarImpressao() {
    document.getElementById('divArvoreAcoes').style.display = '';
}


function incluirEmBloco(tipo) {
    document.getElementById('txtBloco').value = '';
    document.getElementById('hdnIdBloco').value = '';
    objLupaBloco.selecionar(700, 500);
}

function visualizarHtmlAssinatura(link) {
    document.getElementById('divArvoreHtml').innerHTML = '<iframe id="ifrArvoreHtml" src="' + link + '" frameborder="0" height="100%" width="100%"></iframe>';
}

function visualizarAssinaturas() {
    if (document.getElementById('ifrTarjasAssinatura').style.display == 'none') {
        document.getElementById('btnVisualizarAssinaturas').innerHTML = 'Ocultar Assinaturas';
        document.getElementById('btnVisualizarAssinaturas').value = 'Ocultar Assinaturas';

        if (document.getElementById('ifrArvoreHtml') != null) {
            document.getElementById('ifrArvoreHtml').style.display = 'none';
        }

        document.getElementById('ifrTarjasAssinatura').style.display = 'block';
    } else {
        document.getElementById('btnVisualizarAssinaturas').innerHTML = 'Visualizar Assinaturas';
        document.getElementById('btnVisualizarAssinaturas').value = 'Visualizar Assinaturas';
        document.getElementById('ifrTarjasAssinatura').style.display = 'none';

        if (document.getElementById('ifrArvoreHtml') != null) {
            document.getElementById('ifrArvoreHtml').style.display = 'block';
        }
    }
}
