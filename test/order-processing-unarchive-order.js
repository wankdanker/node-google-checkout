var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.unarchiveOrder('12345', function () {
	console.log(arguments);
});
