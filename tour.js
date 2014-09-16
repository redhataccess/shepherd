require(['//cdnjs.cloudflare.com/ajax/libs/intro.js/0.5.0/intro.min.js'], function(introJs) {
    function getCurrentSteps() {
        var path = window.location.pathname;

        if (paths[path]) {
            return paths[path];
        }
        for (path in paths) {
            return paths[path];
        }
    }

    function startIntro() {
        var intro = introJs();

        intro.setOptions({
            steps: getCurrentSteps()
        });

        intro.start();
    }
    startIntro();
});
