var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.Polling.on('continueToken', function (continueToken) {
	//Save this token to persistant storage in case this process crashes
	//or is intentionally ended
	console.log('Polling: ContinueToken Received: %s', continueToken);
});

gc.Polling.on('notificationDataTokenResponse', function (resp) {
	console.log('Polling: notificationDataTokenResponse Received');
});

gc.Polling.on('notificationDataResponse', function (resp) {
	console.log('Polling: notificationDataResponse Received');
});

gc.Polling.run();

