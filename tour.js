function initTour(introJs) {
    var tours = window.tours,
        tour_actions = window.tour_actions;

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
                if (step && step[phase]) {
                    step[phase]();
                }
            }
        };
        intro.onbeforechange(function(element) {
            // Reset any menus opened
            jQuery('body').trigger('click');
            this.executeCurrentStepCb('pre');
            console.log('onbeforechange');
        });
        intro.onchange(function(element) {
            console.log('onchange');
        });
        intro.onafterchange(function(element) {
            this.executeCurrentStepCb('post');
            console.log('onafterchange');
        });
        intro.oncomplete(function() {
            console.log('oncomplete');
        });
        intro.onexit(function() {
            console.log('onexit');
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

    var currentSteps = getCurrentSteps();
    if (currentSteps) {
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
