import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { Modal } from '@shared/ui'
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

  const { permissionStatus, canRequest } = useNotificationPermission()
  const { hasFetched } = useNotificationState()

  useEffect(() => {
    console.log('re-run ...')
    console.log(permissionStatus)
    if (hasFetched && permissionStatus === 'default' && canRequest) {
      const timer = setTimeout(() => {
        console.log('show modal')
        setIsModalOpen(true)
      }, 2000)

      // requestNotificationPermission()

      return () => clearTimeout(timer)
    }
  }, [hasFetched])

  if (isModalOpen) {
    return (
      <Modal
        bodyContent={<MainView />}
        onClose={() => {
          setIsModalOpen(false)
        }}
        label='GetNotified'
        mobileStyle='cover'
      />
    )
  }

  return <></>
}

const MainView = () => {
  // const t_common = useTranslations('Common')

  return (
    <div className='flex flex-col gap-6 mb-6 items-center'>
      <h1 className='text-xl font-bold'>Get notified!</h1>
      <p className='text-center'>
        Receive updates from PoolTogether regarding prizes and improvements!
      </p>
      <NotificationsView />
    </div>
  )
}
