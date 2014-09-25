var utils = {
    click: function(selector) {
        var elem = document.querySelector(selector);
        elem && elem.click && elem.click();
    }
};

var actions = {
    resetMega: function() {
        // Determine if it is active
        var isActive = document.querySelector('.mega.active');
        if(isActive){
            // It is active... Find the menu that is open and then close it.
            var activeMenu = document.querySelector('.primary-nav .active > a');
            activeMenu && activeMenu.click && activeMenu.click();
        }
    },
    openProducts: function() {
        utils.click('#nav-products > a');
    },
    openTools: function() {
        utils.click('#nav-tools > a');
    },
    openSecurity: function() {
        utils.click('#nav-security > a');
    },
    openCommunity: function() {
        utils.click('#nav-community > a');
    }
};
