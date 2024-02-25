export function notEmpty(value) {
  return value !== null && value !== undefined
}

export function pluralize(singular, plural, count) {
  return count === 1 ? singular : plural
}

export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase()
  })
}
