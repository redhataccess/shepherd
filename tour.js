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

    this._cachedDocClickEvents = jQuery(document).data('events').click || [];
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
    var rebindDocClick = this.utils.rebindDocClick.bind(this);
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
    this.intro.oncomplete(rebindDocClick);
    this.intro.onexit(rebindDocClick);
};

PortalTour.prototype.startTour = function() {
    this.utils.unbindDocClick.call(this);
    this.intro.start();
};

PortalTour.prototype.buildTourButton = function() {
    var tourBtn = document.createElement('a');
    tourBtn.className = 'btn tour-btn';
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

PortalTour.prototype.utils.unbindDocClick = function() {
    this.utils._bindDocClick.call(this, 'unbind');
};

PortalTour.prototype.utils.rebindDocClick = function() {
    this.utils._bindDocClick.call(this, 'bind');
};

PortalTour.prototype.utils._bindDocClick = function(action) {
    if (!this._cachedDocClickEvents.length) {
        return;
    }
    var $doc = jQuery(document);
    for (var i = 0; i < this._cachedDocClickEvents.length; i++) {
        $doc[action]('click', this._cachedDocClickEvents.length[i]);
    }
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
