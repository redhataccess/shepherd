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
