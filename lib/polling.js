/*!
 * Module dependencies.
 */

var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 

/*!
 * Export the module 
 */

module.exports = Polling;

/**
 * Instantiate an instance of the GoogleCheckout Polling prototype
 *
 * Examples:
 *
 *     var gc = new GoogleCheckout({ merchantNumber : '1234', merchantKey : 'ABCD', currency : 'USD'});
 *     var p = new Polling(gc);
 * 
 * This is not really necessary though because an instance of GoogleCheckout contains
 * an instance of Polling
 * 
 *     var gc = new GoogleCheckout({ merchantNumber : '1234', merchantKey : 'ABCD', currency : 'USD'});
 * 
 *     gc.Polling.on('newOrderNotification', function (order) {
 *       console.log(order)
 *     });
 * 
 *     gc.Polling.run();
 * 
 * @param {Object} An instance of a GoogleCheckout object
 * @return {Object} Polling Object
 * @api public
 * 
 */

function Polling (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
	self.continueToken = null;
};

/*
 * Set the prototype to an instance of an EventEmitter
 */

Polling.prototype = new process.EventEmitter;

Polling.Url = 'https://{merchantNumber}:{merchantKey}@sandbox.google.com/checkout/api/checkout/v2/reports/Merchant/{merchantNumber}'

//This is a list of known notifications that have been collected
Polling.Notifications = [
	'newOrderNotification'
	, 'authorizationAmountNotification'
	, 'riskInformationNotification'
	, 'orderStateChangeNotification'
	, 'chargeAmountNotification'
	, 'refundAmountNotification'
	, 'chargebackAmountNotification'
];

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
	
	self.gc.postXML(Polling.Url, xml, function (err, response) {
		if (err) {
			return callback(err, null);
		}
		else {
			//TODO: should we not emit the new token if it is the same
			//as the existing? Or should we just let the user handle
			//that in the continueToken event handler?
			if (response.continueToken) {
				self.continueToken = response.continueToken;
				self.emit('continueToken', response.continueToken);
			}
			
			//only emit events if we acually have notifications
			if (response.notifications) {
				self.emit('notificationDataResponse', response);
				
				//loop through each key (notificationName) in the response's notifications Object
				utils.map(response.notifications, function (notificationName, notification) {
					
					//If this notification is an array of notifications, we will emit
					//an event for each individual notification
					if (Array.isArray(notification)) {
						map(notification, function (ix, individualNotification) {
							self.emit(notificationName, individualNotification);
						}, true);
					}
					else {
						self.emit(notificationName, notification);
					}
					
				}, true); //squash the array created by map so that an array of undefined is not created
				
				return callback(null, response);
			}
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
