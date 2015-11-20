/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2015, Nicolas Riesco
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @module v8stack
 *
 * @description Module `v8stack` enables access to V8's error stack traces.
 */
module.exports = {
    enable: hijackPrepareStackTrace,
    disable: releasePrepareStackFrame,
    get: getV8Stack,
};

var prepareStackTrace;

/**
 * Enable the capture of V8's error stack traces.
 */
function hijackPrepareStackTrace() {
    if (Error.prepareStackTrace !== _prepareStackTrace) {
        prepareStackTrace = Error.prepareStackTrace;
    }

    delete Error.prepareStackTrace;

    Object.defineProperty(Error, "prepareStackTrace", {
        get: function() {
            return _prepareStackTrace;
        },
        set: function(value) {
            prepareStackTrace = value;
        },
        configurable: true,
        enumerable: false,
    });
}

/**
 * Disable the capture of V8's error stack traces.
 */
function releasePrepareStackFrame() {
    delete Error.prepareStackTrace;
    if (prepareStackTrace) {
        Error.prepareStackTrace = prepareStackTrace;
    }
}

/**
 * Function that hijacks calls to `Error.prepareStackTrace()` and sets the
 * `__v8stack__` property in error objects.
 *
 * @param {Error}      error        Error object to store the stack trace
 * @param {CallSite[]} v8StackTrace [V8's stack trace]{@link
 *                            https://github.com/v8/v8/wiki/Stack%20Trace%20API}
 */
function _prepareStackTrace(error, v8StackTrace) {
    var stack;

    if (error) {
        error.__v8stack__ = v8StackTrace;
    }

    releasePrepareStackFrame();
    stack = error.stack;
    hijackPrepareStackTrace();

    return stack;
}

/**
 * Returns V8's stack trace of an error object
 *
 * @param   {Error}      error Error object
 * @returns {CallSite[]} [V8's stack trace]{@link
 *                       https://github.com/v8/v8/wiki/Stack%20Trace%20API}
 */
function getV8Stack(error) {
    if (error) {
        // Trigger the call to `Error.prepareStackTrace()` (lazy evaluation)
        error.stack; // jshint ignore:line

        return error.__v8stack__;
    }

    return;
}
