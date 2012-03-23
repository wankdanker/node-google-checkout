var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

var items = [
	{ item_id : 12345 },
	{ item_id : 23456 }
];

gc.OrderProcessing.returnItems('12345', items, true, function () {
	console.log(arguments);
});
