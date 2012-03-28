var fs = require('fs');

module.exports = function (path, cb) {
	fs.readFile(path, 'utf8', function (err, data) {
		if (err) return cb(err, null);
		
		return cb && cb(null, JSON.parse(data));
	});
};