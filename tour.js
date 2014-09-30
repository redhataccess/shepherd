define(['introjs'], function (introjs) {
var actions = {
    _: {
        click: function(selector) {
            var elem = document.querySelector(selector);
            elem && elem.click && elem.click();
        }
    },
    resetMega: function() {
        // Determine if it is active
        var isActive = document.querySelector('.mega.active');
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
    }
};

var messages = {"home":{"en":{"welcome-nav":"<h3>Welcome to the newly redesigned Customer Portal</h3><h4>We've refined our navigation to make it easier to find things in the Portal</h4>","products-one":"<strong>Products & Services</strong> is the single place to find everything you need for your Red Hat products and services.  The product pages are still your definitive source of Red Hat product knowledge with getting started guides, product documentation, discussions, and more.","products-two":"Also in <strong>Products & Services</strong> you’ll find the Red Hat Certification ecosystem and general information about knowledge, support policies, and more.","tools":"<strong>Tools</strong> is a new place for everything Red Hat develops to ensure your success with your Red Hat products. Red Hat Access Labs, Plug-ins, and additional tools can now be found here.","security":"All Red Hat <strong>Security</strong> resources can be found here including the CVE database, information on the Red Hat Product Security team, and relevant policy information.","community":"<strong>Community</strong> is now the place for Red Hat associates and customers to collaborate. Discussions, blogs, events, and more are now available here.","top-nav":"We placed important utilities at the top of the Customer Portal. Now, you're only one click away from managing your subscriptions, downloads, or support cases.","utility-nav":"You can search, log in, and change your language from this global bar.","quick-links":"We added a common tasks bar so you can quickly find frequently needed links.","whats-new":"See what's new with Red Hat and the Customer Portal including important announcements, new Red Hat Access Labs, product releases, and more."},"_es":{},"_de":{},"_it":{},"_ko":{},"_fr":{},"_ja":{},"_pt":{},"_zn_CH":{},"_ru":{}}};
var tours = {"/home/?$":{"steps":[{"element":".primary-nav","intro":"welcome-nav","tooltipClass":"tooltip-lg"},{"element":".products-menu .col-md-6.col-sm-8","intro":"products-one","tooltipClass":"tooltip-md","on":"openProducts","position":"right"},{"element":".products-menu .col-md-6.col-sm-4.pull-right","intro":"products-two","tooltipClass":"tooltip-md","on":"openProducts"},{"element":".tools-menu .col-sm-9.basic","intro":"tools","tooltipClass":"tooltip-md","before":"openTools"},{"element":".security-menu .col-sm-12.basic","intro":"security","tooltipClass":"tooltip-md","before":"openSecurity"},{"element":".community-menu .col-sm-12.basic","intro":"community","tooltipClass":"tooltip-md","before":"openCommunity"},{"element":".top-nav ul","intro":"top-nav","tooltipClass":"tooltip-md","position":"right","highlightClass":"light top"},{"element":".utility-nav ul","intro":"utility-nav","tooltipClass":"tooltip-md","position":"left","highlightClass":"light top right"},{"element":".home-quick-links","intro":"quick-links","tooltipClass":"tooltip-md","position":"top","highlightClass":"light"},{"element":".home-bottom .row","intro":"whats-new","tooltipClass":"tooltip-md","position":"top","highlightClass":"light"}],"callBacks":{"before":"resetMega"},"messages":"home","memento":"1014-nimbus-home"}};
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
    this._init(tours, actions);
};

PortalTour.prototype._init = function(tours, actions) {
    this.tours = tours;
    this.actions = actions;

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
    if (!this.current.memento) {
        return false;
    }
    return (this._hasMemento(this.current.memento) === false);
};

PortalTour.prototype.translateTour = function() {
    var lang = 'en';
    if (portal && portal.lang) {
        lang = portal.lang;
    }
    var messageObj = messages[this.currentTour.messages],
        // Fall back to english
        langObj = messageObj[lang] || messageObj.en;

    for (var i = 0; i < this.currentTour.steps; i++) {
        this.currentTour.steps[i].intro = langObj[this.currentTour.steps[i].intro];
    }
};

PortalTour.prototype.startTour = function() {
    // Make sure we are at the top of the page
    window.scrollTo(0, 0);
    addClass(document.body, 'portal-tour');
    this.intro.start();
    if (this.current.memento) {
        this.saveMemento(this.current.memento);
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
    var mementos = safeStore(TOUR_STORAGE_KEY) || '';
    mementos += (btoa(memento) + ',');
    safeStore(TOUR_STORAGE_KEY, mementos);
};

return PortalTour;
});