// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'], // ✅ obligatoire pour Angular
     files: [
      { pattern: './src/test-setup.ts', watched: false } 
    ],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma') // ✅ important !
    ],
    client: {
      jasmine: {},
      clearContext: false // ✅ pour garder les résultats visibles dans le navigateur
    },
    jasmineHtmlReporter: {
      suppressAll: true, // ✅ enlève les messages redondants
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/angularfrontadaction'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'], // ✅ Headless Chrome (pas besoin d’ouvrir le navigateur)
    singleRun: false,
    restartOnFileChange: true
  });
};
