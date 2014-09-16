require(['//cdn.jsdelivr.net/intro.js/0.9.0/intro.min.js', 'jquery'], function(introJs, $) {
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

    window.startIntro = function() {
        var intro = introJs();

        intro.setOptions({
            steps: getCurrentSteps()
        });

        intro.start();
    }
    window.startIntro();
});
