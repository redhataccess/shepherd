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
