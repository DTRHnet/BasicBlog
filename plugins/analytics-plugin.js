/**
 * Example plugin for BasicBlog
 * This plugin demonstrates how to extend BasicBlog functionality
 */

/**
 * Analytics Plugin
 * Adds analytics tracking to the blog
 * @param {Object} app - The app instance
 */
export default function analyticsPlugin(app) {
    console.log('📊 Analytics Plugin loaded');

    // Example: Add Google Analytics
    const addGoogleAnalytics = (trackingId) => {
        if (typeof window !== 'undefined' && trackingId) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() {
                window.dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', trackingId);

            console.log(`✅ Google Analytics initialized with ID: ${trackingId}`);
        }
    };

    // Example: Track page views
    const trackPageView = (path) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: path,
            });
            console.log(`📈 Page view tracked: ${path}`);
        }
    };

    // Example: Track custom events
    const trackEvent = (eventName, eventParams = {}) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', eventName, eventParams);
            console.log(`🎯 Event tracked: ${eventName}`, eventParams);
        }
    };

    // Expose plugin API
    return {
        name: 'analytics',
        version: '1.0.0',
        addGoogleAnalytics,
        trackPageView,
        trackEvent,
    };
}

/**
 * Usage:
 * 
 * 1. Import the plugin in your app:
 *    import analyticsPlugin from './plugins/analytics-plugin.js';
 * 
 * 2. Initialize the plugin:
 *    const analytics = analyticsPlugin(app);
 *    analytics.addGoogleAnalytics('GA-XXXXXXXXX');
 * 
 * 3. Track events:
 *    analytics.trackPageView('/about');
 *    analytics.trackEvent('button_click', { button_name: 'subscribe' });
 */
