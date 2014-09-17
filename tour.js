function initTour(introJs) {
    var tours = window.tours;

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
        intro.onbeforechange = function(element) {
            console.log('onbeforechange');
        };
        intro.onchange = function(element) {
            console.log('onchange');
        };
        intro.onafterchange = function(element) {
            console.log('onafterchange');
        };
        intro.oncomplete = function() {
            console.log('oncomplete');
        };
        intro.onexit = function() {
            console.log('onexit');
        };
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
