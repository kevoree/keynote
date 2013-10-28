function include(fileName){
  document.write("<script type='text/javascript' src='"+fileName+"'></script>" );
}
include('framework/js/shared.js');
include('framework/js/url.js');
include('framework/js/keynoteShow.js');

include('framework/js/plugins/keyboard.js');
include('framework/js/plugins/popup.js');
include('framework/js/plugins/websocket.js');
include('framework/js/plugins/slidecount.js');
include('framework/js/plugins/notes.js');
include('framework/js/plugins/time.js');

jQuery(document).ready(function () {
     var ks = new KeynoteMaster();
     new KKeyboardKeynote(ks).activate();
     new KPopupMaster(ks, {}).activate();
     new KWebsocketMaster(ks, undefined, jQuery("#keynote-button")).activate();
     new KNotesMaster().activate();
     new KTime().activate();
     new KSlideCountMaster(ks).activate();
     ks.start();
});