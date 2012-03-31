node-google-checkout
====================

A Google Checkout API implementation for node.js

Status
------

This API is currently working in the sandbox environment. I am working on documentation.

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
	... there is more but can't recall atm.
}
```

Example

```javascript
var gc = new GoogleCheckout({
	merchantNumber : '12345612345',
	merchantKey : '234543254345345',
	currency : 'USD',
	timeZone : 'America/New_York'
});
```

###GoogleCheckout.createCart(callback)

Create a new instance of `ShoppingCart`

###GoogleCheckout.postXML(url, xml, callback)

Post `xml` to `url` via an HTTP request.

`url` is processed by replacing '{merchantNumber}' and '{merchantKey}'
with `settings.merchantNumber` and `settings.merchantKey` respectively.

###GoogleCheckout.parseXML(xml, callback)

Parse a string of xml and convert it to a JavaScript object.

This function processes a string of xml and converts it to
a JavaScript object. Google's xml tags consistently replace
spaces with '-'. We replace each '-' and the following character
with just the capitalized character which follows the '-' by using
the `camelCaseObjectKeys()` function.

This gives us consistent camel case objects returned from Google.

#camelCaseObjectKeys(obj)

Process an object and replace key names with camel cased key names

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

###ShoppingCart.addItem(Name, Description, UnitPrice, Quantity, Item_id, Currency)

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

###ShoppingCart.addShipMethod(ShippingMethodObject)

Add a shipping option to the shopping cart

```javascript
ShipMethodObject = {
	name : '',
	price : 1.23,
	currency : 'USD'
};
```
###ShoppingCart.postCart(Callback, ReturnXML)

Build and post the shopping cart to Google

TODO
 * Tax Tables
 * Shipping Restrictions

Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API.html#checkout_api

