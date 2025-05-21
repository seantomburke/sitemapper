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

  // Add the istanbul plugin for coverage instrumentation in test environment
  const plugins = [];
  if (process.env.NODE_ENV === 'test') {
    plugins.push('babel-plugin-istanbul');
  }

  return {
    presets,
    plugins,
    comments: false, // Remove comments during minification
  };
};
