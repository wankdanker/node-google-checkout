var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.refundOrder('12345', 234, 'Damaged Merchandize', 'Discount for inconvenience; ship reaplacement item', function () {
	console.log(arguments);
});