##Contributing

The files to modify are under the `src` folder. `src/assets` are JavaScript files written in es6 that get compiled
through babel into `lib/sitemapper.js`.

###Build

To build the `lib` directory with the compiled assets use this command
```bash
npm run build
```
This uses Broccoli.js to compile the files.

```bash
# Run examples/index.js
npm start
```

###Testing

Make sure all tests pass using
```bash
npm test
```
This will run [Mocha](https://mochajs.org/) for testing and [ESLint](http://eslint.org/) for styleguides
The tests run will be `mocha` and `eslint`.
Make sure your style follows the style guide in .eslintrc

###Style Guide

To see if your code passes the linter use
```bash
npm run lint
```

###Pull Requests

Pull requests will use [TravisCI](https://travis-ci.com/) to run your code.
If you would like to be an owner of this repository to approve pull requests, create an issue that I will review.

###Structure

```
lib/
  example/
    index.js
  sitemapper.js
  test.js
src/
  assets/
    sitemapper.js
  examples/
    index.js
  tests/
    test.js
````
