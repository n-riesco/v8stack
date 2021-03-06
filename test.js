var v8stack = require("./index.js");

var assert = require("assert");

var error;
var stack;
var prepareStackTrace = Error.prepareStackTrace;
var stackTraceLimit = 5;

v8stack.enable();
Error.stackTraceLimit = stackTraceLimit;
error = new Error();
stack = v8stack.evaluate(error);
v8stack.disable();

assert.strictEqual(
    v8stack.evaluate(error).length, stackTraceLimit,
    "Error.stackTraceLimit not honoured"
);
assert.deepEqual(
    Error.prepareStackTrace, prepareStackTrace,
    "Error.prepareStackTrace not restored"
);

v8stack.enable();
prepareStackTrace = function() {
    return "test";
};
Error.prepareStackTrace = prepareStackTrace;
error = new Error();
stack = v8stack.evaluate(error);
v8stack.disable();

assert.deepEqual(
    Error.prepareStackTrace, prepareStackTrace,
    "Error.prepareStackTrace honoured but not restored"
);
assert.strictEqual(
    v8stack.evaluate(error).length, stackTraceLimit,
    "Error.stackTraceLimit not honoured"
);
assert.strictEqual(
    error.stack, "test",
    "Error.prepareStackTrace not honoured"
);
