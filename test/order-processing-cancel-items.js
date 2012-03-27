var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.cancelItems(
	common.googleOrderNumber
	, common.cancelItems
	, true
	, 'This item is no longer manufactured.'
	, 'Suggest replacement XYZ'
	, function () {
		console.log(arguments);
	}
);
