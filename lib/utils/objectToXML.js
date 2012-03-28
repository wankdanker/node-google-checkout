var sanitizer = require('sanitizer')
	map = require('./map.js');

function objectToXML(obj, namespace) {
	var xml = [];
	
	map(obj, function (key, value) {
		var attributes = '';
		
		if (value && value['@']) {
			attributes = map(value['@'], function (key, value) {
				if (value && value.constructor.name == 'Date') {
					return key + '="' + fixupDate(value) + '"';
				}
				else {
					return key + '="' + value + '"';
				}
			}).join(' ');
			
			value = value['#'];
		}
		
		if (Array.isArray(value)) {
			map(value, function (ix, value) {
				var tmp = {};
				
				tmp[key] = value;
				
				xml.push(objectToXML(tmp));
			});
		}
		else if (value === null || value === undefined) {
			xml.push('<' + ((namespace) ? namespace + ':' : '') + key + ((attributes) ? ' ' + attributes : ''))
			
			//check to see if key is a ?something?
			if (/^\?.*\?$/.test(key)) {
				xml.push('>\n');
			}
			else {
				xml.push(' />');
			}
		}
		else {
			xml.push('<' + ((namespace) ? namespace + ':' : '') + key + ((attributes) ? ' ' + attributes : '') + '>')
			
			if (value && value.constructor.name == 'Date') {
				xml.push(fixupDate(value));
			}
			else if (typeof (value) == 'object') {
				xml.push(objectToXML(value, namespace));
			}
			else {
				if (value && typeof(value) == 'string') {
					value = sanitizer.escape(value);
				}
				
				xml.push(value);
			}
			
			xml.push('</' + ((namespace) ? namespace + ':' : '') + key.split(/\ /)[0] + '>')
		}
	});
	
	return xml.join('');
}

module.exports = objectToXML;

function fixupDate(date) {
	var newDate = new Date(date).toISOString();
	//strip off the milisecconds and the Z
	return newDate.substr(0, newDate.length -5);
}