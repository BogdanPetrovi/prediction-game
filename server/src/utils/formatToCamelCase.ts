const toCamelCase = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

const formatRow = (row: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toCamelCase(key), value])
)

export default formatRow