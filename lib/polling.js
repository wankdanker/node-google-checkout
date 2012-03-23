var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 

module.exports = Polling;

function Polling (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
};

Polling.Url = 'https://{merchantNumber}:{merchantKey}@sandbox.google.com/checkout/api/checkout/v2/reports/Merchant/{merchantNumber}'

//PRODUCTION URLs
//Polling.Url = 'https://{merchantNumber}:{merchantKey}@checkout.google.com/api/checkout/v2/reports/Merchant/{merchanNumber}'

/*
 * 
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_Beta_Polling_API.html#Submitting_a_notification-data-token-request
 */

Polling.prototype.notificationDataTokenRequest = function (startTime, callback) {
	var self = this
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null }
		, date
		, xml;
	
	if (typeof(startTime) == 'function') {
		callback = startTime;
	}
	else {
		date = startTime;
	}
	
	if (!date) {
		date = new Date();
		//Poll start times must be at least 5 minutes old
		date.setMinutes(date.getMinutes() -5);
	}
	
	date = new Date(date).toISOString();
	//strip off the milisecconds and the Z
	date = date.substr(0, date.length -5);
	
	doc = {
		'notification-data-token-request' : {
			'@' : {
				'xmlns' : 'http://checkout.google.com/schema/2'
			},
			'#' : {
				'start-time' : date
			}
		}
	};
	
	xml = utils.objectToXML(doc);
	
	self.gc.postXML(Polling.Url, xml, function (err, result) {
		if (err) {
			return callback(err, result);
		}
		else if (result.continueToken) {
			return callback(null, result.continueToken);
		}
		else {
			return callback(result, null);
		}
	});
};

/*
 * 
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_Beta_Polling_API.html#Submitting_a_notification-data-request
 */

Polling.prototype.notificationDataRequest = function (continueToken, callback) {
	var self = this
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null }
		, xml;
		
	doc = {
		'notification-data-request' : {
			'@' : {
				'xmlns' : 'http://checkout.google.com/schema/2'
			},
			'#' : {
				'continue-token' : continueToken
			}
		}
	};
	
	xml = utils.objectToXML(doc);
	
	self.gc.postXML(Polling.Url, xml, function (err, result) {
		if (err) {
			return callback(err, null);
		}
		else {
			return callback(null, result);
		}
	});
};
