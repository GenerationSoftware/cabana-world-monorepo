import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useAccount } from '@shared/generic-react-hooks'
import { DelegateButton, DepositButton, WithdrawButton } from '@shared/react-components'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'

interface VaultPageButtonsProps {
  vault: Vault
  className?: string
}

export const VaultPageButtons = (props: VaultPageButtonsProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_tooltips = useTranslations('Tooltips')

  const { address: userAddress } = useAccount()

  return (
    <div className={classNames('flex items-center gap-2 md:gap-4', className)}>
      <DepositButton
        vault={vault}
        extraOnClick={() => {}}
        intl={{ base: t_common, tooltips: t_tooltips }}
      />
      <WithdrawButton vault={vault} extraOnClick={() => {}} color='transparent'>
        {t_common('withdraw')}
      </WithdrawButton>
      {/* {!!userAddress && (
        <DelegateButton vault={vault} extraOnClick={() => {}} color='transparent'>
          {t_common('delegate')}
        </DelegateButton>
      )} */}
    </div>
  )
}
