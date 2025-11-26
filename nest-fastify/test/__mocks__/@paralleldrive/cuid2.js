// Mock for @paralleldrive/cuid2
export const createId = () => crypto.randomUUID().replaceAll('-', '').substring(0, 24)
export const init = () => createId
export const isCuid = (id) => typeof id === 'string'
export const getConstants = () => ({ defaultLength: 24, bigLength: 32 })
