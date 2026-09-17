(function (root, factory) {
  const shareUtils = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = shareUtils;
  }

  root.activityShareUtils = shareUtils;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function normalizeActivityName(activityName = "") {
    return activityName
      .normalize("NFKC")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getSharedActivityFromSearch(search = "") {
    const activityName = new URLSearchParams(search).get("activity");
    return activityName ? activityName.trim() : "";
  }

  function createActivityShareLink(origin, pathname, activityName) {
    const shareUrl = new URL(pathname, origin);
    shareUrl.searchParams.set("activity", activityName);
    return shareUrl.toString();
  }

  function isSharedActivity(activityName, sharedActivityName) {
    if (!activityName || !sharedActivityName) {
      return false;
    }

    return (
      normalizeActivityName(activityName) ===
      normalizeActivityName(sharedActivityName)
    );
  }

  return {
    createActivityShareLink,
    getSharedActivityFromSearch,
    isSharedActivity,
    normalizeActivityName,
  };
});
