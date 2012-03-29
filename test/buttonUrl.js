var GoogleCheckout = require('../'),
	common = require('./common');

var gc = new GoogleCheckout(common.settings);

console.log(gc.getButtonUrl());
console.log(gc.getButtonUrl('text'));
console.log(gc.getButtonUrl('disabled'));
