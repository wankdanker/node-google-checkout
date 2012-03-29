var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.unarchiveOrder(
	common.googleOrderNumber
	, function (err, xml) {
		console.log(xml);
	}
	, true
);
