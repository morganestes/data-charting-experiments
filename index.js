(function(window, document, undefined) {
    document.addEventListener('DOMContentLoaded', function() {
        var ajaxButton;
        var resultsEl;
        var apiUrl;
        var plugins = {};
        var ajaxRequests = [];
        var pluginSlugs = [
            'coralcdn',
            'custom-shipping-options-for-membermouse',
            'remove-admin-bar-from-previews',
            'widont-part-deux',
            'windows-azure-storage',
            'wp-hashgrid',
        ];

        console.log('ready');
        ajaxButton = document.querySelector('#ajax-trigger');
        resultsEl = document.querySelector('#data-results code');

        ajaxButton.addEventListener('click', ajaxClicked, false);
        //xhr.addEventListener('load', ajaxSave);

        function ajaxClicked() {
            pluginSlugs.forEach(function(slug, index) {
                console.debug('Getting data for ' + slug);
                ajaxRequests[index] = new XMLHttpRequest();
                ajaxRequests[index].open('GET', '/data/' +
                    slug + '.json', true);
                ajaxRequests[index].onload = function(e) {
                    if (this.status === 200) {
                        plugins[slug] = JSON.parse(
                            ajaxRequests[index].responseText
                        );
                    }
                };
                ajaxRequests[index].send();
            });
            console.debug(plugins);
        }

    }, false); //ready()
})(window, document);
