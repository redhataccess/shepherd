'use strict';
var hasStorage = ('localStorage' in window && window.localStorage !== null),
    TOUR_STORAGE_KEY = 'RHCP-TOUR';

var hasClass = function(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
};
var addClass = function(elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
};
var removeClass = function(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
};
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


var PortalTour = function() {
    this.intro = introjs();
    this._init(__tours, __actions, __messages);
};

PortalTour.prototype._init = function(tours, actions, messages) {
    this.tours = tours;
    this.actions = actions;
    this.messages = messages;

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
    this.translateTour();
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
        removeClass(document.body, 'portal-tour');
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
    if (!this.currentTour.memento) {
        return false;
    }
    return (this._hasMemento(this.currentTour.memento) === false);
};

PortalTour.prototype.translateTour = function() {
    var lang = 'en';
    if (portal && portal.lang) {
        lang = portal.lang;
    }
    var messageObj = this.messages[this.currentTour.messages],
        // Fall back to english
        langObj = messageObj[lang] || messageObj.en;

    for (var i = 0; i < this.currentTour.steps.length; i++) {
        this.currentTour.steps[i].intro = langObj[this.currentTour.steps[i].key];
    }
};

PortalTour.prototype.startTour = function() {
    // Make sure we are at the top of the page
    window.scrollTo(0, 0);
    addClass(document.body, 'portal-tour');
    this.intro.start();
    if (this.currentTour.memento) {
        this.saveMemento(this.currentTour.memento);
    }
};

PortalTour.prototype._hasMemento = function(memento) {
    var hasMemento = false,
        mementos = safeStore(TOUR_STORAGE_KEY),
        b64Memento = btoa(memento);

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

PortalTour.prototype.saveMemento = function(memento) {
    if(this._hasMemento(memento)) {
        // Don't save it twice
        return;
    }
    var mementos = safeStore(TOUR_STORAGE_KEY) || '';
    mementos += (btoa(memento) + ',');
    safeStore(TOUR_STORAGE_KEY, mementos);
};

return PortalTour;
