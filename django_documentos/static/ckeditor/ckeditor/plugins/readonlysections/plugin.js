/**
 * Created by luzfcb on 26/08/15.
 */

CKEDITOR.plugins.add('readonlysections', {
    requires: 'widget',

    icons: 'readonlysections',
    //hidpi: !0,

    init: function (editor) {
        editor.widgets.add('readonlysections', {

            button: 'Define sessao somente leitura'

            //template:
            //    '<div class="simplebox">' +
            //        '<h2 class="simplebox-title">Title</h2>' +
            //        '<div class="simplebox-content"><p>Content...</p></div>' +
            //    '</div>',
            //
            //editables: {
            //    title: {
            //        selector: '.simplebox-title',
            //        allowedContent: 'br strong em'
            //    },
            //    content: {
            //        selector: '.simplebox-content',
            //        allowedContent: 'p br ul ol li strong em'
            //    }
            //},
            //
            //allowedContent:
            //    'div(!simplebox); div(!simplebox-content); h2(!simplebox-title)',
            //
            //requiredContent: 'div(simplebox)',
            //
            //upcast: function( element ) {
            //    return element.name == 'div' && element.hasClass( 'simplebox' );
            //}
        });
        editor.ui.addButton && editor.ui.addButton("CreatePlaceholder", {
            label: 'asdasd',
            command: "readonlysections",
            toolbar: "insert,0",
            icon: "readonlysections"
        });
        console.log('Iniciou readonlysections');
    }

});