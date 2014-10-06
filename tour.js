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
    return hash;
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
    var keyStr = '';
    for (var i = 0; i < this.currentTour.steps.length; i++) {
        if (keyStr !== '') {
            keyStr += ',';
        }
        keyStr += this.currentTour.steps[i].key;
    }
    P.t(keyStr, lang, version).then(function(values) {
        for (var i = 0; i < self.currentTour.steps.length; i++) {
            self.currentTour.steps[i].intro = values[self.currentTour.steps[i].key];
        }
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
