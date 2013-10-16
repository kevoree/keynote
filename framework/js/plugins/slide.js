/**
 * User: Erwan Daubert - erwan.daubert@gmail.com
 * Date: 28/05/13
 * Time: 10:29
 *
 * @author Erwan Daubert
 * @version 1.0
 */

function SlidePlugin(preser) {

    var self = this;
    var url = new URL(preser);

    this.activate = function () {
        jQuery(document.body).on("RUN", function () {
//        console.log("starting slide plugin");
            jQuery(document.body).on("SET_SLIDE", function (event) {
                // we do nothing if the current slide is the last one
                if (event.slideNumber === undefined || event.slideNumber < 0) {
                    goToSlide(0);
                } else if (event.slideNumber < preser.getLength()) {
                    goToSlide(event.slideNumber);
                }
            });

            jQuery(document.body).on("SET_POSITION", function (event) {
                // we do nothing if the current slide is the last one
                if (event.position === undefined || event.position < 0) {
                    goToSlide(0);
                } else if (event.position < preser.getLength()) {
                    goToSlide(event.position);
                }
            });

            jQuery(document.body).on("START", goToStart);

            jQuery(document.body).on("END", goToEnd);

            jQuery(document.body).on("SET_CURSOR", function (event) {
                goToSlide(event.cursor)
            });

            jQuery(document.body).on("SLIDE", goToSlideMode);

            jQuery(document.body).on("LIST", goToListMode);

            jQuery(window).resize(function () {
                if (preser.isSlideMode()) {
                    preser.applyTransform(preser.getTransform());
                }
            });

            if (preser.isSlideMode()) {
//                goToSlideMode();
                jQuery(document.body).trigger({ type : "SLIDE"})
            } else {
//                goToListMode();
                jQuery(document.body).trigger({ type : "LIST"})
            }
        });
    };

    function goToSlideMode() {
        var slideNumber = preser.getCurrentSlideNumber();
        var search = "";
        var hash = "";
        // there is no slide selected, we select the first one
        if (-1 === slideNumber) {
            preser.getUrl().hash = preser.getSlideHash(0);
            search = url.updateSearch("slide", null);
        } else {
            preser.getUrl().hash = preser.getSlideHash(slideNumber);
            search = url.updateSearch("slide", null);
        }
        enterSlideMode();
        history.replaceState(null, null, preser.getUrl().origin + preser.getUrl().pathname + search + preser.getUrl().hash);
    }

    function goToListMode() {
        var slideNumber = preser.getCurrentSlideNumber();
        var search = url.removeSearch("slide");
        history.replaceState(null, null, preser.getUrl().origin + preser.getUrl().pathname + search + preser.getUrl().hash);
        enterListMode();
        scrollToSlide(slideNumber);
    }

    function enterSlideMode() {
        jQuery(document.body).removeClass('list');
        jQuery(document.body).addClass('slideMode');
        preser.applyTransform(preser.getTransform());
    }

    function enterListMode() {
        jQuery(document.body).removeClass('slideMode');
        jQuery(document.body).addClass('list');
        preser.applyTransform('none');
        jQuery(document.body).trigger('list');
    }

    function goToSlide(slideNumber) {
        if (-1 == slideNumber || slideNumber >= preser.length) {
            return;
        }
        preser.getUrl().hash = preser.getSlideHash(slideNumber);
    }

    function goToStart() {
        goToSlide(0);
    }

    function goToEnd() {
        goToSlide(preser.getLength() - 1);
    }

    function scrollToSlide(slideNumber) {
        // do nothing if currentSlideNumber is unknown (-1)
        if (-1 === slideNumber) {
            return;
        }
        var currentSlide = jQuery("#" + preser.getSlide(slideNumber).id).get(0);

        if (null != currentSlide) {
            window.scrollTo(0, currentSlide.offsetTop);
        }
    }
}