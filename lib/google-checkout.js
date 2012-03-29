var assert = require('assert'),
	crypto = require('crypto'),
	utils = require('./utils'), //this module is not publicly available
	request = require('request')
	xml2js = require('xml2js'),
	CheckOut = require('./check-out'),
	Polling = require('./polling'),
	OrderProcessing = require('./order-processing'),
	OrderReporting = require('./order-reporting'),
	MerchantCalculations = require('./merchant-calculations');

module.exports = GoogleCheckout;

function GoogleCheckout(settings) {
	var self = this;
	
	assert.ok(settings.merchantNumber, 'settings.merchantNumber is required');
	assert.ok(settings.merchantKey, 'settings.merchantKey is required');
	assert.ok(settings.currency, 'settings.currency is required');
	
	self.settings = settings;
	
	self.CheckOut = new CheckOut(self); //TODO: get rid of this. force using createCart()
	self.Polling = new Polling(self);
	self.OrderProcessing = new OrderProcessing(self);
	self.OrderReporting = new OrderReporting(self);
	self.MerchantCalculations = new MerchantCalculations(self);
}

GoogleCheckout.ImageUrl = 'https://checkout.google.com/buttons/checkout.gif?merchant_id={merchantNumber}&w=180&h=46&style=trans&variant={variant}&loc=en_US';

GoogleCheckout.prototype.createCart = function (callback) {
	var self = this;
	
	process.nextTick(function () {
		var newCart = new CheckOut(self);
		
		return callback(null, newCart);
	});
};

GoogleCheckout.prototype.postXML = function (url, xml, callback) {
	var self = this
		, options = {
			url : url.replace(/\{merchantNumber\}/gi, self.settings.merchantNumber)
					 .replace(/\{merchantKey\}/gi, self.settings.merchantKey)
			, method : 'POST'
			, body : xml
		};

	request(options, function (error, response, body) {
		if (error) {
			return callback(error, null);
		}
		else if (body) {
			self.parseXML(body, callback);
		}
	});
};

GoogleCheckout.prototype.parseXML = function (xml, callback) {
	var parser = new xml2js.Parser();
	
	parser.on('end', function (result) {
		return callback(null, camelCaseObjectKeys(result));
	});
	
	parser.on('error', function (error) {
		return callback(error, xml);
	});
	
	parser.parseString(xml);
};

GoogleCheckout.prototype.getButtonUrl = GoogleCheckout.getImageUrl = function (variant, merchantNumber) {
	var self = this;
	
	//Since this function is also static method, we need to check to see 
	//what the constructor of `this` is to see where we should get the
	//merchant number from
	if (self.constructor.name == 'GoogleCheckout') {
		merchantNumber = merchantNumber || self.settings.merchantNumber
	}
	
	switch (variant) {
		case 'disabled':
			break;
		case 'text':
			break;
		default:
			variant = 'text';
	}
	
	return GoogleCheckout.ImageUrl
			.replace('{merchantNumber}', merchantNumber)
			.replace('{variant}', variant);
};

/*
 * Return a new object where all keys like:
 * 		this-thing-here
 * become:
 * 		thisThingHere
 */

function camelCaseObjectKeys(obj) {
	var newObj = (Array.isArray(obj)) 
		? new Array(obj.length)
		: {};
	
	utils.map(obj, function (key, value) {
		var newKey;
		
		if (typeof(key) === 'string') {
			newKey = key.replace(/-([a-z]{1})/gi, function (_, letter) { return letter.toUpperCase() })
		}
		else {
			newKey = key;
		}
		
		if (typeof(value) === 'object') {
			newObj[newKey] = camelCaseObjectKeys(value);
		}
		else {
			newObj[newKey] = value;
		}
	});
	
	if (!Object.keys(newObj).length) {
		newObj = null;
	}
	
	return newObj;
}