window.portal_tour.actions = {
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
            callback: function() {
                setTimeout(function() {
                    $searchInput.attr('value', searchQuery);
                    $searchForm.submit();
                }, 400);
            }
        });
    }
};
