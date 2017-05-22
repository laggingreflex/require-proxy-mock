const mocks = require('..');

module.exports = function getMock({ request, filename, original, originalError }) {
  let mock;
  mock = mocks[request];
  if (typeof mock !== 'undefined') {
    return mock;
  }
  for (const req in mocks) {
    let regex;
    const parseRegex = req.match(/^\/(.*)\/(.*)$/);
    if (parseRegex) {
      regex = new RegExp(parseRegex[1], parseRegex[2]);
    } else {
      regex = new RegExp(req);
    }
    mock = mocks[req];
    if (request.match(regex)) {
      return mock;
    }
  }
  if (originalError) {
    throw originalError;
  } else {
    return original;
  }
};
