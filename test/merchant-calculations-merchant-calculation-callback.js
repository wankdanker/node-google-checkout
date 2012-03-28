var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common'),
	path = require('path'),
	fs = require('fs')

var gc = new GoogleCheckout(common.settings);

gc.MerchantCalculations.on('merchantCalculationCallback', function (obj, callback) {
	return callback(null, obj);
});


fs.readFile(path.join(__dirname, 'data', 'merchant-calculation-callback') + '.xml', 'utf8', function (err, data) {
	gc.MerchantCalculations.merchantCalculationCallback(data, function (err, responseXML) {
		console.log(responseXML);
	});
});