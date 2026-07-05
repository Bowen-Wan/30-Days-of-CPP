module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/_data/curriculum.json");

  // Watch CSS/JS for dev server
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  // Global data: build date
  eleventyConfig.addGlobalData("buildDate", new Date().toISOString().split('T')[0]);

  // Filters
  eleventyConfig.addFilter("statusIcon", (status) => {
    const icons = { done: '✓', current: '●', pending: '○', missed: '✗' };
    return icons[status] || '○';
  });

  eleventyConfig.addFilter("statusLabel", (status) => {
    const labels = { done: 'Complete', current: 'In Progress', pending: 'Pending', missed: 'Missed' };
    return labels[status] || 'Pending';
  });

  eleventyConfig.addFilter("dump", (obj) => JSON.stringify(obj, null, 2));

  // Shortcodes
  eleventyConfig.addShortcode("year", () => new Date().getFullYear());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html", "js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};