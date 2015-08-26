/*
  Plugin that prevents editing of elements with the "non-editable" class as well as elements outside of blocks with "editable" class.
*/

//* **************************  NOTES  ***************************  NOTES  ****************************
/*
  The "lastSelectedElement" variable is used to store the last element selected.

  This plugin uses the "elementspath" plugin which shows all elements in the DOM
  parent tree relative to the current selection in the editing area.

  When the selection changes, "elementsPathUpdate" is fired,
  we key on this and loop through the elements in the tree checking the classes assigned to each element.

  Three outcomes are possible.

  1) The non-editable class is found:
  Looping stops, the current action is cancelled and the cursor is moved to the previous selection.
  The "selectionChange" hook is fired to set the reverted selection throughout the instance.

  2) The editable class is found during looping, the "in_editable_area" flag is set to true.

  3) Neither the editable or the non-editable classes are found (user clicked outside your main container).
  The "in_editable_area" flag remains set to false.

  If the "in_editable_area" flag is false, the current action is cancelled and the cursor is moved to the previous location.
  The "selectionChange" hook is fired to set the reverted selection throughout the instance.

  If the "in_editable_area" flag is true,
  the "lastSelectedElement" is updated to the currently selected element and the plugin returns true.

---------------
  If you don't want the elements path to be displayed at the bottom of the editor window,
  you can hide it with CSS rather than disabling the "elementspath" plugin.

  The elementspath plugin creates and is left active because we are keying on changes to the path in our plugin.
  #cke_path_content
  {
    visibility: hidden !important;
  }

---------------
  CSS Classes and ID that the plugin keys on. Use defaults or update variables to use your preferred classes and ID:

  var starting_element_id = ID of known editable element that always occurs in the instance.
  Don't use elements like <table>, <tr>, <br /> that don't contain HTML text.
  Default value = cwjdsjcs_editable_id

  var editable_class = class of editable containers.
  Should be applied to all top level elements that contain editable elements.
  Default = cwjdsjcs_editable

  var non_editable_class = class of non-editable elements within editable containers
  Apply to elements where all child elements are non-editable.
  Default = cwjdsjcs_not_editable

*/

//* **************************  END NOTES  ***************************  END NOTES  ****************************


// Register the plugin with the editor.
// http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.plugins.html
CKEDITOR.plugins.add( 'readonlysections2',
{
  requires : [ 'elementspath' ],
    icons: 'readonlysections2',

  // The plugin initialization logic goes inside this method.
  // http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.pluginDefinition.html#init
  init: function( editor )
  {
    editor.on( 'instanceReady', function( instance_ready_data )
    {
      // Create variable that will hold the last allowed selection (for use when a non-editable selection is made)
      var lastSelectedElement;
      editor.cwjdsjcs_just_updated = false;

      // This section starts things off right by selecting a known editable element.
      // *** Enter the ID of the element that should have initial focus *** IMPORTANT *** IMPORTANT ***
      var starting_element_id = "cwjdsjcs_editable_id";

      var resInitialRange = new CKEDITOR.dom.range( editor.document );

      resInitialRange.selectNodeContents( editor.document.getById( starting_element_id ) );
      resInitialRange.collapse();

      var selectionObject = new CKEDITOR.dom.selection( editor.document );

      editor.document.focus();
      selectionObject.selectRanges( [ resInitialRange ] );

      var sel = editor.getSelection();
      var firstElement = sel.getStartElement();
      var currentPath = new CKEDITOR.dom.elementPath( firstElement );

      // Set path for known editable element, fire "selectionChange" hook to update selection throughout instance.
      editor._.selectionPreviousPath = currentPath;
      editor.fire( 'selectionChange', { selection : sel, path : currentPath, element : firstElement } );
    }); // *** END - editor.on( 'instanceReady', function( e )


    // When a new element is selected by the user, check if it's ok for them to edit it,
    // if not move cursor back to last know editable selection
    editor.on( 'elementsPathUpdate', function( resPath )
    {
      // When we fire the "selectionChange" hook at the end of this code block, the "elementsPathUpdate" hook fires.
      // No need to check because we just updated the selection, so bypass processing.
      if( editor.cwjdsjcs_just_updated == true )
      {
        editor.cwjdsjcs_just_updated = false;
        return true;
      }

      var elementsList = editor._.elementsPath.list;
      var in_editable_area = false;
      var non_editable_class = "cwjdsjcs_not_editable";
      var editable_class = "cwjdsjcs_editable";

      for(var w=0;w<elementsList.length;w++){
        var currentElement = elementsList[w];

        // Sometimes a non content element is selected, catch them and return selection to editable area.
        if(w == 0)
        {
          // Could change to switch.
          if( currentElement.getName() == "tbody" )
          {
            in_editable_area = false;
            break;
          }

          if( currentElement.getName() == "tr" )
          {
            in_editable_area = false;
            break;
          }
        }

        // If selection is inside a non-editable element, break from loop and reset selection.
        if( currentElement.hasClass(non_editable_class) )
        {
          in_editable_area = false;
          break;
        }

        if( currentElement.hasClass(editable_class) ) {
          in_editable_area = true;
        }
        console.log(currentElement);
        console.log(currentElement.getName());
      }

      // if selection is within an editable element, exit the plugin, otherwise reset selection.
      if( in_editable_area ) {
        lastSelectedElement = elementsList[0];
        return true;
      }

      var resRange = new CKEDITOR.dom.range( editor.document );

      resRange.selectNodeContents( lastSelectedElement );
      resRange.collapse();
      editor.getSelection().selectRanges( [ resRange ] );
      resRange.endContainer.$.scrollIntoView();

      // Open dialog window:
      // It tells user they selected a non-editable area and cursor has been returned to previous selection
//      currentEditorName = editor.name;
//      openResDefaultDialog(currentEditorName);

      try
      {
        var sel = editor.getSelection();
        var firstElement = sel.getStartElement();
        var currentPath = new CKEDITOR.dom.elementPath( firstElement );
        editor.cwjdsjcs_just_updated = true;

        editor._.selectionPreviousPath = currentPath;
        editor.fire( 'selectionChange', { selection : sel, path : currentPath, element : firstElement } );

      }
      catch (e)
      {}
    });
  } // *** END - init: function( editor )
});