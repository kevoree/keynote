function KeynoteMaster(slideURL) {
    var body = document.body;
    var self = this;
    var presentInitialized = false;
    var futureInitialized = false;
    var views = {
        id: null,
        present: null,
        future: null,
        currentSlideNumber: -1
    };
    var events = "INITIALIZE INITIALIZED RUN SLIDE LIST START END FORWARD BACK SET_SLIDE FULLSCREEN NOTES GET_NOTES LENGTH GET_LENGTH POSITION GET_POSITION SET_POSITION EMPTY_SLIDE REMOVE_SLIDE";
    var managedEvents = "START END FORWARD BACK SET_POSITION GET_NOTES GET_LENGTH GET_POSITION EMPTY_SLIDE REMOVE_SLIDE";
    this.getManagedEvents = function () {
        return managedEvents;
    };
    jQuery(body).on("INITIALIZE", function (message) {
        window.addEventListener('message', manageMessage, false);
        var callbackPresent = jQuery.Deferred();
        var callbackFuture = jQuery.Deferred();
        views.present = jQuery("#present").find("iframe").get(0);
        views.future = jQuery("#future").find("iframe").get(0);
        var url = getUrl();
        views.present.src = views.future.src = url;
        jQuery(views.present).load(function () {
            views.present = this.contentWindow;
            callbackPresent.resolve();
        });
        jQuery(views.future).load(function () {
            views.future = this.contentWindow;
            callbackFuture.resolve();
        });

        var callbacks = [];
        callbacks.push(callbackPresent);
        callbacks.push(callbackFuture);
        jQuery.when.apply(null, callbacks).done(function () {
            // add an empty slide on views.future and remove the first one
            views.future.postMessage(stringify({"type": "EMPTY_SLIDE", "position": "END"}), '*');
            views.future.postMessage(stringify({"type": "REMOVE_SLIDE", "position": "START"}), '*');

            // send "INITIALIZED" to views.present and views.future
            views.present.postMessage(stringify({"type": "INITIALIZED"}), '*');
            views.future.postMessage(stringify({"type": "INITIALIZED"}), '*');
        });
    });
    jQuery(body).on("RUN", function () {
        views.present.postMessage(stringify({"type": "SLIDE"}), '*');
        views.future.postMessage(stringify({"type": "SLIDE"}), '*');
    });

    jQuery(body).on(managedEvents, function (message) {
        views.present.postMessage(stringify(message), '*');
        views.future.postMessage(stringify(message), '*');
    });

    this.start = function () {
        var nbInitializeHandlers = jQuery._data(body, "events").INITIALIZE.length;
        var nbInitialized = 0;

        jQuery(body).on("INITIALIZED", function () {
            nbInitialized++;
            if (nbInitialized == nbInitializeHandlers) {
                jQuery(body).trigger("RUN");
            }
        });
        jQuery(body).trigger("INITIALIZE");
    };

    this.addManagedEvent = function (eventName) {
// TODO allow to add new message coming from new plugin
    };

    function getUrl() {	
		return window.location.href.replace("keynote.html","index.html") + "?mode=frame"
    }

    function manageMessage(event) {
        if (event.source === views.present || event.source === views.future) {
            var message = JSON.parse(event.data);
            if (message.type === "INITIALIZED") {
                if (event.source === views.present) {
                    presentInitialized = true;
                } else if (event.source === views.future) {
                    futureInitialized = true;
                }
                if (presentInitialized && futureInitialized) {
                    // must be triggered when views.present and views.future have been initialized !!
                    jQuery(document.body).trigger("INITIALIZED");
                }
            } else if (event.source == views.present) {
                if (message.type === "POSITION") {
                    views.currentSlideNumber = message.position;
                }
                jQuery(document.body).trigger(message);
            }
        }
    }

    this.getCurrentSlideNumber = function () {
        return views.currentSlideNumber;
    };
}