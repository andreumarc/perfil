/** Nombres de cookies, claves de almacenamiento y eventos DOM de la analítica propia. */
export const COOKIE_PREFIX = "rf_";
export const CONSENT_COOKIE = `${COOKIE_PREFIX}consent`;
export const VISITOR_COOKIE = `${COOKIE_PREFIX}vid`;
export const SESSION_STORAGE_KEY = `${COOKIE_PREFIX}sid`;
export const ATTRIBUTION_STORAGE_KEY = `${COOKIE_PREFIX}attr`;
export const CONSENT_CHANGE_EVENT = "rf:consent-change";
export const OPEN_COOKIE_SETTINGS_EVENT = "rf:open-cookie-settings";
/** Lo emite el formulario de presupuesto al registrar una solicitud (lo escucha el pop-up). */
export const LEAD_CREATED_EVENT = "rf:lead-created";
/** Estado del pop-up de presupuesto en localStorage (última vez mostrado, conversión). */
export const QUOTE_POPUP_STORAGE_KEY = `${COOKIE_PREFIX}quote_popup`;
