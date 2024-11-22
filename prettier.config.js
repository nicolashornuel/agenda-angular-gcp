  
  module.exports = {
    printWidth: 120,           // Keep 80 column sized code
    tabWidth: 2,              // Tabs have a 2-characters width
    useTabs: false,           // The tabs uses spaces, not tab character
    semi: true,               // Mandatory semicolumn
    singleQuote: true,        // Cannot use double quote in TS
    quoteProps: "as-needed",  // Use quote props only when needed (e.g.: myObject['test-property'])
    trailingComma: "none",    // Don't add a trailing comma at the end of multiline arrays
    bracketSpacing: true,    // Don't add space between brackets (e.g.: import { Object } => import {Object})
    arrowParens: "avoid",     // Avoid parenthesis in arrowed functions
    endOfLine: "lf",          // Just use '\n' and disable carriage return ('\r')
    jsxBracketSameLine: true, // This seems to change the way he style HTML closing tag
    eslintIntegration: true,
    overrides: [
      {
        files: "*.html",
        "options": {
          printWidth: 100     // Set 120 column sized code in HTML files
        }
      }
    ]
  };