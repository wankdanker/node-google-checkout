var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 

module.exports = Polling;

function Polling (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
	self.continueToken = null;
};

Polling.prototype = new process.EventEmitter;

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
			self.continueToken = result.continueToken;
			self.emit('continueToken', result.continueToken);
			self.emit('notificationDataTokenResponse', result);
			
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
	
	if (typeof(continueToken) === 'function') {
		callback = continueToken;
		continueToken = null;
	}
	
	doc = {
		'notification-data-request' : {
			'@' : {
				'xmlns' : 'http://checkout.google.com/schema/2'
			},
			'#' : {
				'continue-token' : continueToken || self.continueToken
			}
		}
	};
	
	xml = utils.objectToXML(doc);
	
	self.gc.postXML(Polling.Url, xml, function (err, result) {
		if (err) {
			return callback(err, null);
		}
		else {
			//TODO: should we not emit the new token if it is the same
			//as the existing? Or should we just let the user handle
			//that in the continueToken event handler?
			if (result.continueToken) {
				self.continueToken = result.continueToken;
				self.emit('continueToken', result.continueToken);
			}
			
			self.emit('notificationDataResponse', result);
			return callback(null, result);
		}
	});
};

Polling.prototype.run = function (continueToken) {
	var self = this;
	
	if (!continueToken && !self.continueToken) {
		//We need to get our initial continue token.
		//NOTE: without having specified a date we will use 5 minutes
		//ago as the start date. This may cause missed notifications.
		
		self.notificationDataTokenRequest(function (err, continueToken) {
			self.run(continueToken);
		});
		
		return;
	}
	
	//Poll now.
	self.notificationDataRequest(continueToken || self.continueToken, function (err, data) {
		//Do nothing?
	});
	
	//Check to see if we have already started the timer
	if (!self.interval) {
		//Schedule the Poll to occur on the pollInterval
		self.interval = setInterval(function () {
			self.run();
		}, self.settings.pollInterval || 600000); //default to 10 minutes
	}
};
