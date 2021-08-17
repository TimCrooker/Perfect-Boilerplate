import { promisify } from 'util'
import { getSource } from './'
jest.mock('util', () => ({
  promisify: jest.fn(() => {
    throw new Error()
  }),
}))
describe('Source Helper', () => {
  it('incorrect source url/path', async () => {
    const source = await getSource('alibaba')
    expect(source.error).toBe('Source path not valid')
  })

  it('incorrect source url/path', async () => {
    const source = await getSource('https://github.com/alibaba/ciftligi')
    expect(source.error).toBe('Source repository not found.')
  })

  it('correct source url', async () => {
    ;(promisify as any).mockImplementation(() => jest.fn())

    const source = await getSource('superplate-core-plugins')
    expect(source.error).toBe(undefined)
  })
})
