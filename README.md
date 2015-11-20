`v8stack` is an [npm package](https://www.npmjs.com/) for accessing [V8's error
stack traces](https://github.com/v8/v8/wiki/Stack%20Trace%20API).

# Installation

```
npm install v8stack
```

# Usage

```javascript
// Import the `v8stack` package
var v8stack = require("v8stack");

// Enable the capture of V8's stack traces
v8stack.enable();

// Access V8's stack trace of an error object
var error = new Error();
var errorStack = v8stack.get(error);
console.log(errorStack[0].getTypeName());

// If wanted, the capture can be stopped
v8stack.disable();

// Calls to `v8stack.get()` with errors created while the capture is disabled
// will return `undefined`.
```