# DEFUNCT

This module is no longer maintained or useful. Google deprecated Checkout in lieu of 
Wallet. I stopped working on this as soon as Google made that announcement.

# node-google-checkout

A Google Checkout API implementation for node.js

## Status

This API is currently working in the sandbox environment. I am working on documentation.

## Dependencies

 - sanitizer version 0.0.15
 - request version 2.9.153
 - xml2js version 0.1.13
 - optimist version 0.3.1

-----------

# GoogleCheckout(settings)
The `GoogleCheckout` constructor function.

__settings__ - An object of settings


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

### .createCart(callback)
Create a new instance of `ShoppingCart`


__callback__ - 



### .postXML(url, xml, callback)
Post `xml` to `url` via an HTTP request.

__url__ - 

__xml__ - 

__callback__ - 


Before being used, `url` is processed by replacing '{merchantNumber}' 
and '{merchantKey}' with `settings.merchantNumber` and 
`settings.merchantKey` respectively.

### .parseXML(xml, callback)
Parse a string of XML and convert it to a JavaScript object.

__xml__ - 

__callback__ - 


This function processes a string of XML and converts it to
a JavaScript object. Google's XML tags consistently replace
spaces with '-'. We replace each '-' and the following character
with just the capitalized character which follows the '-' by using
the `camelCaseObjectKeys()` function.

This gives us consistent camel case objects returned from Google.


-----------

# ShoppingCart(GoogleCheckout)
The `ShoppingCart` module provides methods for adding items, adding shipping options
and submitting a shopping cart to Google. After submitting the shopping cart to 
Google, you will receive a URL to redirect your user to.

__GoogleCheckout__ - A GoogleCheckout instance object.


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

### .addItem(name, description, unitPrice, quantity, item_id, currency)
Add an item to the list of items currently in the shopping cart.

__name__ - 

__description__ - 

__unitPrice__ - 

__quantity__ - 

__item_id__ - 

__currency__ - 


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

### .addShipMethod(ShippingMethodObject)
Add a shipping option to the shopping cart

__ShippingMethodObject__ - 


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

### .postCart(Callback, ReturnXML)
Build and post the shopping cart to Google

__Callback__ - 

__ReturnXML__ - If specified, callback will be called with the XML that would be supplied to Google.


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

TODO

- Tax Tables
- Shipping Restrictions

Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API.html#checkout_api


-----------

# OrderProcessing(GoogleCheckout)
The `OrderProcessing` module is used to charge and update order information

__GoogleCheckout__ - a `GoogleCheckout` instance


There is no need to manually create an instance of this constructor function. Once you
have an instance of GoogleCheckout, you already have an instance...

Example

```javascript
var gc = new GoogleCheckout(settings);

gc.OrderProcessing.chargeAndShipOrder(
	'1234569034'
	, 50.24
	, ['1Z2343452345234'
	, function (err, response) {
		if (err) {
			//deal with the error
			return;
		}

		//process the response
});
```

### .chargeAndShipOrder(googleOrderNumber, amount, trackingData, callback)
Charge and Ship an order

__googleOrderNumber__ - 

__amount__ - 

__trackingData__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Financial_Commands.html#Charge_And_Ship_Order

### .refundOrder(googleOrderNumber, amount, reason, comment, callback)
Refund an order

__googleOrderNumber__ - 

__amount__ - 

__reason__ - 

__comment__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Financial_Commands.html#Refund_Order

### .cancelOrder(googleOrderNumber, reason, comment, callback)
Cancel an order

__googleOrderNumber__ - 

__reason__ - 

__comment__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Financial_Commands.html#Cancel_Order

### .authorizeOrder(googleOrderNumber, callback)
Authorize an order

__googleOrderNumber__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Financial_Commands.html#Authorize_Order

### .addMerchantOrderNumber(googleOrderNumber, merchantOrderNumber, callback)
Add Merchant order number to an order

__googleOrderNumber__ - 

__merchantOrderNumber__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Add_Merchant_Order_Number

### .sendBuyerMessage(googleOrderNumber, message, sendEmail, callback)
Send the buyer a message

__googleOrderNumber__ - 

__message__ - 

__sendEmail__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Send_Buyer_Message

### .shipItems(googleOrderNumber, items, sendEmail, callback)
Ship Items on an order

__googleOrderNumber__ - 

__items__ - 

__sendEmail__ - 

__callback__ - 


```javascript 
items = [
	{
		item_id : 123456,
		trackingData : [
			{ carrier : 'UPS', trackingNumber : '55555555' },
			{ carrier : 'UPS', trackingNumber : '55555556' }
		]
	}
];
```

Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Ship_Items

### .backorderItems(googleOrderNumber, items, sendEmail, callback)
Backorder items on an order

__googleOrderNumber__ - 

__items__ - an aray of `item_id`s

__sendEmail__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Backorder_Items

### .returnItems(googleOrderNumber, items, sendEmail, callback)
Return items on an order

__googleOrderNumber__ - 

__items__ - an aray of `item_id`s

__sendEmail__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Return_Items

### .cancelItems(googleOrderNumber, items, sendEmail, reason, comment, callback)
Cancel items on an order

__googleOrderNumber__ - 

__items__ - an aray of `item_id`s

__sendEmail__ - 

__reason__ - 

__comment__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Cancel_Items

### .resetItemsShippingInformation(googleOrderNumber, items, sendEmail, callback)
Reset shipping information for items on an order

__googleOrderNumber__ - 

__items__ - an aray of `item_id`s

__sendEmail__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Resetting_Shipping_Status

### .processOrder(googleOrderNumber, callback)
Process an Order

__googleOrderNumber__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Process_Order

### .deliverOrder(googleOrderNumber, trackingData, callback)
Deliver an order

__googleOrderNumber__ - 

__trackingData__ - 

__callback__ - 


```javascript
trackingData = [
	{
		carrier : 'UPS',
		trackingNumber : '1Z2343452345234'
	}
];
```

Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Deliver_Order

### .addTrackingData(googleOrderNumber, trackingData, callback)
Add tracking Data to an order

__googleOrderNumber__ - 

__trackingData__ - 

__callback__ - 


```javascript
trackingData = [
	{
		carrier : 'UPS',
		trackingNumber : '1Z2343452345234'
	}
];
``` 

Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Add_Tracking_Data

### .archiveOrder(googleOrderNumber, callback)
Archive an order

__googleOrderNumber__ - 

__callback__ - 


Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Archiving_Commands.html#Archive_Order

### .unarchiveOrder(googleOrderNumber, callback)
Unarchive an order

__googleOrderNumber__ - 

__callback__ - 



Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Archiving_Commands.html#Unarchive_Order

### .orderListRequest
http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Report_API.html#Sending_an_Order_Report_API_Request




-----------

# MerchantCalculations(objGoogleCheckout)
Instantiate an instance of the GoogleCheckout MerchantCalculations prototype

__objGoogleCheckout__ - an instance of a `GoogleCheckout` object object


## Examples

### .merchantCalculationCallback
{
	shoppingCart : {
		//google-supplied shopping cart data
	},
	addresses : [
		{
			id : 'google-supplied-id',
			countryCode : 'google-supplied-country-code',
			city : 'google-supplied-city',
			region : 'google-supplied-region',
			postalCode : 'google-supplied-postal-code',
			
			//if callbacks enabled for shipping
			shippingName : 'google-supplied-shipping-name',
			shippingRate : 'REQUIRED',
			shippingCurrency : 'OPTIONAL-OR-USE-DEFAULT',
			shippable : 'REQUIRED',
			
			//if callbacks enabled for tax
			totalTax : 'REQUIRED',
			
			//if callbacks enabled for merchantCodes
			merchantCodes : [
				{
					type : 'REQUIRED (coupon or gift-certificate) ',
					valid : 'REQUIRED (true or false)',
					calculatedAmount : 'REQUIRED',
					message: 'REQUIRED/OPTIONAL - idk'
				}
			]
		}
	]
}




-----------

# Polling(objGoogleCheckout)
Instantiate an instance of the GoogleCheckout Polling prototype

__objGoogleCheckout__ - An instance of a GoogleCheckout object


## Examples

    var gc = new GoogleCheckout({ merchantNumber : '1234', merchantKey : 'ABCD', currency : 'USD'});
    var p = new Polling(gc);

This is not really necessary though because an instance of GoogleCheckout contains
an instance of Polling

    var gc = new GoogleCheckout({ merchantNumber : '1234', merchantKey : 'ABCD', currency : 'USD'});

    gc.Polling.on('newOrderNotification', function (order) {
      console.log(order)
    });

    gc.Polling.run();

## Continue Token Events

- notificationDataTokenResponse - 'Raw'
- continueToken


## Notification Events

- notificationDataResponse - 'Raw'
- newOrderNotification
- authorizationAmountNotification
- riskInformationNotification
- orderStateChangeNotification
- chargeAmountNotification
- refundAmountNotification
- chargebackAmountNotification

### .notificationDataTokenRequest(StartTime, Callback)
Request a _continueToken_ for polling

__StartTime__ - 

__Callback__ - function


## Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_Beta_Polling_API.html#Submitting_a_notification-data-token-request

### .notificationDataRequest(ContinueToken, Callback)
Request notification data

__ContinueToken__ - The token retrieved from Google by `notificationDataTokenRequest`

__Callback__ - function


Documentation: 

http://code.google.com/apis/checkout/developer/Google_Checkout_Beta_Polling_API.html#Submitting_a_notification-data-request

### .run(ContinueToken)
Start the timer to poll events from Google


__ContinueToken__ - Optional - The token retrieved from Google by `notificationDataTokenRequest`



