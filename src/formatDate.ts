function strPad(value: any, length = 2): string {
  return String(value).padStart(length, '0')
}

export function formatDate(date = new Date()): string {
  return `${date.getFullYear()}-${strPad(date.getMonth() + 1)}-${strPad(date.getDate())}`
}
