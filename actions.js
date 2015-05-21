var __actions = {
    _: {
        click: function (selector) {
            var elem = document.querySelector(selector);
            elem && elem.click && elem.click();
        },
        showTray: function () {
            var $tray = $('.utility-tray');
            $tray.show();
            return $tray;
        },
        hideTray: function () {
            var $tray = $('.utility-tray');
            $tray.hide();
            return $tray;
        },
        getTourElements: function () {
            return $('.introjs-overlay, .introjs-helperLayer, .introjs-tooltipReferenceLayer');
        },
        hideTour: function () {
            this.getTourElements().hide();
        },
        showTour: function () {
            this.getTourElements().show();
        },
        waitForElement: function (selector, cb, max) {
            if (max === 0) {
                // We tried our best :(
                return;
            }
            if (typeof max === 'undefined') {
                max = 40;
            }
            var found = $(selector).is(':visible');
            if (found) {
                cb(document.querySelector(selector));
            } else {
                setTimeout($.proxy(this.waitForElement, this, selector, cb, max--), 250);
            }
        }
    },
    resetMega: function () {
        // Determine if it is active
        var isActive = document.querySelector('.mega-menu.active');
        if (isActive) {
            // It is active... Find the menu that is open and then close it.
            var activeMenu = document.querySelector('.primary-nav .active > a');
            activeMenu && activeMenu.click && activeMenu.click();
        }
        this._.hideTray();
    },
    openProducts: function () {
        this._.hideTray();
        this._.click('#nav-products > a');
    },
    openTools: function () {
        this._.click('#nav-tools > a');
    },
    openSecurity: function () {
        this._.click('#nav-security > a');
    },
    openCommunity: function () {
        this._.click('#nav-community > a');
    },
    openProfile: function () {
        var $tray = this._.showTray();
        $tray.children().hide();
        $('#account-info').css('opacity', '1').show();
    },
    stripFixParents: function () {
        $('.introjs-fixParent').removeClass('introjs-fixParent');
    },
    returnToLaunch: function () {
        window.location = '/start/';
    },
    ensurePath: function (step, index) {
        function _bounce() {
            var searchObj = searchToObject();
            $(document.body).addClass('introjs-hidden');
            var newPath = (step.path + '?tour=' + searchObj.tour + '&step=' + index);
            if (step.hash) {
                newPath += step.hash;
            }
            if (step.hostname) {
                return window.location = (window.location.protocol + '//' + step.hostname + newPath);
            }
            window.location = newPath;
        }
        var path = window.location.pathname;
        var hash = window.location.hash;
        if (step && step.path && path) {
            if (path !== step.path) {
                _bounce();
            }
        }
        if (step && step.hash && hash) {
            if (hash !== step.hash) {
                _bounce();
            }
        }
    },
    waitThenRefresh: function (step, index, tour) {
        this._.hideTour();
        var show = this._.showTour;
        this._.waitForElement(step.element, function () {
            show();
            tour.intro.refresh();
        });
    },
    loadRecommendations: function (step) {
        function _loadRecommendations() {
            try {
                var $scope = angular.element('#rha-product-select').scope();
                $scope.CaseService.kase.product = $scope.ProductsService.products[0].value;
                $scope.CaseService.onProductSelectChange();
                $scope.RecommendationsService.getRecommendations();
            } catch (e) {}
        }
        this._.waitForElement(step.element, _loadRecommendations);
    },
    scrollTop: function () {
        window.scrollTo(0, 0);
    }
};
