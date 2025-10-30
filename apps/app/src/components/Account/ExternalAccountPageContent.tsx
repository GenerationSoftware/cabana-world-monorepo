import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect } from 'react'
import { Address, isAddress } from 'viem'
import { AccountDelegations } from './AccountDelegations'
import { AccountDeposits } from './AccountDeposits'
import { AccountOdds } from './AccountOdds'
import { AccountWinnings } from './AccountWinnings'

interface ExternalAccountPageContentProps {
  queryParams: ParsedUrlQuery
}

export const ExternalAccountPageContent = (props: ExternalAccountPageContentProps) => {
  const { queryParams } = props

  const router = useRouter()

  const { setIsModalOpen } = useIsModalOpen(MODAL_KEYS.drawWinners)

  const user =
    !!queryParams.user &&
    typeof queryParams.user === 'string' &&
    (isAddress(queryParams.user) || queryParams.user.endsWith('.eth'))
      ? queryParams.user
      : undefined

  const userAddress = user as Address | undefined

  useEffect(() => {
    if (!user) {
      router.replace('/account')
    }
  }, [user])

  useEffect(() => {
    setIsModalOpen(false)
  }, [])

  if (!!userAddress) {
    return (
      <>
        <AccountDeposits address={userAddress} />
        <AccountDelegations address={userAddress} />
        <AccountOdds address={userAddress} className='-mt-3 lg:-mt-5' />
        <AccountWinnings address={userAddress} />
      </>
    )
  }

  return <></>
}
