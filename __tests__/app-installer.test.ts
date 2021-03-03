import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as installer from '../src/app-installer'

describe('app installer tests', () => {
  it('check the installation', async () => {
    const toolDir = process.env['RUNNER_TOOL_CACHE'] as string
    const version = '3.4.0.1729'
    await installer.install(version)
    const dir = path.join(toolDir, 'sonar-scanner', version, os.arch(), 'bin')
    console.log(`directory ${dir}`)
    if (process.platform === 'win32') {
      expect(fs.existsSync(path.join(dir, 'sonar-scanner.bat'))).toBe(true)
    } else {
      expect(fs.existsSync(path.join(dir, 'sonar-scanner'))).toBe(true)
    }
  }, 20000)
})
