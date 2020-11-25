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
    ]
  ];
  const plugins = [[ {} ]];

  return {
    presets,
    plugins,
  };
};
