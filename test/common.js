exports.settings = { 
	merchantNumber : process.env.GOOGLE_CHECKOUT_MERCHANT_NUMBER || 'abcd', 
	merchantKey : process.env.GOOGLE_CHECKOUT_MERCHANT_KEY || '1234',
	currency :  process.env.GOOGLE_CHECKOUT_CURRENCY ||'USD',
	pollInterval : process.env.GOOGLE_CHECKOUT_POLL_INTERVAL || 60000
};

exports.continueTokenFile = __dirname + '/continueToken.txt';
exports.googleOrderNumber = '351595665006949';
exports.merchantOrderNumber = '12345';

exports.items 
= exports.returnItems 
= exports.backorderItems 
= exports.cancelItems 
= exports.resetItems
= [
	{
		name : '5 lbs. Dog Food',
		description : '5 lb. bag of dog food',
		unitPrice : 35.00,
		currency : 'USD',
		quantity : 1,
		item_id : '1532B34FF'
	}
	,{
		name : 'Sammy Hagar\'s Greatest Hits',
		description : 'Sammy Hagar - Essential Red Collection CD&',
		unitPrice : 15.00,
		currency : 'USD',
		quantity : 2,
		item_id : '2B94JG93JDF'
	}
];

exports.shipItems = [
	{ 
		item_id : exports.items[0].item_id,
		trackingData : [
			{ carrier : 'FedEx', trackingNumber : '1234567890' },
			{ carrier : 'FedEx', trackingNumber : '1234567891' }
		]
	},
	{
		item_id : exports.items[1].item_id,
		trackingData : [
			{ carrier : 'FedEx', trackingNumber : '1234567890' },
			{ carrier : 'FedEx', trackingNumber : '1234567891' }
		]
	}
];

exports.shipMethods = [
{
	name : 'FedEx Ground',
	price : 12.50,
	currency : 'USD'
}
,{
	name : 'FedEx Express',
	price : 25.00,
	currency : 'USD'
}];