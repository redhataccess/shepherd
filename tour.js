(function(){var utils = {
    click: function(selector) {
        var elem = document.querySelector(selector);
        elem && elem.click && elem.click();
    }
};

var actions = {
    resetMega: function() {
        // Determine if it is active
        var isActive = document.querySelector('.mega.active');
        if(isActive){
            // It is active... Find the menu that is open and then close it.
            var activeMenu = document.querySelector('.primary-nav .active > a');
            activeMenu && activeMenu.click && activeMenu.click();
        }
    },
    openProducts: function() {
        utils.click('#nav-products > a');
    },
    openTools: function() {
        utils.click('#nav-tools > a');
    },
    openSecurity: function() {
        utils.click('#nav-security > a');
    },
    openCommunity: function() {
        utils.click('#nav-community > a');
    }
};

var tours = {"/home/?$":{"steps":[{"intro":"<h1>Welcome to the newly redesigned Customer Portal</h1><h2>Tour the new layout to see what's changed</h2>","tooltipClass":"tooltip-lg"},{"element":".primary-nav","intro":"We've refined our navigation to make it easier to find things in the Portal","tooltipClass":"tooltip-md"},{"element":".products-menu .col-md-6.col-sm-4.pull-right","intro":"Products & Services is the single place to find everything you need about your product. Certification, Product documentation and content, and Support Policies can all be found from here.","tooltipClass":"tooltip-md","on":"openProducts","position":"left"},{"element":".tools-menu .col-sm-9.basic","intro":"Tools is a new place for everything Red Hat Support develops to make your life easier. Red Hat Access Labs and Plug-in, and additional tools can now all be found here.","tooltipClass":"tooltip-md","before":"openTools"},{"element":".security-menu .col-sm-12.basic","intro":"Everything Security related can be found here including the CVE database, information on the Red Hat Product Security team, and relevant policy information.","tooltipClass":"tooltip-md","before":"openSecurity"},{"element":".community-menu .col-sm-12.basic","intro":"Community is now the place for our two-way interactions! Discussions, Blogs, Events, and feedback are now available from here.","tooltipClass":"tooltip-md","before":"openCommunity"},{"element":".top-nav ul","intro":"We've placed important utilities at the top of the Customer Portal. Now, you're only one click away any time from managing your subscriptions, downloads, or support cases.","tooltipClass":"tooltip-md","position":"right","highlightClass":"light top"},{"element":".utility-nav ul","intro":"You can search, login, and change your language from this global bar at any time!","tooltipClass":"tooltip-md","position":"left","highlightClass":"light top right"},{"element":".home-quick-links","intro":"We've also provided some key tasks from here to jump right into the tasks that matter the most to you.","tooltipClass":"tooltip-md","position":"top","highlightClass":"light"},{"element":".home-bottom .row","intro":"See what's new in the Customer Portal including important announcements, new labs, product releases, and more.","tooltipClass":"tooltip-md","position":"top","highlightClass":"light"}],"callBacks":{"before":"resetMega"}}};
'use strict';
var PortalTour = function(introjs) {
    this.intro = introjs();
    this.init(tours, actions);
};

PortalTour.prototype.init = function(tours, actions) {
    this.tours = tours;
    this.actions = actions;
    this.tourCallbacks = {};

    this.currentSteps = this.getCurrentSteps();
    this.buildTour();

    var searchObj = this.utils.searchToObject();
    if (this.currentSteps && searchObj.tour) {
        this.startTour();
    } else if (this.currentSteps) {
        this.buildTourButton();
    }
};

PortalTour.prototype.getCurrentSteps = function() {
    var path = window.location.pathname;
    for (var tour in this.tours) {
        if (new RegExp(tour).test(path)) {
            var current = this.tours[tour];
            this.tourCallbacks = current.callBacks || {};
            return current.steps;
        }
    }
};

PortalTour.prototype.buildTour = function() {
    var self = this;
    this.intro.setOptions({
        steps: this.currentSteps,
        buttonClass: 'btn btn-sm',
        prevLabel: '&larr;',
        skipLabel: 'Close',
        doneLabel: 'Close',
        showBullets: false,
        showProgress: true,
        showStepNumbers: false
    });
    this.intro.executeCurrentStepCb = function(phase) {
        if (self.tourCallbacks[phase] && self.actions[self.tourCallbacks[phase]]) {
            self.actions[self.tourCallbacks[phase]]();
        }
        if (this._options && this._options.steps && this._currentStep) {
            var step = this._options.steps[this._currentStep];
            if (step && step[phase] && self.actions[step[phase]]) {
                self.actions[step[phase]]();
            }
        }
    };
    var onFinish = function() {
        jQuery('body').removeClass('portal-tour');
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

PortalTour.prototype.startTour = function() {
    // Make sure we are at the top of the page
    window.scrollTo(0, 0);
    jQuery('body').addClass('portal-tour');
    this.intro.start();
    this.hijackClicks();
};

PortalTour.prototype.hijackClicks = function() {
    jQuery('.introjs-tooltip').click(function(event) {
        // Clicks inside introjs tooltip should not bubble
        event.stopPropagation();
    });
};

PortalTour.prototype.buildTourButton = function() {
    var tourBtn = document.createElement('a');
    tourBtn.className = 'btn _btn tour-btn';
    tourBtn.onclick = this.startTour.bind(this);
    document.body.appendChild(tourBtn);
};

PortalTour.prototype.utils = {};

PortalTour.prototype.utils.searchToObject = function() {
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

// Export
window.PortalTour = PortalTour;

var introJsSrc = 'https://rawgit.com/connyay/intro.js/master/intro.js';
if (typeof require === 'undefined') {
    jQuery.getScript(introJsSrc, function() {
        window.portal_tour = new PortalTour(window.introJs);
    });
} else {
    require([introJsSrc], function(introJs) {
        window.portal_tour = new PortalTour(introJs);
    });
}
}());