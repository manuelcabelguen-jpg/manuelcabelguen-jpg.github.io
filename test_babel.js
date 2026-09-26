const fs = require('fs');
const babel = require('@babel/core');

const code = fs.readFileSync('App_Expo.js', 'utf-8');
try {
  babel.transformSync(code, {
    presets: ['@babel/preset-react'],
    filename: 'App_Expo.js'
  });
  console.log("Syntax is valid JSX");
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
