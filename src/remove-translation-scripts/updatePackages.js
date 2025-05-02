import { promisify } from 'util'
import { exec as execCallback } from 'child_process'

import fs from 'fs-extra'
import { consola } from 'consola'

const exec = promisify(execCallback)

export const updatePackages = async () => {
  consola.start('Removing packages related to i18n...')

  // Detect package manager
  const packageManager = fs.existsSync('yarn.lock') ? 'yarn' : fs.existsSync('pnpm-lock.yaml') ? 'pnpm' : 'npm'

  // Read package.json
  const pkgJson = await fs.readJSON('package.json')

  const allDeps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
    ...pkgJson.peerDependencies
  }

  const packagesToRemove = ['@formatjs/intl-localematcher', 'negotiator']
  const foundPackages = packagesToRemove.filter(pkg => pkg in allDeps)

  if (foundPackages.length > 0) {
    let uninstallCmd =
      packageManager === 'yarn'
        ? `${packageManager} remove ${foundPackages.join(' ')}`
        : `${packageManager} uninstall ${foundPackages.join(' ')}`

    try {
      await exec(uninstallCmd)
      consola.success(`Removed: ${foundPackages.join(', ')}\n`)
    } catch (err) {
      consola.error('Failed to uninstall packages:', err)
    }
  } else {
    consola.info('No matching i18n packages found to uninstall.\n')
  }

  // Add new package
  const addCmd =
    packageManager === 'npm'
      ? `${packageManager} install --save-dev eslint-plugin-unused-imports`
      : `${packageManager} add -D eslint-plugin-unused-imports`

  await exec(addCmd)
  consola.success('eslint-plugin-unused-imports installed successfully\n')
}
