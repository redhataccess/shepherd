require(['//cdn.jsdelivr.net/intro.js/0.9.0/intro.min.js'], function(introJs) {
    var paths = window.tours;
    function getCurrentSteps() {
        var path = window.location.pathname;

        if (paths[path]) {
            return paths[path].steps;
        }
        for (path in paths) {
            return paths[path].steps;
        }
    }

    function startIntro() {
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
