var actions = {
    resetMega: function() {
        jQuery('.mega-wrap .active, .primary-nav .active').removeClass('active');
        jQuery('.mega-wrap .mega-menu.left').removeClass('left');
        jQuery('.mega-wrap .mega-menu.right').removeClass('right');
    },
    openProducts: function() {
        jQuery('#nav-products > a').trigger('click');
    },
    openTools: function() {
        jQuery('#nav-tools > a').trigger('click');
    },
    openSecurity: function() {
        jQuery('#nav-security > a').trigger('click');
    },
    openCommunity: function() {
        jQuery('#nav-community > a').trigger('click');
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
