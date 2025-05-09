import fs from 'fs-extra'

// No need for execCallback anymore, so we can remove that
// const exec = promisify(execCallback);

export const removeLangaugeDropdown = async () => {
  // Path to the LanguageDropdown.jsx file
  const fileToDelete = 'src/components/layout/shared/LanguageDropdown.jsx'
  const importPatternToDelete = new RegExp(`import .* from '.*LanguageDropdown';?`, 'g')

  // Remove the file with fs.remove (cross-platform)
  await fs.remove(fileToDelete)

  const filesToRemoveFrom = [
    'src/components/layout/vertical/NavbarContent.jsx',
    'src/components/layout/horizontal/NavbarContent.jsx'
  ]

  for (const file of filesToRemoveFrom) {
    let content = await fs.readFile(file, 'utf8')

    // Replace patterns in the file content
    content = content.replace(importPatternToDelete, '')

    // Use a RegExp object for the component removal, ensuring global replacement
    const languageDropdownPattern = new RegExp('<LanguageDropdown\\s*/>\\s*', 'g')

    content = content.replace(languageDropdownPattern, '')

    // Write the modified content back to the file
    await fs.writeFile(file, content, 'utf8')
    console.log(`Updated file: ${file}`)
  }
}
