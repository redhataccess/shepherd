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
        $('.introjs-fixParent').removeClass('introjs-fixParent')
    },
    returnToLaunch: function () {
        window.location = '/labs/launch/'
    },
    ensurePath: function (step, index) {
        var path = window.location.pathname;
        var searchObj = searchToObject();
        if (step && step.path && path) {
            if (path !== step.path) {
                $(document.body).addClass('introjs-hidden');
                var newPath = (step.path + '?tour=' + searchObj.tour + '&step=' + index);
                if (step.hostname) {
                    return window.location = (window.location.protocol + '//' + step.hostname + newPath);
                }
                window.location = newPath;
            }

        }
    },
    scrollTop: function () {
        window.scrollTo(0, 0);
    }
};
