/* author - Daniel VerWeire <dverweire@gmail.com>
 * 
 * map - execute function fn for each key in obj. Values returned from fn are appended to an array
 * 	which is returned by the map function
 * 
 * @param {Object} obj
 * @param {Function} fn
 * @param {Boolean} squash
 * 
 * obj can be an Array or an object.
 * fn is a callback function which should be used as described below
 * squash determines whether or not to keep falsy returns from fn
 * 
 * When fn is called it is passed the following arguments:
 * 
 * @arg {String} key
 * @arg {Object} value
 * @arg {Function} emit
 * @arg {Function} end
 * 
 * Example:
 * 
 * a = [40,50,2,1];
 * 
 * b = map(a, function (key, val, emit, end) {
 *	//key is the index in the array
 * 
 * 	if (val > 10) {
 *		return val; 
 * 	}
 * });
 * 
 * // b = [40, 50, null, null];
 * 
 * //this time we will sqash falsy values
 * c = map(a, function (key, val, emit, end) {
 *	//key is the index in the array
 * 
 * 	if (val > 10) {
 *		return val; 
 * 	}
 * }, true); //turn on squash
 * 
 * // b = [40, 50]; 
 * 
 */

function map(obj, fn, squash) {
	var a = []
		, key
		, keys
		, x
		, doBreak = false;
	
	if (Array.isArray(obj)) {
		for (key = 0; key < obj.length; key++) {
			doCall(key, obj)
			
			if (doBreak) {
				break;
			}
		}
	}
	else if (obj !== null && typeof(obj) === 'object') {
		keys = Object.keys(obj);
		
		for (x = 0; x < keys.length; x++) {
			doCall(keys[x], obj);
			
			if (doBreak) {
				break;
			}
		}
	}
	else if (typeof(obj) === 'string') {
		for (key in obj) {
			doCall(key, obj);
			
			if (doBreak) {
				break;
			}
		}
	}
	else {
		return [];
	}
	
	return a;
	
	function doCall(key, obj) {
		var t = fn.call(
			  obj[key]
			, key
			, obj[key]
			, emit
			, end
		);
		
		if ((t !== undefined && t !== null && squash) || !squash) {
			a.push(t);
		}
	}
	
	function emit(obj) {
		return a.push(obj)
	}
	
	function end() {
		doBreak = true;
	}
}

module.exports = map;