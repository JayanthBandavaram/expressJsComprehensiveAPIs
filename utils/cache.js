const NodeCache = new Map();

export const getCache = (key) => NodeCache.get(key);
export const setCache = (key, value) => NodeCache.set(key, value);
