var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.addTrackingData(
	common.googleOrderNumber
	, [{ carrier : 'UPS', trackingNumber : '123453423453' }]
	, function (err, xml) {
		console.log(xml);
	}
	, true
);