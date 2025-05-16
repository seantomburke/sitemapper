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

  // Plugins configuration
  const plugins = [];

  // Enable istanbul plugin for test environment
  if (process.env.NODE_ENV === 'test') {
    plugins.push('istanbul');
  }

  return {
    presets,
    plugins,
    comments: false, // Remove comments during minification
  };
};
