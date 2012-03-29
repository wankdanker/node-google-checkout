var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.cancelItems(
	common.googleOrderNumber
	, common.cancelItems
	, true
	, 'This item is no longer manufactured.'
	, 'Suggest replacement XYZ'
	, function (err, xml) {
		console.log(xml);
	}
	, true
);
