import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultPromotionsApr } from '@generationsoftware/hyperstructure-react-hooks'
import {
  BonusRewardsTooltip,
  ImportedVaultTooltip,
  PrizesTooltip,
  RelativeWinChanceTooltip,
  VaultBadge
} from '@shared/react-components'
import { lower } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { POOL_STAKING_VAULTS, TWAB_REWARDS_SETTINGS } from '@constants/config'
import { useVaultImportedListSrcs } from '@hooks/useVaultImportedListSrcs'
import { VaultBonusRewards } from './VaultBonusRewards'
import { VaultButtons } from './VaultButtons'
import { VaultPrizes } from './VaultPrizes'
import { VaultTotalDeposits } from './VaultTotalDeposits'
import { VaultWinChance } from './VaultWinChance'

interface VaultCardProps {
  vault: Vault
}

export const VaultCard = (props: VaultCardProps) => {
  const { vault } = props

  const t_common = useTranslations('Common')
  const t_vaults = useTranslations('Vaults')
  const t_tooltips = useTranslations('Tooltips')

  const importedSrcs = useVaultImportedListSrcs(vault)

  const tokenAddresses = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].tokenAddresses : []
  const fromBlock = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].fromBlock : undefined
  const { data: vaultPromotionsApr } = useVaultPromotionsApr(vault, tokenAddresses, { fromBlock })

  const isPoolStakingVault = POOL_STAKING_VAULTS[vault.chainId] === lower(vault.address)

  return (
    <div
      className={classNames('flex flex-col gap-4 rounded-lg px-3 pt-3 pb-6 bg-pt-purple-600', {
        // 'bg-pt-purple-600': isPoolStakingVault,
        // 'bg-pt-transparent': !isPoolStakingVault
      })}
    >
      <div className='inline-flex gap-2 items-center'>
        <Link href={`/vault/${vault.chainId}/${vault.address}`}>
          <VaultBadge vault={vault} onClick={() => {}} />
        </Link>
        {importedSrcs.length > 0 && (
          <ImportedVaultTooltip vaultLists={importedSrcs} intl={t_tooltips('importedVault')} />
        )}
      </div>
      <div className='w-full flex flex-col gap-1 px-3'>
        <div className='flex items-center justify-between'>
          <span className='flex gap-1 items-center text-sm text-pt-purple-200'>
            {t_vaults('headers.prizes')}
            <PrizesTooltip intl={t_tooltips('prizes')} className='text-xs' />
          </span>
          <VaultPrizes vault={vault} className='text-xs' amountClassName='!text-base' />
        </div>
        <div className='flex items-center justify-between'>
          <span className='flex gap-1 items-center text-sm text-pt-purple-200'>
            {t_vaults('headers.winChance')}
            <RelativeWinChanceTooltip intl={t_tooltips('relativeWinChance')} className='text-xs' />
          </span>
          <VaultWinChance
            vault={vault}
            className='w-11 pb-2'
            fallbackClassName='!pb-0'
            tooltipClassName='text-xs'
          />
        </div>
        {!!vaultPromotionsApr?.apr && (
          <div className='flex items-center justify-between'>
            <span className='flex gap-1 items-center text-sm text-pt-purple-200'>
              {t_vaults('headers.bonusRewards')}
              <BonusRewardsTooltip intl={t_tooltips('bonusRewards')} className='text-xs' />
            </span>
            <VaultBonusRewards
              vault={vault}
              prepend={<span className='text-xs'>+</span>}
              append={<span className='text-xs text-pt-purple-200'>{t_common('apr')}</span>}
              minApr={0.01}
              valueClassName='text-sm'
            />
          </div>
        )}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-pt-purple-200'>{t_vaults('headers.totalDeposits')}</span>
          <VaultTotalDeposits vault={vault} />
        </div>
      </div>
      <VaultButtons
        vault={vault}
        fullSized={true}
        forceHide={['delegate']}
        className='justify-end'
      />
    </div>
  )
}
