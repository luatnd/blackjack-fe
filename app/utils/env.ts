export const isClient = typeof window !== "undefined";
export const isDevMode = process.env.NODE_ENV === "development";
export const isClientDevMode = isDevMode && isClient;
export const isStandaloneMode = isClient && ('standalone' in window.navigator) && (window.navigator.standalone);
// export const appEnv = "APP_ENV"; // This will be override in compile phase by webpack
// export const appVersionCommitId = "APP_VERSION_COMMIT_ID"; // This will be override in compile phase by webpack
export const appOrigin = isClient ? window.location.hostname : "";

console.log('{}:', {isClient, isDevMode, isClientDevMode, isStandaloneMode, appOrigin});
