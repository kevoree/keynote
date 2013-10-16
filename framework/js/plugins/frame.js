/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 13/07/13
 * Time: 23:54
 *
 * @author Erwan Daubert
 * @version 1.0
 */
function frame(kslide) {
    var self = this;

    this.activate = function () {
        window.addEventListener("message", manageMessage, false);

        // the following lines are needed because the "INITIALIZED event is sent by the master to synchronize the execution of the slave
        jQuery(document.body).on("INITIALIZE", function () {
        });

        jQuery(document.body).on("RUN", function () {
            window.parent.postMessage(stringify({"type": "INITIALIZED"}), '*');

            jQuery(document.body).on("NOTES", function (message) {
                window.parent.postMessage(stringify(message), '*');
            });
            jQuery(document.body).on("LENGTH", function (message) {
                window.parent.postMessage(stringify(message), '*');
            });
            jQuery(document.body).on("POSITION", onPositionEvent);
        });
    }

    function onPositionEvent(message) {
        window.parent.postMessage(stringify(message), '*');
    }

    function addEmptySlide(position) {
        var emptySlide = document.createElement("section");
        emptySlide.className = "slide";
        emptySlide.id = "EMPTY_SLIDE_" + position;
        if (position != undefined) {
            // look for the position+1 th element on body
            var node = jQuery(document.body).find(".slide:nth-of-type(" + (+position + 1) + ")");
            if (node != null) {
                document.body.insertBefore(emptySlide, node);
            } else {
                document.body.appendChild(emptySlide);
            }
        } else {
            document.body.appendChild(emptySlide);
        }
    }

    function removeSlide(position) {
        if (position != undefined) {
            var node = jQuery(document.body).find(".slide:nth-of-type(" + (+position + 1) + ")");
            if (node != null) {
                document.body.removeChild(node.get(0));
            }
        }
    }

    function manageMessage(event) {
        if (window.parent.document != document && window.parent === event.source) {
            var message = JSON.parse(event.data);
            if (message.type === "EMPTY_SLIDE") {
                if (message.position === "START") {
                    message.position = 0;
                } else if (message.position === "END") {
                    message.position = kslide.getLength();

                }
                addEmptySlide(message.position);
            } else if (message.type === "REMOVE_SLIDE") {
                if (message.position === "START") {
                    message.position = 0;
                } else if (message.position === "END") {
                    message.position = kslide.getLength();

                }
                removeSlide(message.position);
            } else if (message.type !== "RUN") {
                if (message.type === "POSITION") {
                    jQuery(document.body).off("POSITION", onPositionEvent);
                }
                jQuery(document.body).trigger(message);
                if (message.type === "POSITION") {
                    jQuery(document.body).on("POSITION", onPositionEvent);
                }
            }
        }
    }
}