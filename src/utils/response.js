const response = {
  send: (h, {message, data, statusCode = 200}) =>{
    const resObj = {
      status: 'success',
      message: message,
      data: data,
    };

    if (message === null) {
      delete resObj['message'];
    }

    if (data === null) {
      delete resObj['data'];
    }

    const res = h.response(resObj);
    res.code(statusCode);

    return res;
  },
};

module.exports = response;
