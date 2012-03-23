var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 

module.exports = CheckOut;

function CheckOut (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
	
	self.items = [];
	self.shipMethods = [];
};

CheckOut.Url = 'https://{merchantNumber}:{merchantKey}@sandbox.google.com/checkout/api/checkout/v2/merchantCheckout/Merchant/{merchantNumber}';
CheckOut.Url = 'https://checkout.google.com/api/checkout/v2/merchantCheckout/Merchant/';

/*
 * item should be { 
 * 		name : '', 
 * 		description : '', 
 * 		unitPrice : 1.23, 
 * 		currency : '', 
 * 		quantity : 1, 
 * 		item_id : '' 
 * }
 */

CheckOut.prototype.addItem = function (name, description, unitPrice, quantity, item_id, currency) {
	var self = this;
	
	if (arguments.length === 1 && typeof(name) === 'object') {
		//TODO: Validate the item has everything google requires
		
		self.items.push(name);
	}
	else {
		self.items.push({
			name : name,
			description : description,
			unitPrice : unitPrice,
			quantity : quantity,
			item_id : item_id,
			currency : currency || self.settings.currency
		});
	}
	
	return self;
};

/*
 * shipMethod should be {
 * 		name : ''
 * 		price : 1.23
 * 		currency : 'USD'
 * }
 * 
 */

CheckOut.prototype.addShipMethod = function (obj) {
	var self = this;
	self.shipMethods.push(obj);
	
	return self;
};

/*
 * XML API Related Methods
 */

CheckOut.prototype.getCartXML = function () {
	var self = this
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null }
		, checkout = {}
		, shoppingCart = { items : {} }
		, shippingMethods = {};
	
	doc['checkout-shopping-cart xmlns="http://checkout.google.com/schema/2"'] = checkout;
	checkout['shopping-cart'] = shoppingCart;
	
	checkout['checkout-flow-support'] = {
		'merchant-checkout-flow-support' : {
			'shipping-methods' : shippingMethods
		}
	};
	
	shoppingCart.items.item = utils.map(self.items, function (ix, item) {
		var obj = {}
		
		obj['item-name'] = item.name;
		obj['item-description'] = item.description;
		obj['unit-price currency="' + item.currency + '"'] = item.unitPrice;
		obj['quantity'] = item.quantity;
		
		return obj;
	});
	
	utils.map(self.shipMethods, function (ix, method) {
		var shippingTag = 'flat-rate-shipping name="' + method.name + '"'
		shippingMethods[shippingTag] = {};
		shippingMethods[shippingTag]['price currency="' + method.currency + '"'] = method.price;
	});

	return utils.objectToXML(doc);
};

CheckOut.prototype.postCart = function (callback) {
	var self = this;
	
	self.gc.postXML(CheckOut.Url, self.getCartXML(), function (err, result) {
		if (err) {
			return callback(err, null);
		}
		else if (result.redirectUrl) {
			return callback(null, result.redirectUrl);
		}
		else {
			return callback(result, null );
		}
	});
};

