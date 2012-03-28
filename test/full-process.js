var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common'),
	readJSON = require('./readJSON'),
	writeJSON = require('./writeJSON'),
	path = require('path');

var gc = new GoogleCheckout(common.settings);

gc.Polling.on('continueToken', function (continueToken) {
	//Save this token to persistant storage in case this process crashes
	//or is intentionally ended
	console.log('Polling: ContinueToken Received: %s', continueToken);
	
	writeJSON(common.continueTokenFile, continueToken);
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
	
	var filePath = path.join(common.orderPath, notification.googleOrderNumber) + '.json';
	
	readJSON(filePath, function (err, order) {
		if (err) {
			order = {};
		}
		
		writeJSON(filePath, notification);
	});
});

gc.Polling.on('authorizationAmountNotification', function (notification) {
	console.log('Polling: authorizationAmountNotification Received');
	console.log(notification);
	
	var filePath = path.join(common.orderPath, notification.googleOrderNumber) + '.json';
	
	readJSON(filePath, function (err, order) {
		if (err) {
			order = {};
		}
		
		order.authorizationAmountNotification = order.authorizationAmountNotification || [];
		
		order.authorizationAmountNotification.push(notification);
		
		writeJSON(filePath, order);
	});
});


gc.Polling.on('riskInformationNotification', function (notification) {
	console.log('Polling: riskInformationNotification Received');
	console.log(notification);
	
	var filePath = path.join(common.orderPath, notification.googleOrderNumber) + '.json';
	
	readJSON(filePath, function (err, order) {
		if (err) {
			order = {};
		}
		
		order.riskInformationNotification = order.riskInformationNotification || [];
		
		order.riskInformationNotification.push(notification);
		
		writeJSON(filePath, order);
	});
});

gc.Polling.on('orderStateChangeNotification', function (notification) {
	console.log('Polling: orderStateChangeNotification Received');
	console.log(notification);
	
	var filePath = path.join(common.orderPath, notification.googleOrderNumber) + '.json';
	
	readJSON(filePath, function (err, order) {
		if (err) {
			order = {};
		}
		
		order.orderStateChangeNotification = order.orderStateChangeNotification || [];
		
		order.orderStateChangeNotification.push(notification);
		
		writeJSON(filePath, order);
	});
});

gc.Polling.on('chargeAmountNotification', function (notification) {
	console.log('Polling: chargeAmountNotification Received');
	console.log(notification);
	
	var filePath = path.join(common.orderPath, notification.googleOrderNumber) + '.json';
	
	readJSON(filePath, function (err, order) {
		if (err) {
			order = {};
		}
		
		order.chargeAmountNotification = order.chargeAmountNotification || [];
		
		order.chargeAmountNotification.push(notification);
		
		writeJSON(filePath, order);
	});
});

gc.Polling.on('refundAmountNotification', function (notification) {
	console.log('Polling: refundAmountNotification Received');
	console.log(notification);
	
	var filePath = path.join(common.orderPath, notification.googleOrderNumber) + '.json';
	
	readJSON(filePath, function (err, order) {
		if (err) {
			order = {};
		}
		
		order.refundAmountNotification = order.refundAmountNotification || [];
		
		order.refundAmountNotification.push(notification);
		
		writeJSON(filePath, order);
	});
});

gc.Polling.on('chargebackAmountNotification', function (notification) {
	console.log('Polling: chargebackAmountNotification Received');
	console.log(notification);
	
	var filePath = path.join(common.orderPath, notification.googleOrderNumber) + '.json';
	
	readJSON(filePath, function (err, order) {
		if (err) {
			order = {};
		}
		
		order.chargebackAmountNotification = order.chargebackAmountNotification || [];
		
		order.chargebackAmountNotification.push(notification);
		
		writeJSON(filePath, order);
	});
});

readJSON(common.continueTokenFile, function (err, data) {
	var continueToken = null;
	
	if (!err) {
		console.log('Got continueToken from %s : %s', common.continueTokenFile, data);
		continueToken = data;
	}
	else {
		//console.log(err);
		console.log('%s does not exist', common.continueTokenFile);
	}
	
	//if continueToken is null at this point, the API will get a new one.
	gc.Polling.run(continueToken);
});


/*
 * Create an order and post the cart to Google.
 * We will then have a checkoutURL
 */

// gc.CheckOut.addItem(common.items[0]);
// gc.CheckOut.addItem(common.items[1]);
// gc.CheckOut.addShipMethod(common.shipMethods[0]);
// gc.CheckOut.addShipMethod(common.shipMethods[1]);
// 
// gc.CheckOut.postCart(function (err, checkoutURL) {
// 	console.log('You must now open your browser and check out at: %s', checkoutURL);
// });