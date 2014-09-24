var utils = {
    click: function(selector) {
        var elem = document.querySelector(selector);
        elem && elem.click && elem.click();
    }
};

var actions = {
    resetMega: function() {
        jQuery('.mega-wrap .active, .primary-nav .active').removeClass('active');
        jQuery('.mega-wrap .mega-menu.left').removeClass('left');
        jQuery('.mega-wrap .mega-menu.right').removeClass('right');
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
