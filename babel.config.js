export default (api) => {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
        modules: false, // Output ES modules
      },
    ],
    'minify', // minify the Babel code
  ];

  // Remove the add-module-exports plugin for ESM output
  const plugins = [];

  return {
    presets,
    plugins,
    comments: false, // Remove comments during minification
  };
};
