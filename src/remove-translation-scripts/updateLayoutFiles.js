import fs from 'fs-extra'
import { consola } from 'consola'

// Update the main layout file
export const updateLayoutFile = async () => {
  consola.start('Updating layout file...')
  const layoutFilePath = 'src/app/layout.jsx'

  try {
    if (await fs.pathExists(layoutFilePath)) {
      let layoutFileContent = await fs.promises.readFile(layoutFilePath, 'utf8')

      // Modify the file content as needed
      layoutFileContent = layoutFileContent
        .replace(/lang={params.lang}/g, "lang='en'")
        .replace(/const headersList.*/, '')
        .replace(/<TranslationWrapper[^>]*>([\s\S]*?)<\/TranslationWrapper>/, '$1')
        .replace(/const params = await props.params/g, '')

      // Write the modified content back to the file
      await fs.promises.writeFile(layoutFilePath, layoutFileContent)
      consola.success('Layout file updated successfully\n')
    } else {
      consola.warn(`${layoutFilePath} not found. Skipping update.`)
    }
  } catch (error) {
    consola.error(`Error updating layout file: ${error.message}`)
  }

  // Update notFound file
  consola.start('Updating notFound file...')
  const notFoundFilePath = 'src/app/[...not-found]/page.jsx'

  try {
    if (await fs.pathExists(notFoundFilePath)) {
      let notFoundFileContent = await fs.promises.readFile(notFoundFilePath, 'utf8')

      notFoundFileContent = notFoundFileContent.replace(/const params = await props.params/g, '')
      await fs.promises.writeFile(notFoundFilePath, notFoundFileContent)
      consola.success('notFound file updated successfully\n')
    } else {
      consola.warn(`${notFoundFilePath} not found. Skipping update.`)
    }
  } catch (error) {
    consola.error(`Error updating notFound file: ${error.message}`)
  }
}

// Update Private routes Layout file
export const updateDashboardLayoutFile = async () => {
  consola.start('Updating dashboard layout file...')
  const filePath = 'src/app/(dashboard)/(private)/layout.jsx'

  try {
    if (await fs.pathExists(filePath)) {
      let content = await fs.promises.readFile(filePath, 'utf8')

      // Add disableDirection to <Customizer> if not already present
      content = content
        .replace(/<Customizer((?!disableDirection)[^>]*?)\/?>/g, `<Customizer$1 disableDirection />`)
        .replace(/const dictionary = await getDictionary\(params.lang\)\n?/, '')
        .replace(/(AuthGuard\s*[^>]*?)locale={params.lang}(.*?>)/, '$1$2')
        .replace(/const params = await props.params/g, '')

      await fs.promises.writeFile(filePath, content)
      consola.success('Added disabledDirection prop in customizer component\n')
    } else {
      consola.warn(`${filePath} not found. Skipping update.`)
    }
  } catch (error) {
    consola.error(`Error updating dashboard layout file: ${error.message}`)
  }
}

export const updateGuestLayoutFile = async () => {
  consola.start('Updating guest layout file...')
  const filePath = 'src/app/(blank-layout-pages)/(guest-only)/layout.jsx'

  try {
    if (await fs.pathExists(filePath)) {
      let content = await fs.promises.readFile(filePath, 'utf8')

      // Modify the file content as needed
      content = content
        .replace(/lang={params.lang}/g, "lang='en'") // Replace dynamic lang prop
        .replace(/const params = await props.params/g, '') // Remove unused params logic

      // Write the modified content back to the file
      await fs.promises.writeFile(filePath, content)
      consola.success('Guest layout file updated successfully\n')
    } else {
      consola.warn(`${filePath} not found. Skipping update.`)
    }
  } catch (error) {
    consola.error(`Error updating guest layout file: ${error.message}`)
  }
}

export const updateBlankLayoutFile = async () => {
  consola.start('Updating blank layout file...')
  const filePath = 'src/app/(blank-layout-pages)/(blank-only)/layout.jsx'

  try {
    if (await fs.pathExists(filePath)) {
      let content = await fs.promises.readFile(filePath, 'utf8')

      // Modify content as required
      content = content
        .replace(/lang={params.lang}/g, "lang='en'") // Modify pattern
        .replace(/const params = await props.params/g, '') // Remove unused logic

      // Write the modified content back to the file
      await fs.promises.writeFile(filePath, content)
      consola.success('Blank layout file updated successfully\n')
    } else {
      consola.warn(`${filePath} not found. Skipping update.`)
    }
  } catch (error) {
    consola.error(`Error updating blank layout file: ${error.message}`)
  }
}

// Example for the updateFrontLayoutFile function
export const updateFrontLayoutFile = async () => {
  consola.start('Updating front layout file...')
  const filePath = 'src/app/(front-layout-pages)/(front-only)/layout.jsx'

  try {
    if (await fs.pathExists(filePath)) {
      let content = await fs.promises.readFile(filePath, 'utf8')

      // Modify content as required
      content = content.replace(/lang={params.lang}/g, "lang='en'").replace(/const params = await props.params/g, '')

      // Write the modified content back to the file
      await fs.promises.writeFile(filePath, content)
      consola.success('Front layout file updated successfully\n')
    } else {
      consola.warn(`${filePath} not found. Skipping update.`)
    }
  } catch (error) {
    consola.error(`Error updating front layout file: ${error.message}`)
  }
}
