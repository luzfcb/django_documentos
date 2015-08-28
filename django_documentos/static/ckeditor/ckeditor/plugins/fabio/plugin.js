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


CKEDITOR.plugins.add('fabio', {
	icons: 'fabio,lock-open',
	init: function (editor) {
		editor.addCommand('inserirHora', {
			exec: function (editor) {
				var div = new CKEDITOR.dom.element('div');
				div.setStyle('color', 'red');


				var selection = editor.getSelection();
				if (!selection) {
					return;
				}

				var element = selection.getStartElement();
				var selectedElement = selection.getSelectedElement();
				//editor.insertHTML('<strong>' + selectedElement + '</strong>');
				var text = selection.getSelectedText(); //.setData(''); // cleans the selection
				//var strikeElement= editor.document.createElement('strike');
				div.setText(text);
				//editor.insertElement(strikeElement);

				element.append(div, true);
				console.dir(selection);
				console.log(selection.getSelectedText());
				console.dir(element);
				console.log(element.getHtml());
				//console.log('editor:');
				//console.log(Object.getOwnPropertyNames(editor).filter(function (p) {
				//    return typeof editor[p];
				//    //return typeof editor[p] === 'function';
				//}));
				//console.log(dumpObject(editor));
				//
				//console.log('selection:');
				//console.log(Object.getOwnPropertyNames(selection).filter(function (p) {
				//    return typeof selection[p];
				//    //return typeof editor[p] === 'function';
				//}));
				//console.log(dumpObject(selection));
				//
				//
				//console.log('element:');
				//console.log(Object.getOwnPropertyNames(element).filter(function (p) {
				//    return typeof element[p];
				//    //return typeof editor[p] === 'function';
				//}));
				//console.log(dumpObject(element));

				//console.log(selection);
				//var now = new Date();
				//editor.insertHtml('The current date and time is: <em>' + now.toString() + '</em>');
				//editor.insertHtml('\n' + selection)
			}
		});
		//editor.addCommand('save', {
		//	modes: {wysiwyg: 1, source: 1},
		//	exec: function (editor) {
		//		if (My.Own.CheckDirty())
		//			My.Own.Save();
		//		else
		//			alert("No changes.");
		//	}
		//});
		//editor.ui.addButton('Save', {label: '', command: 'save'});

		editor.ui.addButton('Fabio', {
			label: 'Insert Timestamp',
			command: 'inserirHora',
			toolbar: 'extraplugins'
		});
		editor.ui.addButton('Fabio2', {
			icon: 'lock-open',
			label: 'lock-open',
			command: 'save',
			toolbar: 'extraplugins'
		});

		// http://stackoverflow.com/a/27887623/2975300
		// Funciton depending on editor selection (taken from the scope) will set the state of our command.
		function RefreshState() {
			var editable = editor.editable(),
			// Command that we want to control.
				command = editor.getCommand('inserirHora'),
				range,
				commandState;

			if (!editable) {
				// It might be a case that editable is not yet ready.
				return;
			}

			// We assume only one range.
			range = editable.getDocument().getSelection().getRanges()[0];
			console.log('dir:');
			console.dir(range);
			console.log('log:');
			console.log(range);
			var pp = prettyPrint(range);
			document.getElementById('appdebug').appendChild(pp);



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