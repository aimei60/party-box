//needed for jest to work in node

export default {
  testEnvironment: "node",//jest to work in node and not on browser
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],//runs setup file before all tests
  transform: {},// enables node to handle import and export
  maxWorkers: 1,//runs tests one at a time not in parallel
};