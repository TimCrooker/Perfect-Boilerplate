import { FSHelper } from './'
import fs from 'fs'

const removeDir = function (path: string) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + '/' + filename).isDirectory()) {
          removeDir(path + '/' + filename)
        } else {
          fs.unlinkSync(path + '/' + filename)
        }
      })
      fs.rmdirSync(path)
    } else {
      fs.rmdirSync(path)
    }
  } else {
    console.log('Directory path not found.')
  }
}

describe('FS Helper', () => {
  it('correct path exists', async () => {
    const PathExists = await FSHelper.PathExists('.')
    expect(PathExists).toBeTruthy()
  })

  it('incorrect path exists', async () => {
    const PathExists = await FSHelper.PathExists('../pankod')
    expect(PathExists).toBeFalsy()
  })

  const MockRootDir = './src/Utils/files/MockPluginPackDir'

  it('correctly formatted plugin pack', async () => {
    removeDir(MockRootDir)

    await fs.promises.mkdir(MockRootDir)

    await fs.promises.mkdir(MockRootDir + '/template')

    await fs.promises.mkdir(MockRootDir + '/plugins')

    await fs.promises.writeFile(MockRootDir + '/prompt.js', 'test')

    const ValidPack = await FSHelper.ValidPluginPack(MockRootDir)

    removeDir(MockRootDir)

    expect(ValidPack).toBeTruthy()
  })
})
