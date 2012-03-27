var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 

module.exports = OrderProcessing;

function OrderProcessing (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
};


OrderProcessing.Url = 'https://{merchantNumber}:{merchantKey}@sandbox.google.com/checkout/api/checkout/v2/request/Merchant/{merchantNumber}';
//OrderProcessing.Url = 'https://{merchantNumber}:{merchantKey}@checkout.google.com/api/checkout/v2/request/Merchant/{merchantNumber}';

/*
 * Financial Requests
 */

OrderProcessing.prototype.chargeAndShipOrder = function (googleOrderNumber, amount, trackingData, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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

OrderProcessing.prototype.refundOrder = function (googleOrderNumber, amount, reason, comment, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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

OrderProcessing.prototype.cancelOrder = function (googleOrderNumber, reason, comment, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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

OrderProcessing.prototype.authorizeOrder = function (googleOrderNumber, callback) {
	var self = this
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['authorize-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		}
	};
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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
 * Fulfillment Requests
 */

OrderProcessing.prototype.addMerchantOrderNumber = function (googleOrderNumber, merchantOrderNumber, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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

OrderProcessing.prototype.sendBuyerMessage = function (googleOrderNumber, message, sendEmail, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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
 * Line-item shipping requests
 */

/*
 * items :
 * 
 * [{
 * 		item_id : 123456,
 * 		trackingData : [
 * 			{ carrier : 'UPS', trackingNumber : '55555555' },
 * 			{ carrier : 'UPS', trackingNumber : '55555556' }
 * 		]
 * }]
 * 
 */

OrderProcessing.prototype.shipItems = function (googleOrderNumber, items, sendEmail, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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

OrderProcessing.prototype.backorderItems = function (googleOrderNumber, items, sendEmail, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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

OrderProcessing.prototype.returnItems = function (googleOrderNumber, items, sendEmail, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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

OrderProcessing.prototype.cancelItems = function (googleOrderNumber, items, sendEmail, reason, comment, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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

OrderProcessing.prototype.resetItemsShippingInformation = function (googleOrderNumber, items, sendEmail, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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
 * Order-level shipping requests
 */

/*
 * 
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Process_Order
 */

OrderProcessing.prototype.processOrder = function (googleOrderNumber, callback) {
	var self = this
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['process-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		}
	};
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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
 * 
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Deliver_Order
 */

OrderProcessing.prototype.deliverOrder = function (googleOrderNumber, trackingData, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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
 * 
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Level_Shipping.html#Add_Tracking_Data
 */

OrderProcessing.prototype.addTrackingData = function (googleOrderNumber, trackingData, callback) {
	var self = this
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
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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
 * 
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Archiving_Commands.html#Archive_Order
 */

OrderProcessing.prototype.archiveOrder = function (googleOrderNumber, callback) {
	var self = this
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['archive-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		}
	};
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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
 * 
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Archiving_Commands.html#Unarchive_Order
 */

OrderProcessing.prototype.unarchiveOrder = function () {
		var self = this
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['unarchive-order'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'google-order-number' : googleOrderNumber
		}
	};
	
	self.gc.postXML(OrderProcessing.Url, utils.objectToXML(doc), function (err, response) {
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
