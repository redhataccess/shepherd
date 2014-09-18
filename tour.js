(function(){!function(e){"use strict";var t=function(t,n){this.el=e(t);this.options=e.extend({},e.fn.typed.defaults,n);this.baseText=this.el.text()||this.el.attr("placeholder")||"";this.typeSpeed=this.options.typeSpeed;this.startDelay=this.options.startDelay;this.backSpeed=this.options.backSpeed;this.backDelay=this.options.backDelay;this.strings=this.options.strings;this.strPos=0;this.arrayPos=0;this.stopNum=0;this.loop=this.options.loop;this.loopCount=this.options.loopCount;this.curLoop=0;this.stop=false;this.showCursor=this.isInput?false:this.options.showCursor;this.cursorChar=this.options.cursorChar;this.isInput=this.el.is("input");this.attr=this.options.attr||(this.isInput?"placeholder":null);this.build()};t.prototype={constructor:t,init:function(){var e=this;e.timeout=setTimeout(function(){e.typewrite(e.strings[e.arrayPos],e.strPos)},e.startDelay)},build:function(){if(this.showCursor===true){this.cursor=e('<span class="typed-cursor">'+this.cursorChar+"</span>");this.el.after(this.cursor)}this.init()},typewrite:function(e,t){if(this.stop===true)return;var n=Math.round(Math.random()*(100-30))+this.typeSpeed;var r=this;r.timeout=setTimeout(function(){var n=0;var i=e.substr(t);if(i.charAt(0)==="^"){var s=1;if(/^\^\d+/.test(i)){i=/\d+/.exec(i)[0];s+=i.length;n=parseInt(i)}e=e.substring(0,t)+e.substring(t+s)}r.timeout=setTimeout(function(){if(t===e.length){r.options.onStringTyped(r.arrayPos);if(r.arrayPos===r.strings.length-1){r.options.callback();r.curLoop++;if(r.loop===false||r.curLoop===r.loopCount)return}r.timeout=setTimeout(function(){r.backspace(e,t)},r.backDelay)}else{if(t===0)r.options.preStringTyped(r.arrayPos);var n=r.baseText+e.substr(0,t+1);if(r.attr){r.el.attr(r.attr,n)}else{r.el.text(n)}t++;r.typewrite(e,t)}},n)},n)},backspace:function(e,t){if(this.stop===true){return}var n=Math.round(Math.random()*(100-30))+this.backSpeed;var r=this;r.timeout=setTimeout(function(){var n=r.baseText+e.substr(0,t);if(r.attr){r.el.attr(r.attr,n)}else{r.el.text(n)}if(t>r.stopNum){t--;r.backspace(e,t)}else if(t<=r.stopNum){r.arrayPos++;if(r.arrayPos===r.strings.length){r.arrayPos=0;r.init()}else r.typewrite(r.strings[r.arrayPos],t)}},n)},reset:function(){var e=this;clearInterval(e.timeout);var t=this.el.attr("id");this.el.after('<span id="'+t+'"/>');this.el.remove();this.cursor.remove();e.options.resetCallback()}};e.fn.typed=function(n){return this.each(function(){var r=e(this),i=r.data("typed"),s=typeof n=="object"&&n;if(!i)r.data("typed",i=new t(this,s));if(typeof n=="string")i[n]()})};e.fn.typed.defaults={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],typeSpeed:0,startDelay:0,backSpeed:0,backDelay:500,loop:false,loopCount:false,showCursor:true,cursorChar:"|",attr:null,callback:function(){},preStringTyped:function(){},onStringTyped:function(){},resetCallback:function(){}}}(window.jQuery)

var actions = {
    openUserMenu: function() {
        jQuery('#accountUserName').trigger('click');
    },
    trySearch: function() {
        var searchQuery = 'Red Hat Satellite',
            $searchForm = jQuery('#homePageSearchForm'),
            $searchInput = jQuery('#search-query');
        $searchInput.attr('placeholder', '');
        $searchForm.attr('action', $searchForm.attr('action') + '?tour=true');
        $searchInput.typed({
            strings: [searchQuery],
            typeSpeed: 42,
            attr: 'value',
            showCursor: false,
            callback: function() {
                setTimeout(function() {
                    $searchForm.submit();
                }, 400);
            }
        });
    }
};

var tours = {"/wapps/ugc/protected/account.html$":{"steps":[{"intro":"Start of account maintenance tour...","tooltipClass":"tooltip-hero"}]},"/home/?$":{"steps":[{"intro":"<h1>Welcome to the Customer Portal!</h1><h2>We will take you on a short guided tour to get you situated.</h2><h4>You may use the arrow keys on your keyboard to navigate the tour.</h4>","tooltipClass":"tooltip-hero"},{"element":"#home-search .search-form .field","intro":"<h3>Enter a search term here to search our vast knowledgebase.</h3><p style=\"text-align:center;\"><br><a href=\"#\" onclick=\"window.portal_tour.actions.trySearch()\" class=\"btn btn-large btn-primary\">Try it!</a>"},{"element":"#home-announcements .box-column-inner","intro":"Announcements are posted here, and they are updated frequently. Make sure to check back!","position":"top"},{"element":"#home-links .home-start","intro":"This will take you to an alphabetical listing of all of our products. Great place to learn about all of the great solutions Red Hat has to offer.","position":"right"},{"element":"#home-links .home-activate","intro":"This is where you go to activate newly aquired subscriptions. You need to activate in order to gain access to updates and support.","position":"right"},{"element":"#home-links .home-download","intro":"This is where you go to download your products or updates. If you have just made a purchase this is a good place to start.","position":"left"},{"element":"#home-links .home-support","intro":"If you are having issues with a product you can click this to open a new support case.","position":"left"},{"element":"#home-knowledge","intro":"This is a list of recently added or changed entries in our knowledgebase.","position":"right"},{"element":"#accountUserNameMenu","intro":"You can manage your account here.","pre":"openUserMenu","position":"left"},{"element":"#navhome","intro":"This will always bring you back here."}]}};
'use strict';
var PortalTour = function(introjs) {
    this.intro = introjs();
    this.init(tours, actions);
};

PortalTour.prototype.init = function(tours, actions) {
    this.tours = tours;
    this.actions = actions;

    this.currentSteps = this.getCurrentSteps();
    this.buildTour();

    var searchObj = this.utils.searchToObject();
    if (this.currentSteps && searchObj.tour) {
        this.startTour();
    } else if (this.currentSteps) {
        this.buildTourButton();
    }
};

PortalTour.prototype.getCurrentSteps = function() {
    var path = window.location.pathname;
    for (var tour in this.tours) {
        if (new RegExp(tour).test(path)) {
            return this.tours[tour].steps;
        }
    }
};

PortalTour.prototype.buildTour = function() {
    var self = this;
    this.intro.setOptions({
        steps: this.currentSteps
    });
    this.intro.executeCurrentStepCb = function(phase) {
        if (this._options && this._options.steps && this._currentStep) {
            var step = this._options.steps[this._currentStep];
            if (step && step[phase] && self.actions[step[phase]]) {
                self.actions[step[phase]]();
            }
        }
    };
    this.intro.onbeforechange(function(element) {
        // Reset menus
        jQuery('body').trigger('click');
        this.executeCurrentStepCb('pre');
    });
    this.intro.onafterchange(function(element) {
        this.executeCurrentStepCb('post');
    });
};

PortalTour.prototype.startTour = function() {
    this.intro.start();
    this.hijackClicks();
};

PortalTour.prototype.hijackClicks = function() {
    jQuery('.introjs-tooltip').click(function(event) {
        // Clicks inside introjs tooltip should not bubble
        event.stopPropagation();
    });
};

PortalTour.prototype.buildTourButton = function() {
    var tourBtn = document.createElement('a');
    tourBtn.className = 'btn _btn tour-btn';
    tourBtn.onclick = this.startTour.bind(this);
    document.body.appendChild(tourBtn);
};

PortalTour.prototype.utils = {};

PortalTour.prototype.utils.searchToObject = function() {
    if (!location.search) {
        return {};
    }
    var result = {},
        pairs = location.search.slice(1).split('&'),
        length = pairs.length;
    for (var i = 0; i < length; i++) {
        var pair = pairs[i];
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    }
    return result;
};

// Export
window.PortalTour = PortalTour;

var introJsSrc = '//cdn.jsdelivr.net/intro.js/0.9.0/intro.min.js';
if (typeof require === 'undefined') {
    jQuery.getScript(introJsSrc, function() {
        window.portal_tour = new PortalTour(window.introJs);
    });
} else {
    require([introJsSrc], function(introJs) {
        window.portal_tour = new PortalTour(introJs);
    });
}
}());