module.exports = {
  collectCoverage: true,
  // What a site runs: the Nuxt module and the components. The scripts are
  // repository tooling and are tested by running them, in child processes.
  collectCoverageFrom: ['module.js', 'components/**/*.vue'],
  coverageDirectory: './coverage/',
  // cobertura feeds the merge request's coverage view, text the regex the
  // pipeline reads, lcov a local report.
  coverageReporters: ['cobertura', 'lcov', 'text', 'text-summary'],
  // A floor, not a target: the measured baseline of the current tests, rounded
  // down. Raise it as coverage genuinely improves, and never lower it to make
  // a merge request pass.
  //
  // Branches sits lowest because @vue/vue2-jest adds an interop branch to
  // every compiled component that no test can take: a component with no
  // logic of its own reports one branch of two. Measured, not guessed: run
  // `npm test` and read the table before changing these.
  coverageThreshold: {
    global: {
      statements: 99,
      branches: 78,
      functions: 100,
      lines: 100,
    },
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest',
  },
}
