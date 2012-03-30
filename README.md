node-google-checkout
====================

A Google Checkout API implementation for node.js

Status
------

This API is currently working in the sandbox environment. I am working on 
documentation. 

Documentation
=============


#ShoppingCart(GoogleCheckout)

The `ShoppingCart` module provides methods for adding items, adding shipping options
and submitting a shopping cart to Google. After submitting the shopping cart to 
Google, you will receive a URL to redirect your user to.

There is no point in calling the constructor manually. You can get an
instance of `ShoppingCart` like this

	var gc = new GoogleCheckout(settings);
	
	gc.createCart(function (err, cart) {
		
	});

Here is a complete example of building a cart and pushing it to Google

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

###ShoppingCart.addItem(Name, Description, UnitPrice, Quantity, Item_id, Currency)

Add an item to the list of items currently in the shopping cart.

You may optionally base an ItemObject in place of Name. The ItemObject should
contain all the properties in the example listed below, with the exception of
the currency property. If the currency property is omitted, then the default
currency will be used.

		ItemObject = { 
			name : '', 
			description : '', 
			unitPrice : 1.23, 
			currency : '', 
			quantity : 1, 
			item_id : '' 
		}

###ShoppingCart.addShipMethod(ShippingMethodObject)

Add a shipping option to the shopping cart

		ShipMethodObject = {
			name : '',
			price : 1.23,
			currency : 'USD'
		}

###ShoppingCart.postCart(Callback, ReturnXML)

Build and post the shopping cart to Google

TODO
 * Tax Tables
 * Shipping Restrictions

Documentation

http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API.html#checkout_api

