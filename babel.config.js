module.exports = (api) => {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        "targets": {
          "esmodules": true
        }
      }
    ],
    'minify',
  ];
  const plugins = [[ {} ]];

  return {
    presets,
    plugins,
    comments: false,
  };
};
