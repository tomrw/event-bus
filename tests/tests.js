QUnit.module('EventBus', {
	setup: function() {
		this.eventBus = new EventBus();
	}
});

QUnit.test('should start with an empty list of events', function() {
	ok(Object.keys(this.eventBus._listeners).length == 0);
});

QUnit.test('should be able to add a listener', function() {
	equal(typeof this.eventBus.on, 'function');
	var spy = this.spy();
	this.eventBus.on('event-name', spy);
	deepEqual(this.eventBus._listeners, {
		'event-name': [spy]
	});
});

QUnit.test('should be able to add multiple listeners', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name-2', spy2);
	deepEqual(this.eventBus._listeners, {
		'event-name': [spy],
		'event-name-2': [spy2]
	});
});

QUnit.test('should be able to add multiple callbacks to the same event', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	var spy3 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name', spy2);
	this.eventBus.on('event-name', spy3);
	deepEqual(this.eventBus._listeners, {
		'event-name': [spy, spy2, spy3]
	});
});

QUnit.test('should be able to trigger an event', function() {
	equal(typeof this.eventBus.trigger, 'function');
	var spy = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.trigger('event-name');
	ok(spy.calledOnce);
});

QUnit.test('should be able to trigger an event with arguments', function() {
	var spy = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.trigger('event-name', 'arg1', 'arg2', [1, 5]);
	ok(spy.calledOnce);
	ok(spy.calledWith('arg1', 'arg2', [1, 5]));
});

QUnit.test('should be able to trigger multiple callbacks for one event', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name', spy2);
	this.eventBus.trigger('event-name', '10');
	ok(spy.calledOnce);
	ok(spy.calledWith('10'));
	ok(spy2.calledOnce);
	ok(spy2.calledWith('10'));
});

QUnit.test('should trigger events in the correct order', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	var spy3 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name', spy2);
	this.eventBus.on('event-name', spy3);
	this.eventBus.trigger('event-name');
	sinon.assert.callOrder(spy, spy2, spy3);
});

QUnit.test('should be able to unbind an event', function() {
	equal(typeof this.eventBus.off, 'function');
	var spy = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.off('event-name', spy);
	this.eventBus.trigger('event-name');
	ok(spy.notCalled);
});

QUnit.test('should be able to unbind all the callbacks for an event', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name', spy2);
	this.eventBus.off('event-name');
	this.eventBus.trigger('event-name');
	ok(spy.notCalled);
	ok(spy2.notCalled);
});

QUnit.test('should clear up it\'s internal listeners if no callbacks exist for an event', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	var spy3 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name', spy2);
	this.eventBus.on('event-name-2', spy3);
	this.eventBus.off('event-name', spy);
	deepEqual(this.eventBus._listeners, {
		'event-name': [spy2],
		'event-name-2': [spy3]
	});
	this.eventBus.off('event-name', spy2);
	deepEqual(this.eventBus._listeners, {
		'event-name-2': [spy3]
	});
	this.eventBus.off('event-name-2', spy3);
	deepEqual(this.eventBus._listeners, {});
});

QUnit.test('should be able to bind to an event once', function() {
	equal(typeof this.eventBus.once, 'function');
	var spy = this.spy();
	this.eventBus.once('event-name', spy);
	this.eventBus.trigger('event-name');
	ok(spy.calledOnce);
	this.eventBus.trigger('event-name');
	ok(spy.calledOnce);
	equal(this.eventBus._listeners['event-name'], undefined);
});

QUnit.test('should be able to bind to an event once and trigger it with args', function() {
	var spy = this.spy();
	this.eventBus.once('event-name', spy);
	this.eventBus.trigger('event-name', 1, 2, 3, '4');
	ok(spy.calledWith(1, 2, 3, '4'));
});

QUnit.test('should be able to retrieve a list of all the events/listeners', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	var spy3 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name', spy2);
	this.eventBus.on('event-name-2', spy3);
	deepEqual(this.eventBus.listeners(), {
		'event-name': [spy, spy2],
		'event-name-2': [spy3]
	});
});

QUnit.test('should be able to retrieve a list of all listeners for an event', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	var spy3 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name', spy2);
	this.eventBus.on('event-name-2', spy3);
	deepEqual(this.eventBus.listeners('event-name'), [spy, spy2]);
	deepEqual(this.eventBus.listeners('event-name-2'), [spy3]);
});

QUnit.test('should not return anything if there are no listeners for an event', function() {
	var spy = this.spy();
	this.eventBus.on('event-name', spy);
	equal(this.eventBus.listeners('fake-event'), undefined);
});

QUnit.test('should be able to chain "on" calls together', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	var spy3 = this.spy();
	this.eventBus.on('event-name', spy)
		.on('event-name', spy2)
		.on('event-name-2', spy3);
	deepEqual(this.eventBus.listeners(), {
		'event-name': [spy, spy2],
		'event-name-2': [spy3]
	});
});

QUnit.test('should be able to chain "off" calls together', function() {
	var spy = this.spy();
	var spy2 = this.spy();
	var spy3 = this.spy();
	this.eventBus.on('event-name', spy)
		.on('event-name', spy2)
		.on('event-name-2', spy3);
	this.eventBus.off('event-name', spy)
		.off('event-name', spy2)
		.off('event-name-2', spy3);
	deepEqual(this.eventBus.listeners(), {});
});

QUnit.test('should be able to clear up all events and listeners', function() {
	equal(typeof this.eventBus.clearAll, 'function');
	var spy = this.spy();
	var spy2 = this.spy();
	var spy3 = this.spy();
	this.eventBus.on('event-name', spy);
	this.eventBus.on('event-name', spy2);
	this.eventBus.on('event-name-2', spy3);
	this.eventBus.clearAll();
	this.eventBus.trigger('event-name');
	this.eventBus.trigger('event-name-2');
	ok(spy.notCalled);
	ok(spy2.notCalled);
	ok(spy3.notCalled);
	deepEqual(this.eventBus.listeners(), {});
});

QUnit.test('should be able to call all listeners with a combination of on/once events', function() {
	var onSpy = this.spy();
	var onceSpy = this.spy();
	var onceSpy2 = this.spy();
	this.eventBus.on('event-name', onSpy);
	this.eventBus.once('event-name', onceSpy);
	this.eventBus.once('event-name', onceSpy2);
	this.eventBus.trigger('event-name');
	ok(onSpy.calledOnce);
	ok(onceSpy.calledOnce);
	ok(onceSpy2.calledOnce);
	this.eventBus.trigger('event-name');
	ok(onSpy.calledTwice);
	ok(onceSpy.calledOnce);
	ok(onceSpy2.calledOnce);
});
