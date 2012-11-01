Drag & Drop (html5)
===================
   - drag one or multiple items from one window to another


### Prerequisites
  - [nodejs] (http://nodejs.org)
  - /etc/hosts have :
    127.0.0.1       localhost, hostname

### To start the demo:
   - start nodejs server: cd /path/to/dnd; node node-server.js
   - open first window [http://localhost:8888](http://localhost:8888)
   - open second window [http://hostname:8888/index2.html](http://hostname:8888/index2.html)


inspired from various sources (js)
---
  - [Mozilla develloper](https://developer.mozilla.org/en-US/docs/DragDrop/Drag_Operations#Finishing_a_Drag)
  - [first google resource I picked ](http://decafbad.com/2009/07/drag-and-drop/api-demos.html#data_transfer)

node server (js)
---
  -  [basic example](https://gist.github.com/701407)
  -  [fix/support ajax callback ( "Access-Control-Allow-Origin": "*", )] (http://www.stoimen.com/blog/2010/11/19/diving-into-node-js-very-first-app/)

### TODOS
  - ie support (will wait for ie10?);
