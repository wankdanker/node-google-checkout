var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

var items = [
	{ item_id : 12345 },
	{ item_id : 23456 }
];

gc.OrderProcessing.cancelItems('12345', items, true, 'This item is no longer manufactured.', 'Suggest replacement XYZ', function () {
	console.log(arguments);
});
