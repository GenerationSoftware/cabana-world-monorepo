import { BellIcon, BellSlashIcon } from '@heroicons/react/24/outline'
import { BasicIcon } from '@shared/ui'
import { Button } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useNotificationPermission } from '@hooks/useNotificationPermission'

type NotificationsViewProps = {
  showHeader?: boolean
}

export const NotificationsView = (props: NotificationsViewProps) => {
  const { showHeader } = props

  const t = useTranslations('Settings')
  const {
    permissionStatus,
    requestNotificationPermission,
    isGranted,
    canRequest,
    requestingPermissionStatus
  } = useNotificationPermission()

  const getStatusText = () => {
    if (requestingPermissionStatus) {
      return t('requesting')
    }

    switch (permissionStatus) {
      case 'granted':
        return t('notificationsEnabled')
      case 'denied':
        return t('notificationsDisabled')
      default:
        return t('notificationsDisabled')
    }
  }

  const getStatusIcon = () => {
    if (isGranted) {
      return <BellIcon className='h-6 w-6' />
    } else {
      return <BellSlashIcon className='h-6 w-6 text-pt-purple-100' />
    }
  }

  const handleRequestPermission = async () => {
    await requestNotificationPermission()
  }

  return (
    <div className='flex flex-col items-center gap-6 px-4'>
      {showHeader && (
        <span className='text-lg font-semibold text-pt-purple-50 order-first md:text-xl'>
          {t('notificationSettings')}
        </span>
      )}

      <div className='flex flex-col items-center gap-4 w-full'>
        <div className='flex items-center gap-3 p-4 bg-pt-transparent/5 rounded-lg w-full'>
          <BasicIcon content={getStatusIcon()} size='lg' theme='dark' />
          <div className='flex flex-col'>
            <span className='text-pt-purple-50 font-medium'>{t('notifications')}</span>
            <span className='text-sm text-pt-purple-200'>{getStatusText()}</span>
          </div>
        </div>

        {canRequest && !isGranted && (
          <Button onClick={handleRequestPermission} className='w-full px-6 py-3'>
            {t('enableNotifications')}
          </Button>
        )}

        {!canRequest && !isGranted && (
          <div className='text-center text-sm text-pt-purple-200 p-4 bg-pt-transparent/5 rounded-lg w-full'>
            <p>{t('notificationsDisabled')}</p>
            <p className='mt-2'>{t('enableInSettings')}</p>
          </div>
        )}

        {isGranted && (
          <div className='text-center text-sm text-green-400 p-4 bg-green-400/10 rounded-lg w-full'>
            <p>{t('notificationsHaveBeenEnabled')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
