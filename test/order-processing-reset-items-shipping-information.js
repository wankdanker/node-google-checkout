var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.resetItemsShippingInformation(
	common.googleOrderNumber
	, common.resetItems
	, true
	, function (err, xml) {
		console.log(xml);
	}
	, true
);
