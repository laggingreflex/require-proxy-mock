const crypto = require('crypto');

module.exports = () => new Promise(r => crypto.randomBytes(128, r));
