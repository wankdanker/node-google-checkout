var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.Polling.notificationDataTokenRequest("3/1/2012", function (err, continueToken) {
	if (continueToken) {
		gc.Polling.notificationDataRequest(continueToken, function (err, result) {
			console.log(JSON.stringify(result));
		});
	}
	else {
		console.log(err);
		process.exit(1);
	}
})
