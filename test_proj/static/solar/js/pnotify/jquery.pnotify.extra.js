var notice = null;

function show_stack(msg, hide, type)
{
	if(type==undefined) type = 'notice';
	if(hide==undefined) hide = true;

	hide_stack();
	notice = $.pnotify({
					    title: false,
					    text: msg,
					    type: type,
					    icon: false,
					    animate_speed: 'fast',
					    sticker: false
					});	
}

function hide_stack()
{
	if(notice!=null)
		notice.pnotify_remove();
}

function show_stack_info(msg, hide)
{
	show_stack(msg, hide, 'info');
}

function show_stack_success(msg, hide)
{
	show_stack(msg, hide, 'success');
}

function show_stack_error(msg, hide)
{
	show_stack(msg, hide, 'error');
}