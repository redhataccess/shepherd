require(['//cdn.jsdelivr.net/intro.js/0.9.0/intro.min.js'], function(introJs) {
    var tours = window.tours;

    function getCurrentSteps() {
        var path = window.location.pathname;
        for (var tour in tours) {
            if (new RegExp(tour).test(path)) {
                return tours[tour].steps;
            }
        }
    }

    function startIntro() {
        var steps = getCurrentSteps();
        if (!steps) {
            // Couldn't find tour, bail.
            return;
        }
        var intro = introJs();
        intro.setOptions({
            steps: getCurrentSteps()
        });
        intro.start();
    }

    var tourBtn = document.createElement('a');
    tourBtn.className = 'btn tour-btn';
    tourBtn.onclick = startIntro;
    document.body.appendChild(tourBtn);
});
