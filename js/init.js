(function ($) {
	$(function () {
		// userInput = function (e) {
		// 	if (e.key == "Enter") {
		// 		var ip = $(this).val()
		// 		console.log(ip);
		// 		var inputJson = JSON.parse(ip);
		// 		console.log(inputJson);
		// 	}
		// }

		//recursive function to create html from json object
		prettyprint = function (obj, name) {
			var htmlString = '';
			if (typeof obj == 'object' && obj) {
				for (key in obj) {
					htmlString += prettyprint(obj[key], key);
				}
				if (obj.length == undefined) {
					htmlString = '<div class="parent hide hidden paddingL10"><span class="blue-text">' + name + '</span>:Object' + htmlString + '</div>'
				} else {
					htmlString = '<div class="parent hide hidden paddingL10"><span class="blue-text">' + name + '</span>: Array[' + obj.length + ']' + htmlString + '</div>'
				}
				return htmlString;
			} else {
				var span = '<span class="blue-text">' + name + '</span>:<span class="red-text">"' + obj + '"</span>';
				htmlString = '<div class="leafNode hide paddingL10">' + span + '</div>'
				return htmlString;
			}
		};

		beginPrettify = function () {
			var obj = {
				companyName: 'Apttus',
				details: {
					products: ['CPQ', 'CLM', 'X-Author'],
					npOfEmployess: '500+',
					branches: {
						india: ['Bangalore', 'Ahmedabad'],
						US: 'San Jose'
					},
					technologies: ['Salesforce', 'Microsoft']
				}
			};
			var parent = $('#renderJson');
			parent.html(prettyprint(obj, 'Object'));
			parent.children('div').removeClass('hide');
		};

		toggle = function (e) {
			if (e.target == e.currentTarget || (e.target.nodeName == 'SPAN') && e.currentTarget == e.target.parentElement) {
				var c = $(this);
				if (c.hasClass('hidden')) {
					c.children().removeClass('hide');
					c.removeClass('hidden');
				} else {
					c.children('div').addClass('hide');
					c.addClass('hidden');
				}
			}
		}

		Ajax = function () {
			var requestsArray = arguments;
			var c = [];
			var done = 0;
			var p = new Promise((resolve, reject) => {

				for (i in requestsArray) {
					(function (i) {
						var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function () {
							if (xhr.readyState == 4 && xhr.status == 200) {
								c[i] = parseJson(xhr.responseText);
								if (done != requestsArray.length - 1) {
									done++;
								} else {
									resolve(c);
								}
							}
						};
						xhr.open("GET", requestsArray[i], true);
						xhr.send();
					})(i);
				}
			});
			return p;
		};
		parseJson = function (obj) {
			try {
				return JSON.parse(obj);
			} catch (error) {
				return obj;
			}
		}
		callAjax = function () {
			Ajax('https://api.github.com/users/vjai', 'https://api.stackexchange.com/2.2/users?site=stackoverflow').then((response) => {
				console.log(response);
				$("#ajax-content").append(prettyprint(response, 'Object'));
				$("#ajax-content").children('div').removeClass('hide');
			});
		};
		// $('#inputJson').on('keyup', userInput);
		$('#renderJson').on('click', '.parent', toggle);
		$('#ajax-content').on('click', '.parent', toggle);

	}); // end of document ready
})(jQuery); // end of jQuery name space