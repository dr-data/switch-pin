exports.response = function (res, json) {
  res.json(json).status(200).end();
};

exports.failure = function (res, error) {
  console.log(error.message);
  res.status(error.code).end();
};
