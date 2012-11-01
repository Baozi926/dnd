var app = app || {};

app.debugMode = false;

app = (function () {
  "use strict";
  var internalDNDType = 'text/x-dnd-json', // set this to something specific to your source: http://www.w3.org/TR/html5/dnd.html#dnd
    hoverClass = "-hover",
    selectedClass = "-selected",
    draggingClass = "-dragging",
    hiddenClass = "-hidden",
    helperClasses = [selectedClass, hoverClass, draggingClass],
    responseTmpl = "item(s) with id(s): [{1}] successfully moved!";

  $(document.body ).bind( "newItemsLoaded.alertBox", function(event, data){
    var responseText = responseTmpl.replace("{1}", data.ids);
     $("#alertBox" ).find(".-response" ).text( responseText );
     $("#alertBox" ).fadeIn();
  });

  var selectOnlyOne = function( item ){
    $( item ).siblings().removeClass( selectedClass );
    $( item ).addClass( selectedClass );
  };

  var resetStyle = function( item ){
    helperClasses.forEach(function(className){
      $( item ).removeClass( className );
    });
  };

  var getDraggedItems = function( $draggableSelector ){
    return $( $draggableSelector ).filter(function(){
        return $(this ).hasClass( draggingClass)
          || $( this ).hasClass( selectedClass );
      });
  };

  var _log = function( message ) {
    if ( console && app.debugMode ) {
      console.log( message );
    }
  };

  return {
    makeDraggable: function ( $draggableSelector ) {
      $( $draggableSelector )
        .bind( "mouseup.dnd", function( ev ){
          if ( ev.ctrlKey ) {
            if ($( this ).hasClass( selectedClass )) {
              _log("removing");
            }
            $( this ).toggleClass( selectedClass );
          } else {
            selectOnlyOne( this );
          }
        })
        .bind( "mouseenter.dnd", function () {
          $( this ).addClass( hoverClass );
        })
        .bind( "mouseleave.dnd", function () {
          $( this ).removeClass( hoverClass );
        })

        // Set the element as draggable.
        .attr( "draggable", "true" )

        // Handle the start of dragging to initialize.
        .bind( "dragstart.dnd", function ( jqueryEvent ) {
          var event = jqueryEvent.originalEvent,
            dataTransfer = event.dataTransfer;

          if ( !event.target instanceof HTMLLIElement ) {
            event.preventDefault(); // don't allow selection to be dragged
          }

          $( this ).addClass( draggingClass );

          var ids = [],
            $selectedItems = getDraggedItems( $draggableSelector );

          if ( $selectedItems.size() === 0) {
            ids.push( event.target.dataset.id );
          }

          $selectedItems.each(function(){
            $( this ).addClass( draggingClass );
            ids.push( this.dataset.id );
          });

          var myjson = {
            "origin" : internalDNDType,
            "ids" : ids.join( "," )
          };

          dataTransfer.setData( internalDNDType, JSON.stringify(myjson));
          dataTransfer.effectAllowed = 'move'; // only allow moves
        })

        // Handle the end of dragging.
        .bind( "dragend.dnd", function (ev) {
          var dt = ev.originalEvent.dataTransfer;
          if ( dt.dropEffect === "move" ) {
            _log(getDraggedItems( $draggableSelector ));
            getDraggedItems( $draggableSelector ).each(function(){
              $( this ).remove();
              if ( $( $draggableSelector ).size() === 1) {
                $( $draggableSelector ).filter(".placeholder").removeClass( hiddenClass )
              }
            });
          }
          resetStyle(this);
          return false;
        });
    },

    makeDroppable: function ($droppable) {

      $(document.body ).bind( "newItemsLoaded.dropppableContainer", function(event, data){
         $( $droppable ).prepend( data.response );
      });

      $( $droppable )
        .bind( "dragenter.dnd", function () {
          $( this ).addClass( hoverClass );
          return false;
        })

        // Un-highlight on drag leaving drop zone.
        .bind( "dragleave.dnd", function () {
          $( this ).removeClass( hoverClass );
          return false;
        })

        // Decide whether the thing dragged in is welcome.
        .bind( "dragover.dnd", function (ev) {
          ev.originalEvent.dataTransfer.dropEffect = 'move';
          return false;
        })

        // Handle the final drop...
        .bind( "drop.dnd", function (jqueryEvent) {
          var event = jqueryEvent.originalEvent,
            rowData = event.dataTransfer.getData( internalDNDType ),
            data;

            try {
              // to avoid dropping "bad" content such "<script>...</script>"
              data = JSON.parse(rowData);
            } catch (e ) {
              _log(e);
              return;
            }

            if (data.origin != internalDNDType ) {
              _log("sorry");
              return;
            }

            if ( event.stopPropagation ) {
              event.stopPropagation(); // Stops some browsers from redirecting.
            }

            $.ajax({
              "url" : "/getNewItems",
              "data" : {
                "ids" : data.ids
              },
              "success": function( response ){
                $( document.body ).trigger( "newItemsLoaded", [{ "ids": data.ids, "response" : response }] );
              }
            })
          }
        );
    }
  }
})();

