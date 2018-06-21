const doNotIgnoreThesePackages = [
  'api',
  'shared',
  'tipsi-router',
].join('|')

module.exports = {
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__tests__/setup/fileTransformer.js',
  },
  testRegex: 'src/.*/.*.test.js$',
  setupFiles: ['./__tests__/setup/enzymeConfig.js'],
  transformIgnorePatterns: [
    `node_modules/(?!(${doNotIgnoreThesePackages})/)`,
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
