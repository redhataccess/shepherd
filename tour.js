'use strict';
var PortalTour = function(introjs) {
    this.intro = introjs();
    this.init(tours, actions);
};

PortalTour.prototype.init = function(tours, actions) {
    this.tours = tours;
    this.actions = actions;

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
            return this.tours[tour].steps;
        }
    }
};

PortalTour.prototype.buildTour = function() {
    var self = this;
    this.intro.setOptions({
        steps: this.currentSteps
    });
    this.intro.executeCurrentStepCb = function(phase) {
        if (this._options && this._options.steps && this._currentStep) {
            var step = this._options.steps[this._currentStep];
            if (step && step[phase] && self.actions[step[phase]]) {
                self.actions[step[phase]]();
            }
        }
    };
    this.intro.onbeforechange(function(element) {
        jQuery('body').trigger('click');
        this.executeCurrentStepCb('pre');
    });
    this.intro.onafterchange(function(element) {
        this.executeCurrentStepCb('post');
    });
};

PortalTour.prototype.startTour = function() {
    this.intro.start();
};

PortalTour.prototype.buildTourButton = function() {
    var tourBtn = document.createElement('a');
    tourBtn.className = 'btn tour-btn';
    tourBtn.onclick = function() {
        this.startTour();
    };
    document.body.appendChild(tourBtn);
};

PortalTour.prototype.utils = {};

PortalTour.prototype.utils.searchToObject = function() {
    if(!location.search) {
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

var introJsSrc = '//cdn.jsdelivr.net/intro.js/0.9.0/intro.min.js';
if (typeof require === 'undefined') {
    jQuery.getScript(introJsSrc, function() {
        new PortalTour(window.introJs);
    });
} else {
    require([introJsSrc], function(introJs) {
        new PortalTour(introJs);
    });
}
