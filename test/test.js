var assert = require("assert"),
	Entry = require("../lib/entry");

describe('Array', function(){
	describe('.indexOf()', function(){
		it('should equal -1 when the value is not present', function(){
			assert.equal(-1,[1,2,3].indexOf(5));
			assert.equal(-1,[1,2,3].indexOf(0));
 		});
 	});
});

describe('Entry', function(){
	describe('()', function(){
		it('should return json object', function(){
			console.log(Entry);
		})
	});
});
