var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.returnItems(
	common.googleOrderNumber
	, common.returnItems
	, true
	, function (err, xml) {
		console.log(xml);
	}
	, true
);
