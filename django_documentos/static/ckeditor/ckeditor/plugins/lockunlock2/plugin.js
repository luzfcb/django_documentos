/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "placeholder" plugin.
 *
 */

'use strict';
var contador = 0;

(function () {
	CKEDITOR.plugins.add('lockunlock2', {
		requires: 'widget,dialog',
		lang: 'af,ar,bg,ca,cs,cy,da,de,el,en,en-gb,eo,es,et,eu,fa,fi,fr,fr-ca,gl,he,hr,hu,id,it,ja,km,ko,ku,lv,nb,nl,no,pl,pt,pt-br,ru,si,sk,sl,sq,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		icons: 'lockunlock2', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		onLoad: function () {
			// Register styles for placeholder widget frame.
			CKEDITOR.addCss('.cke_lockunlock2 {background-color: #ff0;} ' +
				'span.cke_lockunlock2 {white-space: pre;}' // corrige erro da nao visualizacao de caractere de espaco no inicio do block span
			);
		},

		init: function (editor) {

			var lang = editor.lang.placeholder;

			// Register dialog.
			//CKEDITOR.dialog.add('lockunlock2', this.path + 'dialogs/placeholder.js');
			// Put ur init code here.
			editor.widgets.add('lockunlock2', {
				// Widget code.
				vaca: 'muuu',
				//dialog: 'lockunlock2',
				pathName: lang.pathName,
				// We need to have wrapping element, otherwise there are issues in
				// add dialog.
				template: '<span class="cke_lockunlock2"></span>',
				//downcast: function () {
				//	console.log('widgets downcast');
				//	return new CKEDITOR.htmlParser.text('[[' + this.data.name + ']]');
				//},

				init: function () {
					console.log('widgets init');
					// Note that placeholder markup characters are stripped for the name.
					var text = this.element.getText();
					//var data_ = this.element.getText().slice(2, -2);
					var data_ = text.slice(2, -2);
					console.log('text:' + text);
					console.log('data_:' + data_);
					//this.setData('name', data_);
				},

				data: function () {
					//console.dir(this.element);
					console.log('widgets data');
					var selection = editor.getSelection();
					var ranges = selection.getRanges();
					var range = ranges[0];

					if (!selection) {
						return;
					}
					console.table(selection);
					editor.lockSelection(selection);
					//var div = new CKEDITOR.dom.element('div');
					//div.setStyle('color', 'red');
					//console.log(this);
					if (editor.getSelectedHtml(true).length > 0) {
						var selected_html = editor.getSelectedHtml(true);
						//console.log("getSelectedHtml: " + editor.getSelectedHtml(true));

						//div.appendHtml(selected_html);
						//this.element.setText('[[' + this.data.name + 'vaca]]');
						//console.dir(this.element);
						this.element.appendHtml(selected_html);
					}
					else{
						console.log('nada feito');
					}

				}
			});

			editor.ui.addButton && editor.ui.addButton('CreateLockUnlock', {
				label: lang.toolbar,
				command: 'lockunlock2',
				toolbar: 'insert,5',
				icon: 'lockunlock2'
			});
		}

		//,afterInit: function (editor) {
		//	var placeholderReplaceRegex = /\[\[([^\[\]])+\]\]/g;
        //
		//	editor.dataProcessor.dataFilter.addRules({
		//		text: function (text, node) {
		//			var dtd = node.parent && CKEDITOR.dtd[node.parent.name];
        //
		//			// Skip the case when placeholder is in elements like <title> or <textarea>
		//			// but upcast placeholder in custom elements (no DTD).
		//			if (dtd && !dtd.span)
		//				return;
        //
		//			return text.replace(placeholderReplaceRegex, function (match) {
		//				// Creating widget code.
		//				var widgetWrapper = null,
		//					innerElement = new CKEDITOR.htmlParser.element('span', {
		//						'class': 'cke_lockunlock2'
		//					});
        //
		//				// Adds placeholder identifier as innertext.
		//				innerElement.add(new CKEDITOR.htmlParser.text(match));
		//				widgetWrapper = editor.widgets.wrapElement(innerElement, 'lockunlock2');
        //
		//				// Return outerhtml of widget wrapper so it will be placed
		//				// as replacement.
		//				return widgetWrapper.getOuterHtml();
		//			});
		//		}
		//	});
		//}
	});

})();
