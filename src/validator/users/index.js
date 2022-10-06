const {UserPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UsersValidator = {
  validateUserPayload: (payload) =>{
    const res = UserPayloadSchema.validate(payload);
    if (res.error) {
      throw new InvariantError(res.error.message);
    }
  },
};

module.exports = UsersValidator;
