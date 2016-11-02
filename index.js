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
			console.log(pluginsCount().total);
			pieChart();
		}

		function pluginsCount() {
			var totalDownloads = 0;

			pluginSlugs.forEach(function(slug) {
				if (plugins.hasOwnProperty(slug)) {
					var p = plugins[slug];
					console.debug('plugin data: %O', p);
					//console.debug(typeof p);
					if (p.downloaded) {
						totalDownloads += parseInt(p.downloaded,
							10);
					}
				}
			});

			return {
				total: totalDownloads
			};
		}

		function pieChart() {
			// var data = {};
			//
			// pluginSlugs.forEach(function(slug) {
			//     console.debug(plugins[slug]);
			//     data[plugins[slug]] = parseInt(plugins[slug]
			//         .downloaded, 10);
			// });
			//
			// console.debug(data);
			var getLabels = function getLabels() {
				// yes, I know it's misspelled.
				var lables = [];
				pluginSlugs.forEach(function(slug) {
					var plugin = plugins[slug];
					if (typeof plugin !== 'undefined' && plugin.hasOwnProperty('name')) {
						lables.push(plugins[slug].name);
					}
				});

				return lables;
			};
			var getDownloads = function getDownloads() {
				var downloads = [];
				pluginSlugs.forEach(function(slug) {
					var plugin = plugins[slug];
					if (typeof plugin !== 'undefined' && plugin.hasOwnProperty(
							'downloaded')) {
						downloads.push(plugins[slug].downloaded);
					}
				});

				return downloads;
			};

			var data = {
				labels: getLabels(),
				datasets: [{
					data: getDownloads(),
					backgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#bac041",
						"#c0ffee",
						"#4a7092"
					],
					hoverBackgroundColor: [
						"#FF6384",
						"#36A2EB",
						"#FFCE56",
						"#bac041",
						"#c0ffee",
						"#4a7092"
					]
				}]
			};
			var ctx = document.querySelector('#pluginsPie');
			var myDoughnutChart = new Chart(ctx, {
				type: 'doughnut',
				data: data,
				options: {
					fullWidth: false
				}
			});
		}

	}, false); //ready()
})(window, document);
