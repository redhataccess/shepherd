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
                max = 100;
            }
            var found = $(selector).is(':visible');
            if (found) {
                cb(document.querySelector(selector));
            } else {
                setTimeout(_.bind(this.waitForElement, this, selector, cb, max--), 300);
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
    reset: function (step, index, self) {
        this.resetMega(step, index, self);
        var $body = $(document.body);
        if (step && step.docked) {
            $body.addClass('introjs-docked');
        } else {
            $body.removeClass('introjs-docked');
        }
        // Look for and remove last class
        var previousStepClass = $body.data('introjs-step-class');
        if (previousStepClass) {
            $body.removeClass(previousStepClass);
        }
        if (step && step.stepClass) {
            // Save a ref to class we are adding for this step.
            $body.data('introjs-step-class', step.stepClass);
            $body.addClass(step.stepClass);
        }
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
        if (window.location.host === 'www.redhat.com') {
            window.location = 'https://access.redhat.com/start/';
        } else {
            window.location = '/start/';
        }
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
        this._.waitForElement(step._element, function (element) {
            var currentStep = tour.intro._introItems[tour.intro._currentStep];
            currentStep.element = element;
            tour.intro.refresh();
        });
    },
    loadRecommendations: function (step, index, tour) {
        function _loadRecommendations() {
            try {
                var $scope = angular.element('#rha-product-select').scope();
                var rhel = $scope.ProductsService.products[0];
                $scope.CaseService.kase.product = rhel.value || rhel.code;
                $scope.CaseService.onProductSelectChange();
                $scope.RecommendationsService.getRecommendations();
                this._.waitForElement('#sticky-ricky-static', function () {
                    tour.intro.refresh();
                })
            } catch (e) {}
        }
        this._.waitForElement(step.element, _.bind(_loadRecommendations, this));
    },
    scrollTop: function () {
        window.scrollTo(0, 0);
    }
};
