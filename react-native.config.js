// react-native.config.js
module.exports = {
  dependencies: {
    '<dependency>': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink
      },
    },
  },
};
