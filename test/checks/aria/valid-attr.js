describe('aria-valid-attr', function() {
	'use strict';

	var fixture = document.getElementById('fixture');
	var checkContext = axe.testUtils.MockCheckContext();

	afterEach(function() {
		fixture.innerHTML = '';
		checkContext.reset();
	});

	it('should return false if any invalid ARIA attributes are found', function() {
		var node = document.createElement('div');
		node.id = 'test';
		node.tabIndex = 1;
		node.setAttribute('aria-cats', 'true');
		node.setAttribute('aria-dogs', 'true');
		fixture.appendChild(node);

		assert.isFalse(checks['aria-valid-attr'].evaluate.call(checkContext, node));
		assert.deepEqual(checkContext._data, ['aria-cats', 'aria-dogs']);
	});

	it('should return true if no invalid ARIA attributes are found', function() {
		var node = document.createElement('div');
		node.id = 'test';
		node.tabIndex = 1;
		node.setAttribute('aria-selected', 'true');
		fixture.appendChild(node);

		assert.isTrue(checks['aria-valid-attr'].evaluate.call(checkContext, node));
		assert.isNull(checkContext._data);
	});

	it('should determine attribute validity by calling axe.commons.aria.validateAttr', function() {
		var node = document.createElement('div');
		node.id = 'test';
		node.tabIndex = 1;
		node.setAttribute('aria-cats', 'true');
		node.setAttribute('aria-dogs', 'true');
		fixture.appendChild(node);

		var orig = axe.commons.aria.validateAttr;
		var called = 0;
		axe.commons.aria.validateAttr = function(attrName) {
			assert.match(attrName, /^aria-/);
			called++;
			return true;
		};
		assert.isTrue(checks['aria-valid-attr'].evaluate.call(checkContext, node));
		assert.isNull(checkContext._data);
		assert.equal(called, 2);

		axe.commons.aria.validateAttr = orig;
	});

	it('should return true for unsupported ARIA attributes', function() {
		axe.commons.aria.lookupTable.attributes['aria-mccheddarton'] = {
			unsupported: true
		};

		var node = document.createElement('div');
		node.id = 'test';
		node.tabIndex = 1;
		node.setAttribute('aria-mccheddarton', 'true');
		fixture.appendChild(node);

		assert.isTrue(checks['aria-valid-attr'].evaluate.call(checkContext, node));
		assert.isNull(checkContext._data);
	});

	describe('options', function() {
		it('should exclude provided attribute names', function() {
			fixture.innerHTML =
				'<div id="target" aria-bats="cats" aria-puppies="2"></div>';
			var target = fixture.children[0];
			assert.isTrue(
				checks['aria-valid-attr'].evaluate.call(checkContext, target, [
					'aria-bats',
					'aria-puppies'
				])
			);
		});
	});
});
