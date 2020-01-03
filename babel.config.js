module.exports = (api) => {
  api.cache(true);

  const presets = ['@babel/preset-env'];
  const plugins = ['add-module-exports'];

  return {
    presets,
    plugins,
  };
};
