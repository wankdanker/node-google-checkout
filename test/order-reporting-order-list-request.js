var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderReporting.orderListRequest(
	(new Date()).setDate(0)
	, (new Date())
	, function () {
		console.log(arguments);
	}
);
