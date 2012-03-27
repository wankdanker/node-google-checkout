var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 

module.exports = Reporting;

function Reporting (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
};

Reporting.Url = 'https://{merchantNumber}:{merchantKey}@sandbox.google.com/checkout/api/checkout/v2/reports/Merchant/{merchantNumber}';
//Reporting.Url = 'https://{merchantNumber}:{merchantKey}@checkout.google.com/api/checkout/v2/reports/Merchant/{merchantNumber}';

/*
 * 
 * 
 * http://code.google.com/apis/checkout/developer/Google_Checkout_XML_API_Order_Report_API.html#Sending_an_Order_Report_API_Request
 */

Reporting.prototype.orderListRequest = function (startDate, endDate, filter, callback) {
	var self = this
		, doc = { '?xml version="1.0" encoding="UTF-8"?' : null }
		, checkout = {}
		, shoppingCart = { items : {} }
		, shippingMethods = {};
	
	startDate = new Date(startDate);
	endDate = new Date(endDate);
	
	if (typeof(filter) == 'function') {
		callback = filter;
		filter = {};
	}
	
	doc['order-list-request'] = {
		'@' : {
			'xmlns' : 'http://checkout.google.com/schema/2',
			'start-date' : startDate,
			'end-date' : endDate
		},
		'#' : {
			'date-time-zone' : self.settings.timeZone
		}
	};

	if (filter.financialState) {
		doc['order-list-request']['#']['financial-state'] = filter.financialState;
	}
	
	if (filter.financialState) {
		doc['order-list-request']['#']['fulfillment-state'] = filter.fulfillmentState;
	}
	
	self.gc.postXML(Reporting.Url, utils.objectToXML(doc), function (err, response) {
		var rg = /Error\:\ Non\-whitespace before first tag\./
		
		//If the xml parsing failed then it's most likely the proper CSV response.
		//TODO: fix this behavior? We know that it will be a CSV response, but only
		//if the request is valid otherwise it will be XML... what to do?
		if (err && rg.test(err)) {
			return callback(null, response);
		}
		else if (err) {
			return callback(err, null);
		}
		else if (response.errorMessage) {
			return callback({
				message : response.errorMessage,
				response : response,
				request : doc
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
