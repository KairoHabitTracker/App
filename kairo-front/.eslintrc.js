module.exports = {
  root: true,
  extends: [
    'expo', // używamy reguł Expo zamiast @react-native
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};
