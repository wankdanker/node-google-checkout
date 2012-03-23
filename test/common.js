exports.settings = { 
	merchantNumber : 'abcdefg', 
	merchantKey : '12345',
	currency : 'USD'
};

exports.items = [{
	name : '5 lbs. Dog Food',
	description : '5 lb. bag of dog food',
	unitPrice : 35.00,
	currency : 'USD',
	quantity : 1,
	item_id : '1532B34FF'
}
,{
	name : 'Sammy Hagar\s Greatest Hits',
	description : 'Sammy Hagar - Essential Red Collection CD&',
	unitPrice : 15.00,
	currency : 'USD',
	quantity : 2,
	item_id : '2B94JG93JDF'
}];

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