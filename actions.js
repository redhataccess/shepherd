window.portal_tour.actions = {
    openUserMenu: function() {
        jQuery('#accountUserName').trigger('click');
    },
    trySearch: function() {
        var $searchForm = jQuery('#homePageSearchForm');
        $searchForm.attr('action', $searchForm.attr('action') + '?tour=true');
        jQuery('#search-query').typed({
            strings: ['Red Hat Satellite'],
            callback: function(){
                setTimeout($searchForm.submit, 125);
            }
        });
    }
};
