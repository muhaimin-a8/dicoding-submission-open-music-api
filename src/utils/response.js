const response = {
  send: (
      h,
      {message, data, statusCode = 200},
      header = null,
  ) =>{
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

    if (header != null) {
      res.header(header.name, header.value);
    }
    return res;
  },
};

module.exports = response;
