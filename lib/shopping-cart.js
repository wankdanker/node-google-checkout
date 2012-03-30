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
//CheckOut.Url = 'https://{merchantNumber}:{merchantKey}@checkout.google.com/api/checkout/v2/merchantCheckout/Merchant/{merchantNumber}';

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
 * 		name : '',
 * 		price : 1.23,
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
 * 
 * TODO:
 *  * Tax Tables
 *  * Shipping Restrictions
 * 
 * Documentation:
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API.html#checkout_api
 */

CheckOut.prototype.postCart = function (callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null }
		, checkout = {}
		, shippingTag = (self.settings.merchantCalculationsShipping) 
			? 'merchant-calculated-shipping'
			: 'flat-rate-shipping'
		, merchantCheckoutFlowSupport
	
	doc['checkout-shopping-cart'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2'
		},
		'#' : {
			'shopping-cart' : {
				'items' : {
					'item' : utils.map(self.items, function (ix, item) {
						var obj = {}
						
						obj['item-name'] = item.name;
						obj['item-description'] = item.description;
						obj['unit-price currency="' + (item.currency || self.settings.currency) + '"'] = item.unitPrice;
						obj['quantity'] = item.quantity;
						obj['merchant-item-id'] = item.item_id;
						
						return obj;
					})
				}
			},
			'checkout-flow-support' : {
				'merchant-checkout-flow-support' : {}
			}
		}
	}

	merchantCheckoutFlowSupport = doc['checkout-shopping-cart']['#']
										['checkout-flow-support']
											['merchant-checkout-flow-support']
	
	if (self.shipMethods.length) {
		merchantCheckoutFlowSupport['shipping-methods'] = {};
		
		merchantCheckoutFlowSupport['shipping-methods']
			[shippingTag] = utils.map(self.shipMethods, function (ix, method) {
				return {
					'@' : {
						'name' : method.name
					},
					'#' : {
						'price' : {
							'@' : {
								'currency' : (method.currency || self.settings.currency)
							},
							'#' : method.price
						}
					}
				}
			});
	}

	if (self.settings.merchantCalculationsUrl) {
		merchantCheckoutFlowSupport['merchant-calculations'] = {
			'merchant-calculations-url' : self.settings.merchantCalculationsUrl,
			'accept-merchant-coupons' : self.settings.merchantCalculationsAcceptCoupons ? 'true' : 'false',
			'accept-gift-certificates' : self.settings.merchantCalculationsAcceptGiftCertifications ? 'true' : 'false'
		};
	}
	
	xml = utils.objectToXML(doc);
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(CheckOut.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc,
				requestXML : utils.objectToXML(doc)
			}, null);
		}
		else if (response.redirectUrl) {
			return callback(null, response.redirectUrl);
		}
		else {
			return callback(response, null );
		}
	});
};
