import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllPrizeInfo,
  useDrawPeriod,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenValue } from '@shared/react-components'
import { Card, Spinner } from '@shared/ui'
import { formatDailyCountToFrequency, getPrizeTextFromFrequency } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'

export interface PrizePoolPrizesCardProps {
  prizePool: PrizePool
  className?: string
  innerClassName?: string
  networkClassName?: string
  headersClassName?: string
  prizeClassName?: string
  frequencyClassName?: string
}

export const PrizePoolPrizesCard = (props: PrizePoolPrizesCardProps) => {
  const {
    prizePool,
    className,
    innerClassName,
    headersClassName,
    prizeClassName,
    frequencyClassName
  } = props

  const t_prizes = useTranslations('Prizes')
  const t_freq = useTranslations('Frequency')

  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo([prizePool])
  const { data: tokenData, isFetched: isFetchedTokenData } = usePrizeTokenData(prizePool)
  const { data: drawPeriod } = useDrawPeriod(prizePool)

  return (
    <Card
      wrapperClassName={className}
      className={classNames('gap-3 items-center !justify-start md:gap-4', innerClassName)}
    >
      <div
        className={classNames(
          'w-full flex text-pt-purple-100/50 md:text-sm',
          'pb-2 border-b-[0.5px] border-b-current',
          headersClassName
        )}
      >
        <span className='flex-grow text-left md:pl-16'>{t_prizes('prize')}</span>
        <span className='flex-grow text-right md:pr-16'>{t_prizes('frequency')}</span>
      </div>
      {isFetchedAllPrizeInfo && isFetchedTokenData && !!tokenData && !!drawPeriod ? (
        <div className='w-full flex flex-col gap-3'>
          {Object.values(allPrizeInfo)[0]
            .slice(0, -2)
            .map((prize, i) => {
              const frequency = formatDailyCountToFrequency(prize.dailyFrequency, {
                minTimespan: drawPeriod
              })

              return (
                <div
                  key={`pp-prizes-${prizePool.chainId}-${i}`}
                  className='w-full flex items-center'
                >
                  <span
                    className={classNames(
                      'flex-grow text-left text-pt-teal/90',
                      'text-lg md:pl-12 md:text-3xl',
                      prizeClassName
                    )}
                  >
                    <TokenValue
                      token={{ ...tokenData, amount: prize.amount.current }}
                      hideZeroes={true}
                      fallback={
                        <TokenAmount
                          token={{ ...tokenData, amount: prize.amount.current }}
                          maximumFractionDigits={2}
                        />
                      }
                    />
                  </span>
                  <span
                    className={classNames(
                      'flex-grow text-right text-pt-purple-100',
                      'md:pr-12 md:text-xl',
                      frequencyClassName
                    )}
                  >
                    {getPrizeTextFromFrequency(frequency, 'everyXdays', t_freq)}
                  </span>
                </div>
              )
            })}
        </div>
      ) : (
        <Spinner />
      )}
    </Card>
  )
}
