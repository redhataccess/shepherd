var __actions = {
    _: {
        click: function(selector) {
            var elem = document.querySelector(selector);
            elem && elem.click && elem.click();
        }
    },
    resetMega: function() {
        // Determine if it is active
        var isActive = document.querySelector('.mega.active');
        if (isActive) {
            // It is active... Find the menu that is open and then close it.
            var activeMenu = document.querySelector('.primary-nav .active > a');
            activeMenu && activeMenu.click && activeMenu.click();
        }
    },
    openProducts: function() {
        this._.click('#nav-products > a');
    },
    openTools: function() {
        this._.click('#nav-tools > a');
    },
    openSecurity: function() {
        this._.click('#nav-security > a');
    },
    openCommunity: function() {
        this._.click('#nav-community > a');
    }
};
