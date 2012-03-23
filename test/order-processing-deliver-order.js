var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.deliverOrder('12345', [{ carrier : 'UPS', trackingNumber : '123453423453' }], function () {
	console.log(arguments);
});