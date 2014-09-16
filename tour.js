(function(){window.tours = {"home":{"steps":[{"intro":"Welcome to the customer portal!"},{"element":"#navhome","intro":"This will always bring you back home"},{"element":"#navproducts","intro":"Here are all the cool products"},{"element":"#navsupport","intro":"Here is all the cool support stuff"},{"element":"#navdownloads","intro":"Here is all the cool download stuff"},{"element":"#navcertification","intro":"If you want to be cool and get certified"},{"element":"#navsecurity","intro":"Security Information"},{"element":"#navsubscription","intro":"Sub"}]}};
require(['//cdnjs.cloudflare.com/ajax/libs/intro.js/0.5.0/intro.min.js', 'jquery'], function(introJs, $) {
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
}());