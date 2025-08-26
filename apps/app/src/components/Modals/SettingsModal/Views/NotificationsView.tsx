import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline'
import { BasicIcon } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useNotificationPermission } from '@hooks/useNotificationPermission'

export const NotificationsView = () => {
  const t = useTranslations('Settings')
  const t_toasts = useTranslations('Toasts.notifications')
  const { 
    permissionStatus, 
    requestNotificationPermission, 
    isGranted, 
    canRequest, 
    getCurrentPermissions,
    isCheckingPermissions 
  } = useNotificationPermission()

  console.log('permissionStatus')
  console.log(permissionStatus)
  console.log('isGranted')
  console.log(isGranted)
  console.log('canRequest')
  console.log(canRequest)

  const getStatusText = () => {
    if (isCheckingPermissions) {
      return t_toasts('checkingPermissions')
    }
    
    switch (permissionStatus) {
      case 'granted':
        return t('notificationsEnabled')
      case 'denied':
        return t('notificationsDisabled')
      case 'requesting':
        return t('requesting')
      default:
        return t('notificationsDisabled')
    }
  }

  const getStatusIcon = () => {
    if (isGranted) {
      return <BellIcon className='h-6 w-6 text-green-400' />
    } else {
      return <BellSlashIcon className='h-6 w-6 text-pt-purple-100' />
    }
  }

  const handleRequestPermission = async () => {
    await requestNotificationPermission()
  }

  return (
    <div className='flex flex-col items-center gap-6 px-4'>
      <span className='text-lg font-semibold text-pt-purple-50 order-first md:text-xl'>
        {t('notificationSettings')}
      </span>

      <div className='flex flex-col items-center gap-4 w-full max-w-md'>
        <div className='flex items-center gap-3 p-4 bg-pt-transparent/5 rounded-lg w-full'>
          <BasicIcon content={getStatusIcon()} size='lg' theme='dark' />
          <div className='flex flex-col'>
            <span className='text-pt-purple-50 font-medium'>{t('notifications')}</span>
            <span className='text-sm text-pt-purple-200'>{getStatusText()}</span>
          </div>
        </div>

        {/* Refresh permissions button */}
        <button
          onClick={getCurrentPermissions}
          disabled={isCheckingPermissions}
          className='w-full px-4 py-2 bg-pt-transparent/10 hover:bg-pt-transparent/20 disabled:bg-pt-transparent/5 disabled:cursor-not-allowed text-pt-purple-200 font-medium rounded-lg transition-colors border border-pt-transparent/20'
        >
          {isCheckingPermissions ? t_toasts('refreshing') : t_toasts('refreshPermissions')}
        </button>

        {canRequest && !isGranted && (
          <button
            onClick={handleRequestPermission}
            disabled={permissionStatus === 'requesting'}
            className='w-full px-6 py-3 bg-pt-purple-500 hover:bg-pt-purple-400 disabled:bg-pt-purple-600 disabled:cursor-not-allowed text-pt-purple-50 font-medium rounded-lg transition-colors'
          >
            {permissionStatus === 'requesting' ? t('requesting') : t('enableNotifications')}
          </button>
        )}

        {!canRequest && !isGranted && (
          <div className='text-center text-sm text-pt-purple-200 p-4 bg-pt-transparent/5 rounded-lg w-full'>
            <p>{t('notificationsDisabled')}</p>
            <p className='mt-2'>{t('enableInSettings')}</p>
          </div>
        )}

        {isGranted && (
          <div className='text-center text-sm text-green-400 p-4 bg-green-400/10 rounded-lg w-full'>
            <p>{t('notificationsEnabled')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
