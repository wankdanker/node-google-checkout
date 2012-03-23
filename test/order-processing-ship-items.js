var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

var items = [
	{ 
		item_id : 12345,
		trackingData : [
			{ carrier : 'FedEx', trackingNumber : '1234567890' },
			{ carrier : 'FedEx', trackingNumber : '1234567891' }
		]
	},
	{
		item_id : 23456,
		trackingData : [
			{ carrier : 'FedEx', trackingNumber : '1234567890' },
			{ carrier : 'FedEx', trackingNumber : '1234567891' }
		]
	}
];

gc.OrderProcessing.shipItems('12345', items, true, function () {
	console.log(arguments);
});
