const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createActivityShareLink,
  getSharedActivityFromSearch,
  isSharedActivity,
} = require("./share-utils.js");

test("getSharedActivityFromSearch returns the shared activity name", () => {
  assert.equal(
    getSharedActivityFromSearch("?activity=Chess%20Club"),
    "Chess Club"
  );
});

test("createActivityShareLink keeps the activity in the URL", () => {
  assert.equal(
    createActivityShareLink(
      "https://school.example",
      "/static/index.html",
      "Programming Class"
    ),
    "https://school.example/static/index.html?activity=Programming+Class"
  );
});

test("isSharedActivity matches names with different spacing or punctuation", () => {
  assert.equal(isSharedActivity("Chess Club", " chess-club "), true);
  assert.equal(
    isSharedActivity("Programming Class", "Programming   Class"),
    true
  );
  assert.equal(isSharedActivity("Chess Club", "Art Club"), false);
});
