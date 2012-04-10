/*!
 * Module dependencies
 */

var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 
	
/*!
 * Export the module
 */

module.exports = Notification;

/*
 * The `Notification` module is used to...
 * 
 * There is no need to manually create an instance of this constructor function. Once you
 * have an instance of GoogleCheckout, you already have an instance...
 * 
 * Example
 * 
 * ```javascript
 * var gc = new GoogleCheckout(settings);
 * 
 * gc.Notification.notificationHistoryRequest(serialNumber, function (err, notification) {
 * });
 * ```
 * 
 * @param {Object} GoogleCheckout a `GoogleCheckout` instance
 * @return {Object} OrderProcessing
 * @api public
 */

function Notification (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
};

/*
 * Request a notification based on a serial number
 * 
 * Documentation
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Notification_API.html#serial_number_notifications
 * 
 * @param {String} serialNumber
 * @param {Function} callback
 * @return void
 * @api public
 */

Notification.prototype.notificationHistoryRequest = function (serialNumber, callback, returnXML) {
	var self = this
		, xml
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
	
	doc['notification-history-request'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2'
		},
		'#' : {
			'serial-number' : serialNumber
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