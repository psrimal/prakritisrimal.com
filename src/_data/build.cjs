// A new id on every deploy. base.njk adds it to asset URLs (?v=...) so the
// browser fetches fresh files after each push instead of reusing a cached copy.
module.exports = {
  id: process.env.VERCEL_GIT_COMMIT_SHA
    ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 8)
    : Date.now().toString(36)
};
