var fs = require('fs');

module.exports = function (path, obj, cb) {
	var json = JSON.stringify(obj);

	fs.writeFile(path, json, 'utf8', function (err, data) {
		if (err) return cb(err);
		return cb && cb(null);
	});
};