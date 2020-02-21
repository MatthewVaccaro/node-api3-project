module.exports = () => {
  return (req, res, next) => {
    const { method, url } = req;
    const date = Date.now();

    console.log(`${method} ${url} ${date}`);

    next();
  };
};
