/** Nombres de cookies, claves de almacenamiento y eventos DOM de la analítica propia. */
export const COOKIE_PREFIX = "rf_";
export const CONSENT_COOKIE = `${COOKIE_PREFIX}consent`;
export const VISITOR_COOKIE = `${COOKIE_PREFIX}vid`;
export const SESSION_STORAGE_KEY = `${COOKIE_PREFIX}sid`;
export const ATTRIBUTION_STORAGE_KEY = `${COOKIE_PREFIX}attr`;
export const CONSENT_CHANGE_EVENT = "rf:consent-change";
export const OPEN_COOKIE_SETTINGS_EVENT = "rf:open-cookie-settings";
