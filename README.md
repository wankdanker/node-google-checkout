
node-google-checkout
====================

A Google Checkout API implementation for node.js

Status
------

This API is currently working in the sandbox environment. I am working on documentation.

Dependencies
------------

 - sanitizer version 0.0.15
 - request version 2.9.153
 - xml2js version 0.1.13

#GoogleCheckout(settings)

The `GoogleCheckout` constructor function.

This is the main constructor function and where all of the magic starts.
Once you have an instance of `GoogleCheckout` you have access to all of
the following submodules

* ShoppingCart - `GoogleCheckout.createCart()`
* MerchantCalculations - `GoogleCheckout.MerchantCalculations`
* Notification - `GoogleCheckout.Notification`
* Polling - `GoogleCheckout.Polling`
* OrderProcessing - `GoogleCheckout.OrderProcessing`
* OrderReporting - `GoogleCheckout.OrderReporting`

Settings

```javascript
settings = {
	merchantNumber : 'YOUR MERCHANT NUMBER',
	merchantKey : 'YOUR MERCHANT KEY',
	currency : 'YOUR CURRENCY - LIKE USD',
	timeZone : 'America/New_York',
	merchantCalculationsUrl : 'http://yoursite.com/merchant-callback-url',
	merchantCalculationsAcceptCoupons : false,
	merchantCalculationsAcceptGiftCertifications : false,
	merchantCalculationsShipping : false
}
```

- __merchantNumber__ : your merchant number obtained from Google
- __merchantKey__ : your merchant key obtained from Google
- __currency__ : the default currency for your site. If you have this set, you can ignore
  setting this value in methods that have it as an argument.
- __timeZone__ : your time zone
- __merchantCalculationsUrl__ : if you want to use merchant calculations, specify your callback url here.
  Default: `null`
- __merchantCalculationsAcceptCoupons__ : if you accept coupons and want to process them in your merchant 
  calculations callback, then set this value to `true`. Default: `false`
- __merchantCalculationsAcceptGiftCertifications__ : if you accept gift certificats and want to process
  them in your merchant calculations callback, then set this value to `true`. Default: `false`
- __merchantCalculationsShipping__ : if you want to calculate the shipping rates in your merchant
  calculations callback, then set this value to `true`. Default: `false`

Example

```javascript
var gc = new GoogleCheckout({
	merchantNumber : '12345612345',
	merchantKey : '234543254345345',
	currency : 'USD',
	timeZone : 'America/New_York'
});
```

###.createCart(callback)

Create a new instance of `ShoppingCart`

###.postXML(url, xml, callback)

Post `xml` to `url` via an HTTP request.

Before being used, `url` is processed by replacing '{merchantNumber}' 
and '{merchantKey}' with `settings.merchantNumber` and 
`settings.merchantKey` respectively.

###.parseXML(xml, callback)

Parse a string of XML and convert it to a JavaScript object.

This function processes a string of XML and converts it to
a JavaScript object. Google's XML tags consistently replace
spaces with '-'. We replace each '-' and the following character
with just the capitalized character which follows the '-' by using
the `camelCaseObjectKeys()` function.

This gives us consistent camel case objects returned from Google.

#ShoppingCart(GoogleCheckout)

The `ShoppingCart` module provides methods for adding items, adding shipping options
and submitting a shopping cart to Google. After submitting the shopping cart to 
Google, you will receive a URL to redirect your user to.

There is no point in calling the constructor manually. You can get an
instance of `ShoppingCart` like this

```javascript
var gc = new GoogleCheckout(settings);

gc.createCart(function (err, cart) {
	
});
```

Here is a complete example of building a cart and pushing it to Google

```javascript
var gc = new GoogleCheckout(settings);

gc.createCart(function (err, cart) {
	cart.addItem({
		name : 'Crayons', 
		description : '42 Assorted Crayons', 
		unitPrice : 3.99, 
		currency : 'USD', 
		quantity : 1, 
		item_id : 'CRAY42'
	});
	
	cart.addShipMethod({
		name : 'FedEx Ground',
		price : 3.00,
		currency : 'USD'
	});
	
	cart.postCart(function (err, redirectUrl) {
		if (err) {
			//deal with the error
			return;
		}
		
		console.log(redirectUrl);
	});
});
```

###.addItem(name, description, unitPrice, quantity, item_id, currency)

Add an item to the list of items currently in the shopping cart.

You may optionally pass an ItemObject in place of Name. The ItemObject should
contain all the properties in the example listed below, with the exception of
the currency property. If the currency property is omitted, then the default
currency will be used.

```javascript
ItemObject = { 
	name : '', 
	description : '', 
	unitPrice : 1.23, 
	currency : '', 
	quantity : 1, 
	item_id : '' 
};
```

Example

```javascript
var gc = new GoogleCheckout(settings);

gc.createCart(function (err, cart) {
	cart.addItem({
		name : 'Crayons', 
		description : '42 Assorted Crayons', 
		unitPrice : 3.99, 
		currency : 'USD', 
		quantity : 1, 
		item_id : 'CRAY42'
	});

	//or

	cart.addItem('Jug of Juice', 'The good juice, made from natural ingredients', 14.99, 1, 'GOODJUC', 'USD');
});
```

###.addShipMethod(ShippingMethodObject)

Add a shipping option to the shopping cart

```javascript
ShipMethodObject = {
	name : '',
	price : 1.23,
	currency : 'USD'
};
```

```javascript
var gc = new GoogleCheckout(settings);

gc.createCart(function (err, cart) {
	cart.addShipMethod({
		name : 'FedEx Ground',
		price : 3.00,
		currency : 'USD'
	});

	//or

	cart.addShipMethod('UPS Ground', 3.00, 'USD');
});
```

###.postCart(Callback, ReturnXML)

Build and post the shopping cart to Google

Example

```javascript
cart.postCart(function (err, redirectUrl) {
	if (err) {
		//deal with the error
		return;
	}

	console.log(redirectUrl);
});
```

## TODO
- Tax Tables
- Shipping Restrictions

Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API.html#checkout_api

#OrderProcessing

The `OrderProcessing` module
###.chargeAndShipOrder

Financial Requests
###.addMerchantOrderNumber

Fulfillment Requests
###.shipItems

## items 

[{
		item_id : 123456,
		trackingData : [
			{ carrier : 'UPS', trackingNumber : '55555555' },
			{ carrier : 'UPS', trackingNumber : '55555556' }
		]
}]
###.processOrder

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Process_Order
###.deliverOrder

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Deliver_Order
###.addTrackingData

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Add_Tracking_Data
###.archiveOrder

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Archiving_Commands.html#Archive_Order
###.unarchiveOrder

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Archiving_Commands.html#Unarchive_Order
