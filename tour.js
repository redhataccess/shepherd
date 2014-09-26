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
