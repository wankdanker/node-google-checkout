var GoogleCheckout = require('../').GoogleCheckout,
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

gc.CheckOut.addItem(common.items[0]);
gc.CheckOut.addItem(common.items[1]);
gc.CheckOut.addShipMethod(common.shipMethods[0]);
gc.CheckOut.addShipMethod(common.shipMethods[1]);

console.log(gc.CheckOut.getCartXML())