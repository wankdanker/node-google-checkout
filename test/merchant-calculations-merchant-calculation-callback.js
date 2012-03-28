var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common'),
	path = require('path'),
	fs = require('fs');

var gc = new GoogleCheckout(common.settings);

gc.MerchantCalculations.on('merchantCalculationCallback', function (obj, callback) {
	obj.addresses.forEach(function (address) {
		if (address.shippingName) {
			//TODO look up the rate information for the address for shippingName shipping
			
			address.shippingRate = 14.50;
			address.shippable = true;
		}
		
		if (address.taxTotal) {
			//look up the tax rate for the address and then calculate a total
			address.taxTotal = 4.50;
		}
		
		if (address.merchantCodes) {
			//loop through each merchant code and validate it for this address
			addresss.merchantCodes.forEach(function (merchantCode) {
				//look up merchantCode.code somewhere
				
				//if you are using this as an example, you would need to do your
				//own magic to determine if the code is a gift-certificate or
				//a coupon. 
				if (/GiftCert/.test(merchant.code) {
					merchantCode.type = 'gift-certificate';
				}
				else {
					merchantCode.type = 'coupon';
				}
				
				merchantCode.valid = true;
				merchantCode.calculatedAmount = 5.00;
				merchantCode.message = 'You saved $5.00, good for you!!';
			});
		}
	});
	
	return callback(null, obj);
});


fs.readFile(path.join(__dirname, 'data', 'merchant-calculation-callback') + '.xml', 'utf8', function (err, data) {
	gc.MerchantCalculations.merchantCalculationCallback(data, function (err, responseXML) {
		console.log(responseXML);
	});
});