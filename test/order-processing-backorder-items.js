var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.backorderItems(
	common.googleOrderNumber
	, common.backorderItems
	, true
	, function (err, xml) {
		console.log(xml);
	}
	, true
);
