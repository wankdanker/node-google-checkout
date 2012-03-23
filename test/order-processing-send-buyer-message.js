var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.sendBuyerMessage('12345','Your order will ship tomorrow.', true, function () {
	console.log(arguments);
});
