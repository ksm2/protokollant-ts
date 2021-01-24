import { formatDate } from '../formatDate'

describe('formatDate', () => {
  it('prints a date as a string', () => {
    expect(formatDate(new Date(2021, 0, 1))).toBe('2021-01-01')
    expect(formatDate(new Date(2021, 0, 31))).toBe('2021-01-31')
    expect(formatDate(new Date(2021, 11, 31))).toBe('2021-12-31')
  })
})
