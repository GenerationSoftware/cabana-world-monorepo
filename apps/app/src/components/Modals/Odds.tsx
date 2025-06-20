import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useDrawPeriod,
  usePrizeOdds,
  useSelectedVaults,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import {
  calculateUnionProbability,
  formatNumberForDisplay,
  getVaultId,
  SECONDS_PER_MONTH,
  SECONDS_PER_WEEK
} from '@shared/utilities'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { parseUnits } from 'viem'
import {
  depositFormShareAmountAtom,
  depositFormTokenAddressAtom,
  depositFormTokenAmountAtom
} from './DepositModal/DepositForm'

interface OddsProps {
  vault: Vault
  prizePool: PrizePool
}

export const Odds = (props: OddsProps) => {
  const { vault, prizePool } = props

  const t_common = useTranslations('Common')
  const t_txModals = useTranslations('TxModals')

  const formTokenAddress = useAtomValue(depositFormTokenAddressAtom)
  const formTokenAmount = useAtomValue(depositFormTokenAmountAtom)
  const formShareAmount = useAtomValue(depositFormShareAmountAtom)

  const { data: share } = useVaultShareData(vault)
  const { data: vaultToken } = useVaultTokenData(vault)

  const inputTokenAddress = formTokenAddress ?? vaultToken?.address

  const { vaults } = useSelectedVaults()

  const inputVault = useMemo(() => {
    if (!!vault && !!inputTokenAddress) {
      const vaultId = getVaultId({ chainId: vault.chainId, address: inputTokenAddress })
      return Object.values(vaults.vaults).find((v) => getVaultId(v) === vaultId)
    }
  }, [vault, inputTokenAddress, vaults])

  const { data: inputShare } = useVaultShareData(inputVault!)

  const { data: inputPrizeOdds } = usePrizeOdds(
    prizePool,
    inputVault!,
    !!inputShare && !!formTokenAmount ? parseUnits(formTokenAmount, inputShare.decimals) : 0n
  )

  const { data: outputPrizeOdds } = usePrizeOdds(
    prizePool,
    vault,
    !!share && !!formShareAmount ? parseUnits(formShareAmount, share.decimals) : 0n,
    { isCumulative: true }
  )

  const { data: drawPeriod } = useDrawPeriod(prizePool)

  const chance = useMemo(() => {
    if (!!outputPrizeOdds && !!drawPeriod) {
      const input = !!inputPrizeOdds
        ? t_txModals('oneInXChance', { number: calculateOneInXChance(inputPrizeOdds, drawPeriod) })
        : undefined
      const output = t_txModals('oneInXChance', {
        number: calculateOneInXChance(outputPrizeOdds, drawPeriod)
      })
      return { input, output }
    }
  }, [inputPrizeOdds, outputPrizeOdds, drawPeriod])

  return (
    <div className='flex flex-col items-center font-semibold'>
      <span className='mb-1 text-sm text-pt-purple-100 md:text-sm'>
        {!!drawPeriod && drawPeriod > SECONDS_PER_WEEK
          ? t_txModals('monthlyChances')
          : t_txModals('weeklyChances')}
      </span>
      {!!chance ? (
        <>
          {!!chance.input ? (
            <>
              <div className='flex gap-2 items-center'>
                <span className='text-xs text-pt-purple-100'>{t_common('before')}</span>
                <span className='text-pt-purple-50 md:text-xl'>
                  {formTokenAmount !== '0' ? chance.input : '-'}
                </span>
              </div>
              <div className='flex gap-2 items-center'>
                <span className='text-xs text-pt-purple-100'>{t_common('after')}</span>
                <span className='text-pt-purple-50 md:text-xl'>
                  {formTokenAmount !== '0' ? chance.output : '-'}
                </span>
              </div>
            </>
          ) : (
            <span className='text-pt-purple-50 md:text-xl'>
              {formTokenAmount !== '0' ? chance.output : '-'}
            </span>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

const calculateOneInXChance = (
  odds: NonNullable<ReturnType<typeof usePrizeOdds>['data']>,
  drawPeriod: number
) => {
  const timeframe = drawPeriod > SECONDS_PER_WEEK ? SECONDS_PER_MONTH : SECONDS_PER_WEEK
  const numEvents = Math.floor(timeframe / drawPeriod)
  const events = Array<number>(numEvents).fill(odds.percent)
  const value = 1 / calculateUnionProbability(events)
  return formatNumberForDisplay(value, { maximumSignificantDigits: 3 })
}
