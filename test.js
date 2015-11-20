var v8stack = require("./index.js");

var assert = require("assert");

var error;
var prepareStackTrace = Error.prepareStackTrace;
var stackTraceLimit = 5;

v8stack.enable();
Error.stackTraceLimit = stackTraceLimit;
error = new Error();
assert.strictEqual(
    v8stack.get(error).length, stackTraceLimit,
    "Error.stackTraceLimit not honoured"
);
v8stack.disable();
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
assert.strictEqual(
    v8stack.get(error).length, stackTraceLimit,
    "Error.stackTraceLimit not honoured"
);
assert.strictEqual(
    error.stack, "test",
    "Error.prepareStackTrace not honoured"
);
v8stack.disable();
assert.deepEqual(
    Error.prepareStackTrace, prepareStackTrace,
    "Error.prepareStackTrace honoured but not restored"
);
