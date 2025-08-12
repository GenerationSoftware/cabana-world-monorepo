import { useTranslations } from 'next-intl'

export const RewardsBackdatedBanner = () => {
  const t_common = useTranslations('Common')

  return (
    <div className='flex h-14 w-100 text-white bg-gradient-to-r from-blue-400 to-teal-400 text-white shadow z-20  items-center justify-center px-4 py-3'>
      <span className='mr-2'>⚡</span>
      <div className='leading-tight text-center text-sm'>{t_common('rewardsBackdated')}</div>
      <span className='ml-2'>⚡</span>
    </div>
  )
}
