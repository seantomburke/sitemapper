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

  return {
    presets,
    comments: false, // Remove comments during minification
  };
};
