/*!
 * Module dependencies
 */

var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 
	
/*!
 * Export the module
 */

module.exports = OrderProcessing;

/*
 * The `OrderProcessing` module is used to charge and update order information
 * 
 * There is no need to manually create an instance of this constructor function. Once you
 * have an instance of GoogleCheckout, you already have an instance...
 * 
 * Example
 * 
 * ```javascript
 * var gc = new GoogleCheckout(settings);
 * 
 * gc.OrderProcessing.chargeAndShipOrder(
 * 	'1234569034'
 * 	, 50.24
 * 	, ['1Z2343452345234'
 * 	, function (err, response) {
 * 		if (err) {
 *			//deal with the error
 * 			return;
 * 		}
 * 
 *		//process the response
 * });
 * ```
 * 
 * @param {Object} GoogleCheckout a `GoogleCheckout` instance
 * @return {Object} OrderProcessing
 * @api public
 */

function OrderProcessing (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
};

/*!
 * Submit URL
 */

OrderProcessing.Url = 'https://{merchantNumber}:{merchantKey}@sandbox.google.com/checkout/api/checkout/v2/request/Merchant/{merchantNumber}';
//OrderProcessing.Url = 'https://{merchantNumber}:{merchantKey}@checkout.google.com/api/checkout/v2/request/Merchant/{merchantNumber}';

/*
 * Charge and Ship an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Financial_Commands.html#Charge_And_Ship_Order
 * 
 * @param {String} googleOrderNumber
 * @param {Float} amount
 * @param {Array} trackingData
 * @param {Function} callback
 * @return void
 * @ap public
 */

OrderProcessing.prototype.chargeAndShipOrder = function (googleOrderNumber, amount, trackingData, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['charge-and-ship-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'amount' : {
				'@' : {
					'currency' : self.settings.currency
				},
				'#' : amount
			},
			'tracking-data-list' : {
				'tracking-data' : map(trackingData, function (ix, tracking) {
						return {
							'carrier' : tracking.carrier,
							'tracking-number' : tracking.trackingNumber
						}
					})
			}
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Refund an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Financial_Commands.html#Refund_Order
 * 
 * @param {String} googleOrderNumber
 * @param {Float} amount
 * @param {String} reason
 * @param {String} comment
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.refundOrder = function (googleOrderNumber, amount, reason, comment, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['refund-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'amount' : {
				'@' : {
					'currency' : self.settings.currency
				},
				'#' : amount
			},
			'comment' : comment,
			'reason' : reason
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Cancel an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Financial_Commands.html#Cancel_Order
 * 
 * @param {String} googleOrderNumber
 * @param {String} reason
 * @param {String} comment
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.cancelOrder = function (googleOrderNumber, reason, comment, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['cancel-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'comment' : comment,
			'reason' : reason
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Authorize an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Financial_Commands.html#Authorize_Order
 * 
 * @param {String} googleOrderNumber
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.authorizeOrder = function (googleOrderNumber, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['authorize-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Add Merchant order number to an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Add_Merchant_Order_Number
 * 
 * @param {String} googleOrderNumber
 * @param {String} merchantOrderNumber
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.addMerchantOrderNumber = function (googleOrderNumber, merchantOrderNumber, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['add-merchant-order-number'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'merchant-order-number' : merchantOrderNumber
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Send the buyer a message
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Send_Buyer_Message
 * 
 * @param {String} googleOrderNumber
 * @param {String} message
 * @param {Boolean} sendEmail
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.sendBuyerMessage = function (googleOrderNumber, message, sendEmail, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['send-buyer-message'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'message' : message,
			'send-email' : (sendEmail) ? 'true' : 'false'
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Ship Items on an order
 *
 * ```javascript 
 * items = [
 * 	{
 * 		item_id : 123456,
 * 		trackingData : [
 * 			{ carrier : 'UPS', trackingNumber : '55555555' },
 * 			{ carrier : 'UPS', trackingNumber : '55555556' }
 * 		]
 * 	}
 * ];
 * ```
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Ship_Items
 * 
 * @param {String} googleOrderNumber
 * @param {Array} items
 * @param {Boolean} sendEmail
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.shipItems = function (googleOrderNumber, items, sendEmail, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['ship-items'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'item-shipping-information-list' : {
				'item-shipping-information' : map(items, function (ix, item) {
					return {
						'item_id' : {
							'merchant-item-id' : item.item_id
						},
						'tracking-data-list' : {
							'tracking-data' : map(item.trackingData, function (ix, trackingData) {
								return {
									'carrier' : trackingData.carrier,
									'tracking-number' : trackingData.trackingNumber
								}
							})
						}
					}
				}, true)
			},
			'send-email' : (sendEmail) ? 'true' : 'false'
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Backorder items on an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Backorder_Items
 * 
 * @param {String} googleOrderNumber
 * @param {Array} items an aray of `item_id`s
 * @param {Boolean} sendEmail
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.backorderItems = function (googleOrderNumber, items, sendEmail, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['backorder-items'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'item-ids' : {
				'item-id' : map(items, function (ix, item) {
					return {
						'merchant-item-id' : item.item_id
					}
				}, true)
			},
			'send-email' : (sendEmail) ? 'true' : 'false'
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Return items on an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Return_Items
 * 
 * @param {String} googleOrderNumber
 * @param {Array} items an aray of `item_id`s
 * @param {Boolean} sendEmail
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.returnItems = function (googleOrderNumber, items, sendEmail, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['return-items'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'item-ids' : {
				'item-id' : map(items, function (ix, item) {
					return {
						'merchant-item-id' : item.item_id
					}
				}, true)
			},
			'send-email' : (sendEmail) ? 'true' : 'false'
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Cancel items on an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Cancel_Items
 * 
 * @param {String} googleOrderNumber
 * @param {Array} items an aray of `item_id`s
 * @param {Boolean} sendEmail
 * @param {String} reason
 * @param {String} comment
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.cancelItems = function (googleOrderNumber, items, sendEmail, reason, comment, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['cancel-items'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'reason' : reason,
			'comment' : comment,
			'item-ids' : {
				'item-id' : map(items, function (ix, item) {
					return {
						'merchant-item-id' : item.item_id
					}
				}, true)
			},
			'send-email' : (sendEmail) ? 'true' : 'false'
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Reset shipping information for items on an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Line_Item_Shipping.html#Resetting_Shipping_Status
 * 
 * @param {String} googleOrderNumber
 * @param {Array} items an aray of `item_id`s
 * @param {Boolean} sendEmail
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.resetItemsShippingInformation = function (googleOrderNumber, items, sendEmail, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['reset-items-shipping-information'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'item-ids' : {
				'item-id' : map(items, function (ix, item) {
					return {
						'merchant-item-id' : item.item_id
					}
				}, true)
			},
			'send-email' : (sendEmail) ? 'true' : 'false'
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Process an Order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Process_Order
 * 
 * @param {String} googleOrderNumber
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.processOrder = function (googleOrderNumber, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['process-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Deliver an order
 * 
 * ```javascript
 * trackingData = [
 * 	{
 * 		carrier : 'UPS',
 * 		trackingNumber : '1Z2343452345234'
 * 	}
 * ];
 * ```
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Deliver_Order
 * 
 * @param {String} googleOrderNumber
 * @param {Array} trackingData
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.deliverOrder = function (googleOrderNumber, trackingData, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['deliver-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'tracking-data' : 
				map(trackingData, function (ix, tracking) {
					return {
						'carrier' : tracking.carrier,
						'tracking-number' : tracking.trackingNumber
					};
				})
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};


/*
 * Add tracking Data to an order
 * 
 * ```javascript
 * trackingData = [
 * 	{
 * 		carrier : 'UPS',
 * 		trackingNumber : '1Z2343452345234'
 * 	}
 * ];
 * ``` 
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Add_Tracking_Data
 * 
 * @param {String} googleOrderNumber
 * @param {Array} trackingData
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.addTrackingData = function (googleOrderNumber, trackingData, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['add-tracking-data'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		},
		'#' : {
			'tracking-data' : 
				map(trackingData, function (ix, tracking) {
					return {
						'carrier' : tracking.carrier,
						'tracking-number' : tracking.trackingNumber
					};
				})
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Archive an order
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Archiving_Commands.html#Archive_Order
 * 
 * @param {String} googleOrderNumber
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.archiveOrder = function (googleOrderNumber, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['archive-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};

/*
 * Unarchive an order
 * 
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Archiving_Commands.html#Unarchive_Order
 * 
 * @param {String} googleOrderNumber
 * @param {Function} callback
 * @return void
 * @api public
 */

OrderProcessing.prototype.unarchiveOrder = function (googleOrderNumber, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['unarchive-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		}
	};
	
	xml = utils.objectToXML(doc)
	
	if (returnXML) {
		return callback(null, xml);
	}
	
	self.gc.postXML(OrderProcessing.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
			}, null);
		}
		else {
			return callback(null, response);
		}
	});
};
