const pluralRules = new Intl.PluralRules('sr')
const numberFormat = new Intl.NumberFormat('sr-Latn-RS')

export const pluralize = (count: number, one: string, few: string, other: string) => {
  const rule = pluralRules.select(count)
  const word = rule === 'one' ? one : rule === 'few' ? few : other

  return `${numberFormat.format(count)} ${word}`
}
