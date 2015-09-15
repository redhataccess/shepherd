'use strict';
var hasStorage = ('localStorage' in window && window.localStorage !== null),
    TOUR_STORAGE_KEY = 'RHCP-TOUR';

var searchToObject = function () {
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

var safeStore = function (key, value) {
    if (!hasStorage) {
        return false;
    }
    if (typeof value === 'undefined') {
        return window.localStorage.getItem(key);
    }
    return window.localStorage.setItem(key, value);
};

var hashFn = function (str) {
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


var PortalTour = function () {
    this.intro = introjs();
    this._init(__tours, __actions);
};

PortalTour.prototype._init = function (tours, actions) {
    this.tours = tours;
    this.actions = actions;
    this.translateDfd = null;
    this.userDfd = null;
    this.deferreds = [];
    var searchObj = searchToObject();
    this.currentTour = this.getCurrentTour(searchObj);
    this.buildTour();
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

PortalTour.prototype.getCurrentTour = function (searchObj) {
    var path = window.location.pathname;
    if (searchObj.tour && this.tours[searchObj.tour]) {
        return this.tours[searchObj.tour];
    }
    for (var tour in this.tours) {
        var _tour = this.tours[tour];
        if (_tour.path && new RegExp(_tour.path).test(path)) {
            return _tour;
        }
    }
    // No tour :[
    return {};
};

PortalTour.prototype.buildTour = function () {
    if (this.currentTour && this.currentTour.translate) {
        this.deferreds.push(this.translateTour());
    }

    if (this.currentTour && (this.currentTour.needsUserInfo || this.currentTour.needsAuthentication)) {
        this.deferreds.push(this.getUserInfo());
    }

    var self = this;
    var defaults = {
        buttonClass: 'btn btn-sm',
        prevLabel: '&larr;',
        skipLabel: 'Close',
        doneLabel: 'Finish',
        dock: false,
        showBullets: false,
        showProgress: true,
        showStepNumbers: false,
        overlayOpacity: 0.45,
        arrowPadding: 8
    };
    this.intro.setOptions($.extend(defaults, this.currentTour));
    this.intro.executeCurrentStepCb = function (phase) {
        if (self.currentTour.centerAll) {
            return;
        }

        var index = this._currentStep;
        var step = (this._options && this._options.steps && this._options.steps[index]);
        if (self.currentTour.callBacks && self.currentTour.callBacks[phase] &&
            self.actions[self.currentTour.callBacks[phase]]) {
            self.actions[self.currentTour.callBacks[phase]](step, index, self);
        }
        if (step) {
            if (step && step[phase] && self.actions[step[phase]]) {
                self.actions[step[phase]](step, index, self);
            }
        }
    };
    var onFinish = function () {
        $('body').removeClass('portal-tour');
        this.executeCurrentStepCb('exit');
    };
    this.intro.onbeforechange(function (element) {
        this.executeCurrentStepCb('before');
    });
    this.intro.onchange(function (element) {
        this.executeCurrentStepCb('on');
    });
    this.intro.onafterchange(function (element) {
        this.executeCurrentStepCb('after');
    });
    this.intro.oncomplete(onFinish);
    this.intro.onexit(onFinish);
};

PortalTour.prototype.shouldAutoStart = function () {
    // Check if we are within the tour dates
    if (!this._isTourCurrent()) {
        return false;
    }
    if (!this.currentTour.memento) {
        return false;
    }
    return (this._hasMemento(this.currentTour.memento) === false);
};

PortalTour.prototype.translateTour = function () {
    var dfd = new $.Deferred(),
        self = this;

    var lang = 'en';
    if (window.portal && window.portal.lang) {
        lang = window.portal.lang;
    }

    var messages = 'messages.json';
    if (lang !== 'en') {
        messages = 'messages_' + lang + '.json';
    }

    $.get('/webassets/avalon/j/messages/' + messages).then(function (langObj) {
        var getString = function (key) {
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
        self.intro.setOptions({
            closeLabel: getString('tour_common_closeLabel'),
            nextLabel: getString('tour_common_nextLabel')
        });
        dfd.resolve();
    });

    return dfd.promise();
};

PortalTour.prototype.getUserInfo = function () {
    var dfd = $.Deferred(),
        self = this;

    function userReady() {
        if (self.currentTour.needsAuthentication && (!portal.user_info || !portal.user_info.login)) {
            // bounce
            window.location = ('/login?redirectTo=' + escape(window.location.href));
        }
        if (!portal.user_info.internal) {
            self.currentTour.steps = _.reject(self.currentTour.steps, function (step) {
                return step.internalOnly;
            });

            self.intro.setOptions({
                steps: self.currentTour.steps
            });
        }

        dfd.resolve();
    }

    if (portal && portal.user_info) {
        userReady();
    } else {
        $(document).on('user_info_ready', userReady);
    }

    return dfd.promise();
};

PortalTour.prototype.startTour = function () {
    // Don't start the tour if we can't display it.
    if (!this._canDisplay()) {
        return false;
    }

    if (this.currentTour.centerAllWidth && window.innerWidth <= this.currentTour.centerAllWidth) {
        this.currentTour.centerAll = true;

        $.each(this.currentTour.steps, function (index, step) {
            if (step.element) { delete step.element; }
        });
    }

    var self = this;

    function _start() {
        // Make sure we are at the top of the page
        $('html, body').animate({
            scrollTop: '0px'
        }, 200, 'swing', _.once(function () {
            var intro = self.intro;
            window.__test = intro;
            if (intro._targetElement === null) {
                intro._targetElement = document.body;
            }
            var bodyClassName = 'portal-tour';
            if (self.currentTour.launchTour) {
                bodyClassName += ' launch-tour';
            }
            $('body').addClass(bodyClassName);
            if (self.currentTour.memento) {
                self.saveMemento(self.currentTour.memento);
            }
            var initialStep = searchToObject().step;
            if (initialStep) {
                intro.goToStep(parseInt(initialStep, 10) + 1);
            }
            if (window.chrometwo_ready) {
                window.chrometwo_ready(function () {
                    intro.start();
                });
            } else {
                $(function () {
                    intro.start();
                });
            }
        }));
    }
    if (this.deferreds.length) {
        $.when.apply($, this.deferreds).then(_start);
    } else {
        _start();
    }

};

PortalTour.prototype._hasMemento = function (memento) {
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

PortalTour.prototype._canDisplay = function () {
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
PortalTour.prototype._isTourCurrent = function () {
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

PortalTour.prototype.saveMemento = function (memento) {
    if (this._hasMemento(memento)) {
        // Don't save it twice
        return;
    }
    var mementos = safeStore(TOUR_STORAGE_KEY) || '';
    mementos += (hashFn(memento) + ',');
    safeStore(TOUR_STORAGE_KEY, mementos);
};

return PortalTour;
