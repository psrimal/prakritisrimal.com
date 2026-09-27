export default function (eleventyConfig) {
  // The four standalone project pages keep their own design and ship as-is.
  eleventyConfig.addPassthroughCopy({ 'src/work': 'work' });
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  // Expose the project data to client-side JS without duplicating it.
  eleventyConfig.addFilter('json', (v) => JSON.stringify(v));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    // .html is passthrough-copied, not templated, so her pages stay untouched.
    templateFormats: ['njk', 'md'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
}
