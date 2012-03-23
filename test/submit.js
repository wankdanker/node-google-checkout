var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.CheckOut.addItem(common.items[0]);
gc.CheckOut.addItem(common.items[1]);
gc.CheckOut.addShipMethod(common.shipMethods[0]);
gc.CheckOut.addShipMethod(common.shipMethods[1]);

gc.CheckOut.postCart(function (err, data) {
	console.log(arguments);
});