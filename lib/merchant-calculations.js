/*!
 * Module dependencies.
 */

var utils = require('./utils'), //this module is not publicly available
	assert = require('assert'); 

/*!
 * Export the module 
 */

module.exports = MerchantCalculations;

/**
 * Instantiate an instance of the GoogleCheckout MerchantCalculations prototype
 *
 * Examples:
 *
 * @param {Object} An instance of a GoogleCheckout object
 * @return {Object} Polling Object
 * @api public
 * 
 */

function MerchantCalculations (objGoogleCheckout) {
	var self = this;
	
	//todo: check the constructor name
	assert.ok(objGoogleCheckout, "A GoogleCheckout object is the only required argument");
	
	self.gc = objGoogleCheckout;
	self.settings = self.gc.settings;
};

/*
 * Set the prototype to an instance of an EventEmitter
 */

MerchantCalculations.prototype = new process.EventEmitter;

/*
 
{
	shoppingCart : {
		//google-supplied shopping cart data
	},
	addresses : [
		{
			id : 'google-supplied-id',
			countryCode : 'google-supplied-country-code',
			city : 'google-supplied-city',
			region : 'google-supplied-region',
			postalCode : 'google-supplied-postal-code',
			
			//if callbacks enabled for shipping
			shippingName : 'google-supplied-shipping-name',
			shippingRate : 'REQUIRED',
			shippingCurrency : 'OPTIONAL-OR-USE-DEFAULT',
			shippable : 'REQUIRED',
			
			//if callbacks enabled for tax
			totalTax : 'REQUIRED',
			
			//if callbacks enabled for merchantCodes
			merchantCodes : [
				{
					type : 'REQUIRED (coupon or gift-certificate) ',
					valid : 'REQUIRED (true or false)',
					calculatedAmount : 'REQUIRED',
					message: 'REQUIRED/OPTIONAL - idk'
				}
			]
		}
	]
}
 
 
 
 */

MerchantCalculations.prototype.merchantCalculationCallback = function (xml, callback) {
	var self = this;
	
	self.gc.parseXML(xml, function (err, request) {
		
		//create an object which can be iterated over and have values filled in
		//we can then use that object to prepare the response XML
		var obj = {
			shoppingCart : request.shoppingCart,
			addresses : []
		}
		
		//coerce an array if its not
		if (!Array.isArray(request.calculate.addresses.anonymousAddress)) {
			request.calculate.addresses.anonymousAddress = [request.calculate.addresses.anonymousAddress];
		}
		
		obj.addresses = map(request.calculate.addresses.anonymousAddress, function (_, address) {
			return {
				id : address['@'].id,
				countryCode : address.countryCode,
				city : address.city,
				region : address.region,
				postalCode : address.postalCode
			};
		});
		
		if (request.calculate.shipping) {
			if (!Array.isArray(request.calculate.shipping.method)) {
				request.calculate.shipping.method = [request.calculate.shipping.method];
			}
			
			//add shipping fields to each address
			var newAddresses = [];
			
			//for each address
			map(obj.addresses, function (_, address) {
				//for each shipping type
				map(request.calculate.shipping.method, function (_, shippingMethod) {
					var newAddress = {};
					//copy the object to the newAddress
					map(address, function (key, value ){
						newAddress[key] = value;
					});
					
					newAddress.shippingName = shippingMethod['@'].name;
					newAddress.shippingRate = null; //needs to be filled in
					newAddress.shippable = null; //needs to be filled in.
					
					newAddresses.push(newAddress);
				});
			})
			
			obj.addresses = newAddresses;
		}
		
		if (request.calculate.tax === 'true') {
			//add tax fields to each address
			
			map(obj.addresses, function (_, address) {
				address.totalTax = null;
			});
		}
		
		if (request.calculate.merchantCodeStrings) {
			//add merchant code strings to each addresses
			
			//coerce the merchant codes to an array
			if (!Array.isArray(request.calculate.merchantCodeStrings.merchantCodeString)) {
				request.calculate.merchantCodeStrings.merchantCodeString = [request.calculate.merchantCodeStrings.merchantCodeString];
			}
			
			//for each address
			map(obj.addresses, function (_, address) {
				//for each merchant code
				address.merchantCodes = map(request.calculate.merchantCodeStrings.merchantCodeString, function (_, merchantCode) {
					return {
						type : null, //coupon or gift-certificate
						code : merchantCode['@'].code,
						valid : null,
						calculatedAmount : null,
						message: null
					};
				});
			});
		}
		
		self.emit('merchantCalculationCallback', obj, function (err, data) {
			var doc = { '?xml version="1.0" encoding="UTF-8"?' : null };
			
			doc['merchant-calculation-results'] = {
				'@' : {
					'xmlns' : 'http://checkout.google.com/schema/2'
				},
				'#' : {
					'results' : {
						'result' : map(data.addresses, function (_, address) {
							var resultDoc = {
								'@' : {
									'address-id' : address.id
								},
								'#' : {}
							};
							
							if (address.shippingName) {
								resultDoc['@']['shipping-name'] = address.shippingName;
								resultDoc['#']['shipping-rate'] = {
									'@' : {
										'currency' : address.shippingCurrency || self.settings.currency
									},
									'#' : address.shippingRate
								};
								resultDoc['#']['shippable'] = (address.shippable) ? 'true' : 'false';
							}
							
							//taxTotal may be 0 so we can't check if its falsey. Must
							//check to see if the key exists
							if (address.hasOwnProperty('totalTax')) {
								resultDoc['#']['total-tax'] = {
									'@' : {
										'currency' : address.taxCurrency || self.settings.currency
									},
									'#' : address.totalTax || '0.00'
								}
							}
							
							if (address.merchantCodes) {
								resultDoc['#']['merchant-code-results'] = {
									'coupon-result' : map(address.merchantCodes, function (_, merchantCode) {
											if (merchantCode.type = 'coupon') {
												return {
													'valid' : (merchantCode.valid) ? 'true' : 'false',
													'code' : merchantCode.code,
													'calculated-amount' : merchantCode.calculatedAmount,
													'message' : merchantCode.message
												};
											}
										}, true
									),
									'gift-certificate-result' : map(address.merchantCodes, function (_, merchantCode) {
											if (merchantCode.type = 'gift-certificate') {
												return {
													'valid' : (merchantCode.valid) ? 'true' : 'false',
													'code' : merchantCode.code,
													'calculated-amount' : merchantCode.calculatedAmount,
													'message' : merchantCode.message
												};
											}
										}, true
									)
								}
							}
							
							return resultDoc;
						})
					}
				}
			};
			
			//convert doc to xml and callback
			
			var xml = utils.objectToXML(doc);
			
			return callback(null, xml);
		});
	});
};