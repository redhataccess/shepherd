window.portal_tour.actions = {
    openUserMenu: function() {
        jQuery('#accountUserName').trigger('click');
    },
    trySearch: function() {
        var $searchForm = jQuery('#homePageSearchForm'),
            $searchInput = jQuery('#search-query');
        $searchInput.attr('placeholder', '');
        $searchForm.attr('action', $searchForm.attr('action') + '?tour=true');
        $searchInput.typed({
            strings: ['Red Hat Satellite'],
            typeSpeed: 30,
            callback: function(){
                setTimeout(function() {
                    $searchForm.submit();
                }, 300);
            }
        });
    }
};
