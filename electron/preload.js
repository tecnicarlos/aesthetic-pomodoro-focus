// electron/preload.js
// This script runs before the renderer loads.
// We use it to "patch" process.env so that Expo Web (Metro) can mutate it without errors.
// Expo tries to set properties on process.env using Object.defineProperty, which fails on the native Node process.env.

const _process = process;

// We shadow the global 'process' on the window object.
// We use a Proxy to forward everything to the real process, EXCEPT 'env'.
window.process = new Proxy(_process, {
    get(target, prop) {
        if (prop === 'env') {
            // Return a plain object copy of env.
            // This allows Expo to write to it (e.g. EXPO_PUBLIC_PROJECT_ROOT) without crashing.
            // Changes here won't affect the real process.env, which is fine for the renderer.
            return { ..._process.env };
        }
        // Bind functions to the original target to preserve 'this' context
        if (typeof target[prop] === 'function') {
            return target[prop].bind(target);
        }
        return target[prop];
    }
});
