import { toast } from '@shared/ui'
import { MiniKit, Permission } from '@worldcoin/minikit-js'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'requesting'

export const useNotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>('default')
  const [hasRequested, setHasRequested] = useState(false)
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false)

  const t = useTranslations('Toasts.notifications')

  // Check current permissions using getPermissions API
  const getCurrentPermissions = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn('MiniKit is not installed, cannot get permissions')
      return null
    }

    try {
      setIsCheckingPermissions(true)
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.getPermissions()
      
      if (finalPayload.status === 'success') {
        console.log('Current permissions:', finalPayload.permissions)
        
        // Check if notifications permission is granted
        const hasNotifications = finalPayload.permissions.notifications === true
        
        if (hasNotifications) {
          setPermissionStatus('granted')
          setHasRequested(true)
          console.log('Notification permission already granted')
        } else {
          setPermissionStatus('denied')
          setHasRequested(true)
          console.log('Notification permission not granted')
        }
        
        return finalPayload.permissions
      } else {
        console.error('Failed to get permissions:', finalPayload.error_code)
        return null
      }
    } catch (error) {
      console.error('Error getting permissions:', error)
      return null
    } finally {
      setIsCheckingPermissions(false)
    }
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn('MiniKit is not installed, cannot request notification permission')
      return
    }

    // First check if we already have permission
    const currentPermissions = await getCurrentPermissions()
    if (currentPermissions?.notifications === true) {
      console.log('Notification permission already granted, no need to request')
      return true
    }

    if (hasRequested) {
      console.log('Notification permission already requested')
      return
    }

    try {
      setPermissionStatus('requesting')

      const requestPermissionPayload = {
        permission: Permission.Notifications
      }

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.requestPermission(
        requestPermissionPayload
      )

      if (finalPayload.status === 'success') {
        console.log('Notification permission granted:', finalPayload)
        setPermissionStatus('granted')
        setHasRequested(true)

        toast.success(t('permissionGranted'))
        return true
      } else {
        console.error('Permission request failed:', finalPayload.error_code)
        setPermissionStatus('denied')
        setHasRequested(true)

        // Handle different error codes
        switch (finalPayload.error_code) {
          case 'user_rejected':
            toast.error(t('permissionDeclined'))
            break
          case 'already_granted':
            setPermissionStatus('granted')
            setHasRequested(true)
            return true
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

        return false
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      setPermissionStatus('denied')
      setHasRequested(true)
      toast.error(t('permissionError'))
      return false
    }
  }, [hasRequested, permissionStatus, getCurrentPermissions])

  // Check if permission is already granted using World App permissions
  useEffect(() => {
    if (typeof window !== 'undefined' && MiniKit.isInstalled()) {
      getCurrentPermissions()
    }
  }, [getCurrentPermissions])

  return {
    permissionStatus,
    hasRequested,
    isCheckingPermissions,
    requestNotificationPermission,
    getCurrentPermissions,
    isGranted: permissionStatus === 'granted',
    canRequest: !hasRequested || permissionStatus === 'default'
  }
}
