export function identifyMyKey() {
  const matchedValue = new Error().stack?.split('/').find((e) => e.includes("[as"))?.match(/\[as (\w+)\]/)
  return matchedValue ? matchedValue[1] : 'Unknown key'
}
