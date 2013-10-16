function Keynote() {

    var url = window.location;
    var body = document.body;
    var slides = null;
    var slideList = null;
    var self = this;

    this.hasInnerNavigation = function (slideNumber) {
        return slideList[slideNumber].hasInnerNavigation;
    };

    function initializeSlidesList() {
        slideList = [];
        slides = jQuery('* .slide');
        slides.each(function (index, slide) {
            if (!slide.id) {
                slide.id = index;
            }
            slideList.push({
                id: slide.id,
                hasInnerNavigation: null !== slide.querySelector('.next')
            });
        });
    }

    this.start = function () {
        var nbInitializeHandlers = jQuery._data(body, "events").INITIALIZE.length;
        var nbInitialized = 0;

        jQuery(body).on("INITIALIZED", function () {
            nbInitialized++;
            if (nbInitialized == nbInitializeHandlers) {
                initializeSlidesList();
                jQuery(body).trigger("RUN");
            }
        });
        jQuery(body).trigger("INITIALIZE");

    };

    this.getMode = function () {
        var attributes = url.search.substring(1).split("&");
        for (var i = 0; i < attributes.length; i++) {
            var element = attributes[i];
            if (element.split("=")[0] === "mode") {
                return element.split("=")[1];
            }
        }
        return null;
    };

    this.getUrl = function () {
        return url;
    };

    this.getLength = function () {
        if (slideList == null) {
            return undefined;
        } else {
            return slideList.length;
        }
    };

    this.getSlide = function (slideNumber) {
        return slides[slideNumber];
    };

    this.isSlideMode = function () {
        return !self.isListMode();
    };

    this.isListMode = function () {
        return  -1 == url.search.indexOf('slide');
    };

    this.getCurrentSlideNumber = function () {
        var currentSlideId = url.hash.substr(1);
        for (var i = 0; i < slideList.length; ++i) {
            if (currentSlideId === slideList[i].id) {
                return i;
            }
        }
        return -1;
    };

    function normalizeSlideNumber(slideNumber) {
        if (0 > slideNumber) {
            return slideList.length - 1;
        } else if (slideList.length <= slideNumber) {
            return 0;
        } else {
            return slideNumber;
        }
    }

    this.getSlideHash = function (slideNumber) {
        return '#' + slideList[normalizeSlideNumber(slideNumber)].id;
    };

    this.getTransform = function () {
        var denominator = Math.max(
            (body.clientWidth / window.innerWidth),
            (body.clientHeight / window.innerHeight)
        );
        return 'scale(' + (1 / denominator) + ')';
    };

    this.applyTransform = function (transform) {
        body.style.WebkitTransform = transform;
        body.style.MozTransform = transform;
        body.style.msTransform = transform;
        body.style.OTransform = transform;
        body.style.transform = transform;
    };
}