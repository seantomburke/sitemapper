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
    'minify', // minify the Babel code
  ];
  const plugins = [
    ['add-module-exports']
  ];

  return {
    presets,
    plugins,
    comments: false, // Remove comments during minification
  };
};
