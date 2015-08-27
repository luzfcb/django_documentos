/**
 * Created by luzfcb on 27/08/15.
 */

'use strict';

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
    icons: 'fabio',
    init: function (editor) {
        editor.addCommand('inserirHora', {
            exec: function (editor) {
                var strong = new CKEDITOR.dom.element('div');
                strong.setStyle('color', 'red');


                var selection = editor.getSelection();
                if(!selection){
                    return;
                }

                var element = selection.getStartElement();
                var selectedElement = selection.getSelectedElement();
                //editor.insertHTML('<strong>' + selectedElement + '</strong>');
                var text = selection.getSelectedText(); //.setData(''); // cleans the selection
                var strikeElement= editor.document.createElement('strike');
                strong.setText(text);
                editor.insertElement(strikeElement);

                element.append(strong, true);
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
        editor.ui.addButton('Fabio', {
            label: 'Insert Timestamp',
            command: 'inserirHora',
            toolbar: 'extraplugins'
        });
    }
});