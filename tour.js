(function(){window.tours = {"/home/?$":{"steps":[{"intro":"<h1>Welcome to the customer portal!</h1><p>We will take you on a short guided tour to get you situated.</p><p>You may use the arrow keys on your keyboard to navigate the tour.</p><p>Have fun!</p>","tooltipClass":"tooltip-hero"},{"element":"#home-search .search-form .field","intro":"Enter a search term here to search our vast knowledgebase."},{"element":"#home-announcements .box-column-inner","intro":"Announcements are posted here, and they are updated frequently. Make sure to check back!","position":"top"},{"element":"#home-links .home-start","intro":"This will take you to an alphabetical listing of all of our products. Great place to learn about all of the great solutions Red Hat has to offer.","position":"right"},{"element":"#home-links .home-activate","intro":"This is where you go to activate newly aquired subscriptions. You need to activate in order to gain access to updates and support.","position":"right"},{"element":"#home-links .home-download","intro":"This is where you go to download your products or updates. If you have just made a purchase this is a good place to start.","position":"left"},{"element":"#home-links .home-support","intro":"If you are having issues with a product you can click this to open a new support case.","position":"left"},{"element":"#home-knowledge","intro":"This is a list of recently added or changed entries in our knowledgebase.","position":"right"},{"element":"#navhome","intro":"This will always bring you back here."}]}};
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

    function startIntro(steps) {
        var intro = introJs();
        intro.setOptions({
            steps: steps
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

});
}());