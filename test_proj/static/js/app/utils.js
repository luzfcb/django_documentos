function buscar_cep(cep, prefix)
{
	cep = cep.replace(/\D/g,'');
	$.get('/endereco/get_by_cep/'+cep, function(data){
		if(!data.erro)
		{
			$('#id_'+prefix+'estado').val(data.estado_id);
			$('#id_'+prefix+'municipio').val(data.municipio_id);
			$('#id_'+prefix+'bairro_nome').val(data.bairro);
			$('#id_'+prefix+'logradouro').val(data.logradouro);
		}
	},'json');
}

function listar_municipios(estado_id, obj)
{
	$.get('/estado/'+estado_id+'/municipios/', function(data){
		$(obj).html(json_to_options(data));
	}, 'json');
}

function json_to_options(options)
{
	var result = '';
	$(options).each(function(){
		result += '<option value="' + this.id + '">' + this.nome + '</option>';
	});
	return result;
}