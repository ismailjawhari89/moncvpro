module.exports = {
    extends: 'lighthouse:default',
    settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: ['uses-http2'], // Skip HTTP/2 if testing local dev server without SSL/HTTP2
    },
};
