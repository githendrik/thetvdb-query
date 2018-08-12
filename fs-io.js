const fs = require("fs");

// Config
const resultsFile = "./results/results.json";
const tokenFile = "./.authToken.json";

function write(results) {
  fs.writeFileSync(resultsFile, JSON.stringify(results, undefined, 2));
  return results;
}

function read() {
  let cache = [];
  try {
    const fileContents = fs.readFileSync(resultsFile, "utf-8");
    cache = JSON.parse(fileContents);
  } catch (e) {
  }

  return cache;
}

function getToken() {
  return JSON.parse(fs.readFileSync(tokenFile, "utf-8")).token;
}

module.exports = {
  write,
  read,
  getToken
};
