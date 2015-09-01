/**
 * Created by luzfcb on 27/08/15.
 */

'use strict';
// https://github.com/ckeditor/ckeditor-dev/blob/master/plugins/div/dialogs/div.js#L98-185
function dumpObject(o, pfx, sep) {
	var p;
	var s = "";
	sep = (typeof sep == "undefined") ? " = " : sep;
	pfx = (typeof pfx == "undefined") ? "" : pfx;
	for (p in o) {
		if (typeof (o[p]) != "function")
			s += pfx + p + sep + o[p] + "\n";
		else
			s += pfx + p + sep + "function\n";
	}
	return s;
}


CKEDITOR.plugins.add('lockunlock', {
	icons: 'lock-close,lock-open',
	init: function (editor) {
		editor.addCommand('LockUnlockSelected', {
			exec: function (editor) {
				var selection = editor.getSelection();
				var ranges = selection.getRanges();
				var range = ranges[0];

				if (!selection) {
					return;
				}
				editor.lockSelection(selection);
				var div = new CKEDITOR.dom.element('div');
				div.setStyle('color', 'red');
				div.data('lockunlock-editionblocked', true);

				if (editor.getSelectedHtml(true).length > 0) {
					var selected_html = editor.getSelectedHtml(true);
					console.log("getSelectedHtml: "+ editor.getSelectedHtml(true));
					div.appendHtml(selected_html);
				}
				//range.deleteContents();
				//ranges.insertElementIntoSelection(div);
				console.log("clone: " + range.clone());


				//if (selection.isLocked) {
				//	console.log('destravando');
				//	selection.unlock();
				//}else{
				//	console.log('travando');
				//	selection.lock();
				//}
				console.dir(div);
				console.log(div);
				console.log(div.getOuterHtml());
				editor.insertHtml(div.getOuterHtml(), 'html', range);
				editor.updateElement();
			}
		});
		editor.ui.addButton('LockUnlock', {
			icon: 'lock-open',
			label: 'lock-open',
			command: 'LockUnlockSelected',
			toolbar: 'extraplugins'
		});

		// http://stackoverflow.com/a/27887623/2975300
		// Function depending on editor selection (taken from the scope) will set the state of our command.
		function RefreshState() {
			var editable = editor.editable(),
			// Command that we want to control.
				command = editor.getCommand('LockUnlockSelected'),
				range,
				commandState;

			if (!editable) {
				// It might be a case that editable is not yet ready.
				return;
			}

			// We assume only one range.
			range = editable.getDocument().getSelection().getRanges()[0];

			// The state we're about to set for the command.
			commandState = ( range && !range.collapsed ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;

			command.setState(commandState);
		}

		// We'll use throttled function calls, because this event can be fired very, very frequently.
		var throttledFunction = CKEDITOR.tools.eventsBuffer(50, RefreshState);

		// Now this is the event that detects all the selection changes.
		editor.on('selectionCheck', throttledFunction.input);

		// You'll most likely also want to execute this function as soon as editor is ready.
		editor.on('instanceReady', function (evt) {
			// Also do state refresh on instanceReady.
			RefreshState();
		});
	}
});