import fs from 'fs-extra'
import { consola } from 'consola'

// Update the auth guard file
export const updateAuthGuard = async () => {
  consola.start('Updating AuthGard file...')

  const authGuardPath = 'src/hocs/AuthGuard.jsx'
  const exists = await fs.pathExists(authGuardPath)

  if (!exists) {
    consola.warn(`Skipped: ${authGuardPath} not found.`)

    return
  }

  let AuthGuardFileContent = await fs.promises.readFile(authGuardPath, 'utf8')

  AuthGuardFileContent = AuthGuardFileContent.replace(/(ChildrenType) & { locale: Locale }/, '$1')
    .replace(/\{ children, locale \}/, '{ children }')
    .replace(/lang={locale}/, '')

  await fs.promises.writeFile(authGuardPath, AuthGuardFileContent)
  consola.success('Auth Guard file updated successfully\n')
}

// Update the guest only route file
export const updateGuestOnlyRoutes = async () => {
  consola.start('Updating GuestOnlyRoute file...')

  const guestRoutePath = 'src/hocs/GuestOnlyRoute.jsx'
  const exists = await fs.pathExists(guestRoutePath)

  if (!exists) {
    consola.warn(`Skipped: ${guestRoutePath} not found.`)

    return
  }

  let GuestOnlyRouteFileContent = await fs.promises.readFile(guestRoutePath, 'utf8')

  GuestOnlyRouteFileContent = GuestOnlyRouteFileContent.replace(/(ChildrenType) & { lang: Locale }/, '$1')
    .replace(/\{ children, lang \}/, '{ children }')
    .replace(/lang={locale}/, '')

  await fs.promises.writeFile(guestRoutePath, GuestOnlyRouteFileContent)
  consola.success('Guest Guard file updated successfully\n')
}
