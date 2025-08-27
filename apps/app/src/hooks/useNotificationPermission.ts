import { toast } from '@shared/ui'
import { MiniKit, Permission } from '@worldcoin/minikit-js'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useNotificationState } from '@hooks/useNotificationState'

export const useNotificationPermission = () => {
  const [hasRequested, setHasRequested] = useState(false)
  const [requestingPermissionStatus, setRequestingPermissionStatus] = useState(false)
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false)

  const t = useTranslations('Toasts.notifications')

  const { setHasFetched, permissionStatus, setPermissionStatus } = useNotificationState()

  const getCurrentPermissions = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn('MiniKit is not installed, cannot get permissions')
      return null
    }

    try {
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.getPermissions()

      if (finalPayload.status === 'success') {
        const notificationsEnabled = finalPayload.permissions.notifications

        if (notificationsEnabled) {
          setPermissionStatus('granted')
        }

        setHasFetched(true)

        return finalPayload.permissions
      } else {
        console.error('Failed to get permissions:', finalPayload.error_code)
        return null
      }
    } catch (error) {
      console.error('Error getting permissions:', error)
      return null
    } finally {
      // setIsCheckingPermissions(false)
    }
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn('MiniKit is not installed, cannot request notification permission')
      return
    }

    // const currentPermissions = await getCurrentPermissions()
    // console.log('currentPermissions')
    // console.log(currentPermissions)
    // if (currentPermissions?.notifications === true) {
    //   console.log('Notification permission already granted, no need to request')
    //   return
    // }

    if (hasRequested) {
      console.log('Notification permission already requested')
      return
    }

    try {
      setRequestingPermissionStatus(true)

      const requestPermissionPayload = {
        permission: Permission.Notifications
      }

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.requestPermission(
        requestPermissionPayload
      )

      if (finalPayload.status === 'success') {
        setPermissionStatus('granted')
        return
      } else {
        console.error('Perm/ission request failed:', finalPayload.error_code)
        setPermissionStatus('denied')

        switch (finalPayload.error_code) {
          case 'user_rejected':
            toast.error(t('permissionDeclined'))
            break
          case 'already_granted':
            setPermissionStatus('granted')
            return
          case 'already_requested':
            toast.error(t('permissionAlreadyRequested'))
            break
          case 'permission_disabled':
            toast.error(t('permissionDisabled'))
            break
          case 'unsupported_permission':
            toast.error(t('permissionError'))
            break
          case 'generic_error':
            toast.error(t('permissionError'))
            break
          default:
            toast.error(t('permissionError'))
        }

        return
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      setPermissionStatus('default')
      toast.error(t('permissionError'))
      return
    } finally {
      setHasRequested(true)
    }
  }, [hasRequested, permissionStatus, getCurrentPermissions])

  return {
    permissionStatus,
    hasRequested,
    isCheckingPermissions,
    requestNotificationPermission,
    requestingPermissionStatus,
    getCurrentPermissions,
    isGranted: permissionStatus === 'granted',
    canRequest: !hasRequested // || permissionStatus === 'default'
  }
}
