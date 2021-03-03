import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'

import * as os from 'os'
import * as path from 'path'

const toolName = 'sonar-scanner'

export async function install(version: string): Promise<void> {
  let toolPath: string
  toolPath = tc.find(toolName, version)

  if (!toolPath) {
    toolPath = await downloadSonarScanner(version)
  }

  toolPath = path.join(toolPath, 'bin')
  core.addPath(toolPath)
}

function getPlattform(): string {
  const platformMap: {[platform: string]: string} = {
    linux: 'linux',
    darwin: 'macosx',
    win32: 'windows'
  }
  const plattform = platformMap[os.platform()]
  if (!plattform) {
    const errormsg = `Unsupported platform.platform:${os.platform()},arch:${os.arch()}`
    throw new Error(errormsg)
  }
  return plattform
}

function getDownloadUrl(version: string): string {
  return `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}-${getPlattform()}.zip`
}

async function downloadSonarScanner(version: string): Promise<string> {
  const toolDirectoryName = `${toolName}-${version}-${getPlattform()}`
  const downloadUrl = getDownloadUrl(version)

  try {
    const downloadPath = await tc.downloadTool(downloadUrl)

    const extractedPath = await tc.extractZip(downloadPath)

    const toolRoot = path.join(extractedPath, toolDirectoryName)
    return await tc.cacheDir(toolRoot, toolName, version)
  } catch (err) {
    throw err
  }
}
