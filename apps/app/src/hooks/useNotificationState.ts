import { atom, useAtom } from 'jotai'

const permissionStatusAtom = atom<'default' | 'granted' | 'denied'>('default')
const hasFetchedAtom = atom<boolean>(false)

/**
 * Returns the state of notifications
 * @returns
 */
export const useNotificationState = () => {
  const [permissionStatus, setPermissionStatus] = useAtom(permissionStatusAtom)
  const [hasFetched, setHasFetched] = useAtom(hasFetchedAtom)

  return { hasFetched, setHasFetched, permissionStatus, setPermissionStatus }
}
