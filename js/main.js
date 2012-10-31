var app = app || {};


app = (function ($draggable) {
  var
    hoverClass = "-hover",
    draggingClass = "-dragging";

  $(document.body ).bind( "newItem", function(event, newItem){
     app.makeDraggable(newItem);
  });

  return {
    makeDraggable: function ( $draggable ) {
      $( $draggable )
        .bind( "mouseenter", function () {
          $( this ).addClass( hoverClass );
        })
        .bind( "mouseleave", function () {
          $( this ).removeClass( hoverClass );
        })

        // Set the element as draggable.
        .attr( "draggable", "true" )

        // Handle the start of dragging to initialize.
        .bind( "dragstart", function (ev) {
          // dragged property works for drops inside the root doc.
          $( this ).css( "opacity", .4 );
          $node = $( ev.target ).addClass( draggingClass );

          // Set text & HTML content for drops outside the root doc.
          var dt = ev.originalEvent.dataTransfer;
          dt.setData( "text/html", $node.html() );
          dt.setData( "text/plain", $node.text() );
          return true;
        })

        // Handle the end of dragging.
        .bind( "dragend", function (ev) {
          // $.log( "#newschool .messages", "Drag ended" );
          $( this ).css( "opacity", 1 )
            .removeClass( "-dragging -hover" );

          var dt = ev.originalEvent.dataTransfer;
          if ( dt.dropEffect === "move" ) {
            $( this ).remove()
          }
          return false;
        });
    },

    makeDroppable: function ($droppable) {
      $( $droppable )
        .bind( "dragenter", function (ev) {
          $( this ).addClass( hoverClass );
          return false;
        })

        // Un-highlight on drag leaving drop zone.
        .bind( "dragleave", function (ev) {
          $( this ).removeClass( hoverClass );
          return false;
        })

        // Decide whether the thing dragged in is welcome.
        .bind( "dragover", function (ev) {
          return false;
        })

        // Handle the final drop...
        .bind( "drop", function (ev) {
          $( this ).removeClass( hoverClass );

          if ( ev.stopPropagation ) {
            ev.stopPropagation(); // Stops some browsers from redirecting.
          }
          var dt = ev.originalEvent.dataTransfer,
            data = (dt.getData( "text/plain" ));

          $( this ).prepend( "<li>" + data + "</li>" );
          $(document.body ).trigger( "newItem", $( this ).find("li:first") );
          return false;
        });

    }
  }
})();

