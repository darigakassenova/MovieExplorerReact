module.exports = {
    transform: {
      '^.+\\.[tj]sx?$': 'babel-jest', // Use Babel for JavaScript and TypeScript files
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(axios)/)', // Transform ES modules inside `axios`
    ],
  };
  