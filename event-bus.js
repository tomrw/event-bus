function EventBus() {
	this._listeners = {};
}

var EventBusPrototype = EventBus.prototype;

EventBusPrototype.on = function(event, callback) {
	if (!this._listeners[event]) {
		this._listeners[event] = [];
	}
	this._listeners[event].push(callback);
	return this;
};

EventBusPrototype.off = function(event, callback) {
	var listeners = this._listeners[event];
	if (listeners) {
		if (callback) {
			for (var i = listeners.length - 1; i >= 0; --i) {
				var listener = listeners[i];
				if (listener === callback) {
					listeners[i] = null;
				}
			}
			this._compactEvent(event);
		}
		else {
			delete this._listeners[event];
		}
	}
	return this;
};

EventBusPrototype.once = function(event, callback) {
	var self = this;
	this.on(event, callback);
	this.on(event, onceCallback);

	function onceCallback() {
		self.off(event, callback);
		self.off(event, onceCallback);
	}
};

EventBusPrototype.trigger = function(event) {
	var listeners = this._listeners[event] || [];
	var args = Array.prototype.slice.call(arguments, 1);
	for (var i = 0, l = listeners.length; i < l; ++i) {
		if (listeners[i]) {
			listeners[i].apply(null, args);
		}
	}
};

EventBusPrototype.listeners = function(event) {
	if (event) {
		return this._listeners[event];
	}
	return this._listeners;
};

EventBusPrototype.clearAll = function() {
	var listeners = this._listeners;
	for (var listener in listeners) {
		this.off(listener);
	}
};

EventBusPrototype._compactEvent = function(event) {
	if (this._listeners[event]) {
		this._listeners[event] = this._compact(this._listeners[event]);
		if (!this._listeners[event].length) {
			delete this._listeners[event];
		}
	}
};

EventBusPrototype._compact = function(arr) {
	if (Array.prototype.filter) {
		return arr.filter(function(obj) { return obj; });
	}
	var compactedArray = [];
	for (var i = 0, l = arr.length; i < l; ++i) {
		if (arr[i]) {
			compactedArray.push(arr[i]);
		}
	}
	return compactedArray;
};
