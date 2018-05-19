const handleFunction = require('./function');
const handleObject = require('./object');

module.exports = function handleUndefined(opts) {

  // throw opts.originalError || new Error('some')

  // return opts.original;

  // return handleFunction(Object.assign({}, opts, { original: function(){} }));
  return handleObject(Object.assign({}, opts, { original: {} }));

}
