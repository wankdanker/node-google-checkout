var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.OrderProcessing.refundOrder(
	common.googleOrderNumber
	, 234
	, 'Damaged Merchandize'
	, 'Discount for inconvenience; ship reaplacement item'
	, function (err, xml) {
		console.log(xml);
	}
	, true
);