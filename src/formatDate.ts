function strPad(value: any, length = 2): string {
  const str = String(value)
  if (str.length < length) {
    return '0'.repeat(length - str.length) + str
  }

  return str
}

export function formatDate(date = new Date()) {
  return `${date.getFullYear()}-${strPad(date.getMonth() + 1)}-${strPad(date.getDate())}`
}
