function include(fileName){
  document.write("<script type='text/javascript' src='"+fileName+"'></script>" );
}
include('framework/js/keynote.js');
include('framework/js/screenfull.min.js');
include('framework/js/shared.js');
include('framework/js/url.js');

include('framework/js/plugins/active.js');
include('framework/js/plugins/frame.js');
include('framework/js/plugins/h2list.js');
include('framework/js/plugins/include.js');
include('framework/js/plugins/keyboard.js');
include('framework/js/plugins/notes.js');
include('framework/js/plugins/popup.js');
include('framework/js/plugins/progress.js');
include('framework/js/plugins/slide.js');
include('framework/js/plugins/slidecount.js');
include('framework/js/plugins/time.js');
include('framework/js/plugins/websocket.js');

jQuery(document).ready(function () {
            var ks = new Keynote();
			var mode = ks.getMode();
			if (mode === "frame") {
				new frame(ks).activate();
				new KNotesSlave(ks).activate();
				new KSlideCountSlave(ks).activate();
			}
		    new IncludePlugin(ks).activate();
		    new H2List(ks, 5).activate();
		    new KKeyboard(ks).activate();
		           new ActivePlugin(ks).activate();
		           new SlidePlugin(ks).activate();
		           new ProgressPlugin(ks).activate();
            ks.start();
        });