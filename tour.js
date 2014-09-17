(function(){ window.portal_tour = {};window.portal_tour.actions = {
    openUserMenu: function() {
        jQuery('#accountUserName').trigger('click');
    }
};

window.portal_tour.tours = {"/wapps/ugc/protected/account.html$":{"steps":[{"intro":"Start of account maintenance tour...","tooltipClass":"tooltip-hero"}]},"/home/?$":{"steps":[{"intro":"<h1>Welcome to the Customer Portal!</h1><h3>We will take you on a short guided tour to get you situated. You may use the arrow keys on your keyboard to navigate the tour.</h3><h4>Have fun!</h4>","tooltipClass":"tooltip-hero"},{"element":"#home-search .search-form .field","intro":"Enter a search term here to search our vast knowledgebase."},{"element":"#home-announcements .box-column-inner","intro":"Announcements are posted here, and they are updated frequently. Make sure to check back!","position":"top"},{"element":"#home-links .home-start","intro":"This will take you to an alphabetical listing of all of our products. Great place to learn about all of the great solutions Red Hat has to offer.","position":"right"},{"element":"#home-links .home-activate","intro":"This is where you go to activate newly aquired subscriptions. You need to activate in order to gain access to updates and support.","position":"right"},{"element":"#home-links .home-download","intro":"This is where you go to download your products or updates. If you have just made a purchase this is a good place to start.","position":"left"},{"element":"#home-links .home-support","intro":"If you are having issues with a product you can click this to open a new support case.","position":"left"},{"element":"#home-knowledge","intro":"This is a list of recently added or changed entries in our knowledgebase.","position":"right"},{"element":"#accountUserNameMenu","intro":"You can manage your account here.","pre":"openUserMenu","position":"left"},{"element":"#navhome","intro":"This will always bring you back here."}]}};
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
    if (currentSteps && searchObj.tour === true) {
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
}());