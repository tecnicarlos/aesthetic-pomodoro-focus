const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'zustand') {
        return {
            filePath: require.resolve('zustand'),
            type: 'sourceFile',
        };
    }
    if (moduleName === '@supabase/supabase-js') {
        return {
            filePath: require.resolve('@supabase/supabase-js'),
            type: 'sourceFile',
        };
    }
    return context.resolveRequest(context, moduleName, platform);
};

config.resolver.unstable_enablePackageExports = false;
config.resolver.resolverMainFields = ['react-native', 'main'];

module.exports = config;
