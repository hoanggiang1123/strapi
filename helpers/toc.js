/*! tableOfContents.js v1.0.0 | (c) 2020 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/table-of-contents */

/*
 * Automatically generate a table of contents from the headings on the page
 * @param  {String} content A selector for the element that the content is in
 * @param  {String} target  The selector for the container to render the table of contents into
 * @param  {Object} options An object of user options [optional]
 */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


var tableOfContents = function (content, options) {

    const newcontent = content.replace('<p>[toc]</p>', '<div id="toc"></div>');
    const dom = new JSDOM(newcontent);
    const contentWrap = dom.window.document.createElement('div');
    contentWrap.innerHTML = newcontent;
    var toc = contentWrap.querySelector('#toc');
	if (!contentWrap || !toc) return;

	var defaults = {
		levels: 'h2, h3, h4, h5, h6',
		heading: 'Danh mục',
		headingLevel: 'h2',
		listType: 'ul'
	};
	var settings = {};

	var headings;

	var merge = function (obj) {
		for (var key in defaults) {
			if (Object.prototype.hasOwnProperty.call(defaults, key)) {
				settings[key] = Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : defaults[key];
			}
		}
	};

	var toSlug = function (str) {
		// Chuyển hết sang chữ thường
		str = str.toLowerCase();     
	
		// xóa dấu
		str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
		str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
		str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
		str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
		str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
		str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
		str = str.replace(/(đ)/g, 'd');
	
		// Xóa ký tự đặc biệt
		str = str.replace(/([^0-9a-z-\s])/g, '');
	
		// Xóa khoảng trắng thay bằng ký tự -
		str = str.replace(/(\s+)/g, '-');
	
		// xóa phần dự - ở đầu
		str = str.replace(/^-+/g, '');
	
		// xóa phần dư - ở cuối
		str = str.replace(/-+$/g, '');
	
		// return
		return str;
	}

	var createID = function (heading) {
		if (heading.id.length) return;
		// heading.id = 'toc_' + heading.textContent.replace(/[^A-Za-z0-9]/g, '-');
		heading.id = toSlug(heading.textContent);
	};

	var getIndent = function (count) {
		var html = '';
		for (var i = 0; i < count; i++) {
			html += '<' + settings.listType + '>';
		}
		return html;
	};


	var getOutdent = function (count) {
		var html = '';
		for (var i = 0; i < count; i++) {
			html += '</' + settings.listType + '></li>';
		}
		return html;
	};

	var getStartingHTML = function (diff, index) {

		if (diff > 0) {
			return getIndent(diff);
		}

		if (diff < 0) {
			return getOutdent(Math.abs(diff));
		}

		if (index && !diff) {
			return '</li>';
		}

		return '';

	};

	var injectTOC = function () {

		// Track the current heading level
		var level = headings[0].tagName.slice(1);
		var startingLevel = level;

		// Cache the number of headings
		var len = headings.length - 1;

		// Inject the HTML into the DOM
		toc.innerHTML =
			'<' + settings.headingLevel + '>' + settings.heading + '</' + settings.headingLevel + '>' +
			'<' + settings.listType + '>' +
				Array.prototype.map.call(headings, function (heading, index) {

					// Add an ID if one is missing
					createID(heading);

					// Check the heading level vs. the current list
					var currentLevel = heading.tagName.slice(1);
					var levelDifference = currentLevel - level;
					level = currentLevel;
					var html = getStartingHTML(levelDifference, index);

					// Generate the HTML
					html +=
						'<li>' +
							'<a href="#' + heading.id + '">' +
								heading.innerHTML.trim() +
							'</a>';

					// If the last item, close it all out
					if (index === len) {
						html += getOutdent(Math.abs(startingLevel - currentLevel));
					}

					return html;

				}).join('') +
            '</' + settings.listType + '>';
	};

	/**
	 * Initialize the script
	 */
	var init = function () {

		// Merge any user settings into the defaults
		merge(options || {});

		// Get the headings
		// If none are found, don't render a list
		headings = contentWrap.querySelectorAll(settings.levels);
		if (!headings.length) return;

		// Inject the table of contents
		injectTOC();
	};

    init();
    return contentWrap.innerHTML;
};
module.exports = {
    tableOfContents
};