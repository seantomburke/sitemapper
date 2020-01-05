module.exports = (api) => {
  api.cache(true);

  const presets = ['@babel/preset-env'];
  const plugins = ['add-module-exports', '@babel/plugin-proposal-object-rest-spread'];

  return {
    presets,
    plugins,
  };
};
