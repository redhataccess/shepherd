function initTour(introJs) {
    var tours = window.portal_tour.tours,
        tour_actions = window.portal_tour.actions;


    function searchToObject() {
        var query = document.location.search;
        if (query === '') {
            return {};
        }
        return query.replace(/(^\?)/, '').split('&').map(function(n) {
            return n = n.split('='), this[n[0]] = n[1], this
        }.bind({}))[0];
    }


    function getCurrentSteps() {
        var path = window.location.pathname;
        for (var tour in tours) {
            if (new RegExp(tour).test(path)) {
                return tours[tour].steps;
            }
        }
    }

    function startIntro(steps) {
        var intro = introJs();

        intro.setOptions({
            steps: steps
        });
        intro.executeCurrentStepCb = function(phase) {
            if (this._options && this._options.steps && this._currentStep) {
                var step = this._options.steps[this._currentStep];
                if (step && step[phase] && tour_actions[step[phase]]) {
                    tour_actions[step[phase]]();
                }
            }
        };
        intro.onbeforechange(function(element) {
            // Reset any menus opened
            jQuery('body').trigger('click');
            this.executeCurrentStepCb('pre');
        });
        intro.onafterchange(function(element) {
            this.executeCurrentStepCb('post');
        });
        intro.start();
    }

    function createTourButton(steps) {
        var tourBtn = document.createElement('a');
        tourBtn.className = 'btn tour-btn';
        tourBtn.onclick = function() {
            startIntro(steps);
        };
        document.body.appendChild(tourBtn);
    }
    var searchObj = searchToObject(),
        currentSteps = getCurrentSteps();
    if (currentSteps && searchObj.tour) {
        startIntro(currentSteps);
    } else if (currentSteps) {
        createTourButton(currentSteps);
    }
}
var introJsSrc = '//cdn.jsdelivr.net/intro.js/0.9.0/intro.min.js';
if (typeof require !== 'undefined') {
    require([introJsSrc], initTour);
} else {
    jQuery.getScript(introJsSrc, function() {
        initTour(window.introJs);
    });
}
