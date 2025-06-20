import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'

interface AccountWinAmountProps {
  prizePool: PrizePool
  amount: bigint
  className?: string
  valueClassName?: string
  amountClassName?: string
}

export const AccountWinAmount = (props: AccountWinAmountProps) => {
  const { prizePool, amount, className, valueClassName, amountClassName } = props

  const { data: tokenData } = usePrizeTokenData(prizePool)

  if (!tokenData) {
    return <Spinner />
  }

  return (
    <TokenValueAndAmount
      token={{ ...tokenData, amount }}
      amountOptions={{ maximumFractionDigits: 5 }}
      className={`${className} items-end md:items-center`}
      valueClassName={valueClassName}
      amountClassName={amountClassName}
    />
  )
}
