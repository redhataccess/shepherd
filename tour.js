define(['introjs', 'jquery', 'underscore', 'moment', 'polyglot'], function (introjs, $, _, moment, P) {
var __actions = {
    _: {
        click: function(selector) {
            var elem = document.querySelector(selector);
            elem && elem.click && elem.click();
        }
    },
    resetMega: function() {
        // Determine if it is active
        var isActive = document.querySelector('.mega-menu.active');
        if (isActive) {
            // It is active... Find the menu that is open and then close it.
            var activeMenu = document.querySelector('.primary-nav .active > a');
            activeMenu && activeMenu.click && activeMenu.click();
        }
    },
    openProducts: function() {
        this._.click('#nav-products > a');
    },
    openTools: function() {
        this._.click('#nav-tools > a');
    },
    openSecurity: function() {
        this._.click('#nav-security > a');
    },
    openCommunity: function() {
        this._.click('#nav-community > a');
    },
    scrollTop: function() {
        window.scrollTo(0, 0);
    }
};

var __tours = {"/home/?$":{"steps":[{"key":"tour.nimbus.home.welcome","tooltipClass":"tooltip-lg"},{"element":".top-nav ul","key":"tour.nimbus.home.topNav","tooltipClass":"tooltip-md","position":"right","highlightClass":"light top"},{"element":".utility-nav ul","key":"tour.nimbus.home.utilityNav","tooltipClass":"tooltip-md","position":"left","highlightClass":"light top right"},{"element":".products-menu .col-md-6.col-sm-8 .root","key":"tour.nimbus.home.products1","tooltipClass":"tooltip-md","on":"openProducts","position":"right"},{"element":".products-menu .col-md-6.col-sm-4.pull-right","key":"tour.nimbus.home.products2","tooltipClass":"tooltip-md","on":"openProducts"},{"element":"'.tools-menu > .row'","key":"tour.nimbus.home.tools","tooltipClass":"tooltip-md","before":"openTools"},{"element":".security-menu .col-sm-12.basic","key":"tour.nimbus.home.security","tooltipClass":"tooltip-md","before":"openSecurity"},{"element":".community-menu .col-sm-12.basic","key":"tour.nimbus.home.community","tooltipClass":"tooltip-md","before":"openCommunity"},{"element":".home-quick-links","key":"tour.nimbus.home.quickLinks","tooltipClass":"tooltip-md","position":"top","highlightClass":"light"},{"element":".home-bottom .row","key":"tour.nimbus.home.whatsNew","tooltipClass":"tooltip-md","position":"top","highlightClass":"light"},{"key":"tour.nimbus.home.feedback","before":"scrollTop","tooltipClass":"tooltip-lg final"}],"callBacks":{"before":"resetMega"},"messagesNS":"tour.nimbus.home","memento":"1014-nimbus-home","startsOn":"20141001","expiresOn":"20141115","hideMobile":"767"}};
'use strict';
var hasStorage = ('localStorage' in window && window.localStorage !== null),
    TOUR_STORAGE_KEY = 'RHCP-TOUR';

var searchToObject = function() {
    if (!location.search) {
        return {};
    }
    var result = {},
        pairs = location.search.slice(1).split('&'),
        length = pairs.length;
    for (var i = 0; i < length; i++) {
        var pair = pairs[i];
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    }
    return result;
};

var safeStore = function(key, value) {
    if (!hasStorage) {
        return false;
    }
    if (typeof value === 'undefined') {
        return window.localStorage.getItem(key);
    }
    return window.localStorage.setItem(key, value);
};

var hashFn = function(str) {
    if (window.btoa) {
        return window.btoa(str);
    }
    // Fall back hash function for IE8&9
    var hash = 0;
    if (str.length === 0) {
        return hash;
    }
    for (var i = 0; i < str.length; i++) {
        var character = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash;
    }
    // Casting this hash to a string to
    // allow strict checking in _hasMemento
    return hash + '';
};


var PortalTour = function() {
    this.intro = introjs();
    this._init(__tours, __actions);
};

PortalTour.prototype._init = function(tours, actions) {
    this.tours = tours;
    this.actions = actions;
    this.translateDfd = null;

    this.currentTour = this.getCurrentTour();
    this.buildTour();

    var searchObj = searchToObject();
    if (searchObj.tour && searchObj.tour === 'false') {
        // Disable tour with tour=false query param
        return;
    }
    if (this.currentTour.steps && searchObj.tour) {
        this.startTour();
    } else if (this.currentTour.steps && this.shouldAutoStart()) {
        this.startTour();
    }
};

PortalTour.prototype.getCurrentTour = function() {
    var path = window.location.pathname;
    for (var tour in this.tours) {
        if (new RegExp(tour).test(path)) {
            return this.tours[tour];
        }
    }
    // No tour :[
    return {};
};

PortalTour.prototype.buildTour = function() {
    this.translateDfd = this.translateTour();
    var self = this;
    this.intro.setOptions({
        steps: this.currentTour.steps,
        buttonClass: 'btn btn-sm',
        prevLabel: '&larr;',
        skipLabel: 'Close',
        doneLabel: 'Close',
        showBullets: false,
        showProgress: true,
        showStepNumbers: false,
        overlayOpacity: 0.45,
        arrowPadding: 8
    });
    this.intro.executeCurrentStepCb = function(phase) {
        if (self.currentTour.callBacks && self.currentTour.callBacks[phase] &&
            self.actions[self.currentTour.callBacks[phase]]) {
            self.actions[self.currentTour.callBacks[phase]]();
        }
        if (this._options && this._options.steps && this._currentStep) {
            var step = this._options.steps[this._currentStep];
            if (step && step[phase] && self.actions[step[phase]]) {
                self.actions[step[phase]]();
            }
        }
    };
    var onFinish = function() {
        $('body').removeClass('portal-tour');
    };
    this.intro.onbeforechange(function(element) {
        this.executeCurrentStepCb('before');
    });
    this.intro.onchange(function(element) {
        this.executeCurrentStepCb('on');
    });
    this.intro.onafterchange(function(element) {
        this.executeCurrentStepCb('after');
    });
    this.intro.oncomplete(onFinish);
    this.intro.onexit(onFinish);
};

PortalTour.prototype.shouldAutoStart = function() {
    // Check if we are within the tour dates
    if (!this._isTourCurrent()) {
        return false;
    }
    if (!this.currentTour.memento) {
        return false;
    }
    return (this._hasMemento(this.currentTour.memento) === false);
};

PortalTour.prototype.translateTour = function() {
    var dfd = new $.Deferred(),
        self = this;

    var lang = 'en',
        version = null;
    if (window.portal && window.portal.lang) {
        lang = window.portal.lang;
    }
    if (window.portal && window.portal.version) {
        version = window.portal.version;
    }
    var keyStr = 'tour.common.*',
        closeLabelKey = 'tour.common.closeLabel',
        nextLabelKey = 'tour.common.nextLabel';

    if (this.currentTour.messagesNS) {
        keyStr += (',' + this.currentTour.messagesNS + '.*');
    }
    P.t(keyStr, lang, version).then(function(values) {
        var langObj = values && values[lang];
        var getString = function(key) {
            if (langObj && langObj[key]) {
                // We have the language object, and the key
                // return the translated string
                return langObj[key];
            }
            // We don't have the language object
            // return the key so we
            // 1) Know the service failed
            // 2) Don't fall on our face
            return key;
        };
        for (var i = 0; i < self.currentTour.steps.length; i++) {
            var key = self.currentTour.steps[i].key;
            self.currentTour.steps[i].intro = getString(key);
        }
        var closeLabel = getString(closeLabelKey),
            nextLabel = getString(nextLabelKey);
        self.intro.setOptions({
            skipLabel: closeLabel,
            doneLabel: closeLabel
        });
        self.intro.setOption('nextLabel', nextLabel);
        dfd.resolve();
    });

    return dfd.promise();
};

PortalTour.prototype.startTour = function() {
    // Don't start the tour if we can't display it.
    if (!this._canDisplay()) {
        return false;
    }
    var self = this;

    function _start() {
        // Make sure we are at the top of the page
        $('html, body').animate({
            scrollTop: '0px'
        }, 200, 'swing', _.once(function() {
            self.intro.start();
            $('body').addClass('portal-tour');
            if (self.currentTour.memento) {
                self.saveMemento(self.currentTour.memento);
            }
        }));
    }
    if (this.translateDfd) {
        this.translateDfd.then(_start);
    } else {
        _start();
    }

};

PortalTour.prototype._hasMemento = function(memento) {
    var hasMemento = false,
        mementos = safeStore(TOUR_STORAGE_KEY),
        b64Memento = hashFn(memento);

    if (!mementos) {
        return false;
    }
    mementos = mementos.split(',');
    for (var i = 0; i < mementos.length; i++) {
        if (mementos[i] === b64Memento) {
            hasMemento = true;
            break;
        }
    }
    return hasMemento;
};

PortalTour.prototype._canDisplay = function() {
    // For now just a mobile check, but I could see other things going in here.
    if (this.currentTour.hideMobile) {
        // Check current innerWidth of window and compare it to the tours
        // Hide on mobile dimension
        if (window.innerWidth <= +this.currentTour.hideMobile) {
            return false;
        }
    }
    return true;
};
PortalTour.prototype._isTourCurrent = function() {
    var now = moment().utc();
    if (this.currentTour.startsOn) {
        if (now.isBefore(moment(this.currentTour.startsOn, 'YYYYMMDD').utc())) {
            return false;
        }
    }
    if (this.currentTour.expiresOn) {
        if (now.isAfter(moment(this.currentTour.expiresOn, 'YYYYMMDD').utc())) {
            return false;
        }
    }

    return true;
};

PortalTour.prototype.saveMemento = function(memento) {
    if (this._hasMemento(memento)) {
        // Don't save it twice
        return;
    }
    var mementos = safeStore(TOUR_STORAGE_KEY) || '';
    mementos += (hashFn(memento) + ',');
    safeStore(TOUR_STORAGE_KEY, mementos);
};

return PortalTour;
});