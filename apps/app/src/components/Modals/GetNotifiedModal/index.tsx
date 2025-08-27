import { MODAL_KEYS, useIsDismissed, useIsModalOpen } from '@shared/generic-react-hooks'
import { Modal } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { NotificationsView } from '@components/Modals/SettingsModal/Views/NotificationsView'
import { useNotificationPermission } from '@hooks/useNotificationPermission'
import { useNotificationState } from '@hooks/useNotificationState'

export type GetNotifiedModalOption = 'currency' | 'language' | 'notifications'

export type GetNotifiedModalView = 'menu' | GetNotifiedModalOption

export interface GetNotifiedModalProps {}

export const GetNotifiedModal = (props: GetNotifiedModalProps) => {
  const {} = props

  const { isModalOpen, setIsModalOpen } = useIsModalOpen(MODAL_KEYS.getNotified)
  const { isDismissed, dismiss } = useIsDismissed('getNotifiedModal')

  const { permissionStatus, canRequest } = useNotificationPermission()
  const { hasFetched } = useNotificationState()

  useEffect(() => {
    console.log('hasFetched')
    console.log(hasFetched)
    console.log('permissionStatus')
    console.log(permissionStatus)
    console.log('canRequest')
    console.log(canRequest)
    console.log('isDismissed')
    console.log(isDismissed)
    if (hasFetched && permissionStatus === 'default' && canRequest && !isDismissed) {
      const timer = setTimeout(() => {
        setIsModalOpen(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasFetched, isDismissed, permissionStatus, canRequest])

  if (isModalOpen) {
    return (
      <Modal
        bodyContent={<MainView onDismiss={dismiss} />}
        onClose={() => {
          setIsModalOpen(false)
          dismiss() // Mark as dismissed when closed
        }}
        label='GetNotified'
        mobileStyle='cover'
      />
    )
  }

  return <></>
}

interface MainViewProps {
  onDismiss: () => void
}

const MainView = ({ onDismiss }: MainViewProps) => {
  const t = useTranslations('Settings')

  return (
    <div className='flex flex-col gap-6 mb-6 items-center'>
      <h1 className='text-xl font-bold'>Get notified!</h1>

      <p className='text-center'>
        Receive updates from PoolTogether regarding prizes and improvements!
      </p>

      <NotificationsView />

      <button
        onClick={onDismiss}
        className='px-4 py-2 text-sm text-pt-purple-400 hover:text-pt-purple-100 transition-colors'
      >
        {t('dontShowAgain')}
      </button>
    </div>
  )
}
