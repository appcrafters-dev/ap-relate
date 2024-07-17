module.exports = {
  // This will lint and format TypeScript and                                             //JavaScript files
  "**/*.(jsx|js)": (filenames) => [
    `eslint --fix ${filenames.join(" ")}`,
    `prettier --write ${filenames.join(" ")}`,
  ],

  // this will Format MarkDown and JSON
  "**/*.(md|json)": (filenames) => `prettier --write ${filenames.join(" ")}`,
};
