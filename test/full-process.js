var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common')
	fs = require('fs');

var gc = new GoogleCheckout(common.settings);

gc.Polling.on('continueToken', function (continueToken) {
	//Save this token to persistant storage in case this process crashes
	//or is intentionally ended
	console.log('Polling: ContinueToken Received: %s', continueToken);
	fs.writeFile(common.continueTokenFile, continueToken, 'utf8');
});

// //this is a raw packet event
// gc.Polling.on('notificationDataTokenResponse', function (resp) {
// 	console.log('Polling: notificationDataTokenResponse Received');
// });

// //this is a raw packet event
// gc.Polling.on('notificationDataResponse', function (resp) {
// 	console.log('Polling: notificationDataResponse Received');
// 	console.log(resp);
// });

// 'newOrderNotification'
// 	, 'authorizationAmountNotification'
// 	, 'riskInformationNotification'
// 	, 'orderStateChangeNotification'
// 	, 'chargeAmountNotification'
// 	, 'refundAmountNotification'
// 	, 'chargebackAmountNotification'

gc.Polling.on('newOrderNotification', function (notification) {
	console.log('Polling: newOrderNotification Received');
	console.log(notification);
});

gc.Polling.on('authorizationAmountNotification', function (notification) {
	console.log('Polling: authorizationAmountNotification Received');
	console.log(notification);
});


gc.Polling.on('riskInformationNotification', function (notification) {
	console.log('Polling: riskInformationNotification Received');
	console.log(notification);
});

gc.Polling.on('orderStateChangeNotification', function (notification) {
	console.log('Polling: orderStateChangeNotification Received');
	console.log(notification);
});

gc.Polling.on('chargeAmountNotification', function (notification) {
	console.log('Polling: chargeAmountNotification Received');
	console.log(notification);
});

gc.Polling.on('refundAmountNotification', function (notification) {
	console.log('Polling: refundAmountNotification Received');
	console.log(notification);
});

gc.Polling.on('chargebackAmountNotification', function (notification) {
	console.log('Polling: chargebackAmountNotification Received');
	console.log(notification);
});

fs.readFile(common.continueTokenFile, 'utf8', function (err, data) {
	var continueToken = null;
	
	if (!err) {
		console.log('Got continueToken from %s : %s', common.continueTokenFile, data);
		continueToken = data;
	}
	else {
		console.log(err);
	}
	
	//if continueToken is null at this point, the API will get a new one.
	gc.Polling.run(continueToken);
});


/*
 * Create an order and post the cart to Google.
 * We will then have a checkoutURL
 */

gc.CheckOut.addItem(common.items[0]);
gc.CheckOut.addItem(common.items[1]);
gc.CheckOut.addShipMethod(common.shipMethods[0]);
gc.CheckOut.addShipMethod(common.shipMethods[1]);

gc.CheckOut.postCart(function (err, checkoutURL) {
	console.log('You must now open your browser and check out at: %s', checkoutURL);
});