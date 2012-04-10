/*!
 * Module dependencies
 */

var assert = require('assert'),
	crypto = require('crypto'),
	utils = require('./utils'), //this module is not publicly available
	request = require('request')
	xml2js = require('xml2js'),
	ShoppingCart = require('./shopping-cart'),
	Polling = require('./polling'),
	OrderProcessing = require('./order-processing'),
	OrderReporting = require('./order-reporting'),
	MerchantCalculations = require('./merchant-calculations');

/*!
 * Export the module
 */

module.exports = GoogleCheckout;

/*
 * The `GoogleCheckout` constructor function.
 * 
 * This is the main constructor function and where all of the magic starts.
 * Once you have an instance of `GoogleCheckout` you have access to all of
 * the following submodules
 * 
 * * ShoppingCart - `GoogleCheckout.createCart()`
 * * MerchantCalculations - `GoogleCheckout.MerchantCalculations`
 * * Notification - `GoogleCheckout.Notification`
 * * Polling - `GoogleCheckout.Polling`
 * * OrderProcessing - `GoogleCheckout.OrderProcessing`
 * * OrderReporting - `GoogleCheckout.OrderReporting`
 * 
 * Settings
 * 
 * ```javascript
 * settings = {
 * 	merchantNumber : 'YOUR MERCHANT NUMBER',
 * 	merchantKey : 'YOUR MERCHANT KEY',
 * 	currency : 'YOUR CURRENCY - LIKE USD',
 * 	timeZone : 'America/New_York',
 * 	merchantCalculationsUrl : 'http://yoursite.com/merchant-callback-url',
 * 	merchantCalculationsAcceptCoupons : false,
 * 	merchantCalculationsAcceptGiftCertifications : false,
 * 	merchantCalculationsShipping : false
 * }
 * ```
 * 
 * - __merchantNumber__ : your merchant number obtained from Google
 * - __merchantKey__ : your merchant key obtained from Google
 * - __currency__ : the default currency for your site. If you have this set, you can ignore
 *   setting this value in methods that have it as an argument.
 * - __timeZone__ : your time zone
 * - __merchantCalculationsUrl__ : if you want to use merchant calculations, specify your callback url here.
 *   Default: `null`
 * - __merchantCalculationsAcceptCoupons__ : if you accept coupons and want to process them in your merchant 
 *   calculations callback, then set this value to `true`. Default: `false`
 * - __merchantCalculationsAcceptGiftCertifications__ : if you accept gift certificats and want to process
 *   them in your merchant calculations callback, then set this value to `true`. Default: `false`
 * - __merchantCalculationsShipping__ : if you want to calculate the shipping rates in your merchant
 *   calculations callback, then set this value to `true`. Default: `false`
 * 
 * Example
 * 
 * ```javascript
 * var gc = new GoogleCheckout({
 * 	merchantNumber : '12345612345',
 * 	merchantKey : '234543254345345',
 * 	currency : 'USD',
 * 	timeZone : 'America/New_York'
 * });
 * ```
 * 
 * @param {Object} settings An object of settings
 * @return {Object} GoogleCheckout An instance of the `GoogleCheckout` constructor function
 * @api public
 * 
 */

function GoogleCheckout(settings) {
	var self = this;
	
	assert.ok(settings.merchantNumber, 'settings.merchantNumber is required');
	assert.ok(settings.merchantKey, 'settings.merchantKey is required');
	assert.ok(settings.currency, 'settings.currency is required');
	
	self.settings = settings;
	
	self.Polling = new Polling(self);
	self.OrderProcessing = new OrderProcessing(self);
	self.OrderReporting = new OrderReporting(self);
	self.MerchantCalculations = new MerchantCalculations(self);
}

/*!
 * The URL to which requests are posted.
 */

GoogleCheckout.ImageUrl = 'https://checkout.google.com/buttons/checkout.gif?merchant_id={merchantNumber}&w=180&h=46&style=trans&variant={variant}&loc=en_US';

/*
 * Create a new instance of `ShoppingCart`
 * 
 * @param {Function} callback
 * @api public
 */

GoogleCheckout.prototype.createCart = function (callback) {
	var self = this;
	
	process.nextTick(function () {
		var newCart = new ShoppingCart(self);
		
		return callback(null, newCart);
	});
};

/*
 * Post `xml` to `url` via an HTTP request.
 * 
 * Before being used, `url` is processed by replacing '{merchantNumber}' 
 * and '{merchantKey}' with `settings.merchantNumber` and 
 * `settings.merchantKey` respectively.
 * 
 * @param {String} url
 * @param {String} xml
 * @param {Function} callback
 * @api public
 */

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

/*
 * Parse a string of XML and convert it to a JavaScript object.
 * 
 * This function processes a string of XML and converts it to
 * a JavaScript object. Google's XML tags consistently replace
 * spaces with '-'. We replace each '-' and the following character
 * with just the capitalized character which follows the '-' by using
 * the `camelCaseObjectKeys()` function.
 * 
 * This gives us consistent camel case objects returned from Google.
 * 
 * @param {String} xml
 * @param {Function} callback
 * @api public
 */

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

/*
 * Retrieve the URL for the GoogleCheckout button image.
 * 
 * @param {String} variant
 * @param {String} merchantNumber
 * @return {String} imageUrl
 * @api public
 */

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
 * Process an object and replace key names with camel cased key names
 * 
 * @param {Object} obj
 * @return {Object}
 * @api private
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
