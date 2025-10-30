import { NextRequest, NextResponse } from 'next/server'

export interface MinikitTxReceiptApiParams {
  transactionId: string
}

const MINIKIT_TX_API_BASE_URL = `https://developer.worldcoin.org/api/v2/minikit/transaction`
const APP_ID = process.env.NEXT_PUBLIC_MINIKIT_APP_ID

const DEFAULT_RETRY_ATTEMPTS = 8
const DEFAULT_RETRY_INTERVAL = 3

type WorldMinikitTransaction = {
  transactionId: string
  transactionStatus: string
  miniappId: string
  updatedAt: string
  network: string
  fromWalletAddress: string
  toContractAddress: string
  transactionHash?: string
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const transactionId = req.nextUrl.searchParams.get('transactionId') as string
    if (!transactionId) {
      throw new Error('No transactionId provided in query params')
    }

    const transactionHash = await waitForWorldMinikitTransactionHash(transactionId)

    return NextResponse.json({ transactionHash }, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: 'Could not fetch transaction receipt data' },
      { status: 500 }
    )
  }
}

/**
 * @async
 * @function waitForWorldMinikitTransactionHash Tries to get the transaction hash N times from World API, with a delay between each attempt.
 * @param {string} transactionId string
 * @returns {Promise<string>} Promise of the transaction hash
 */
async function waitForWorldMinikitTransactionHash(transactionId: string): Promise<string> {
  let attemptCount = 0
  while (true) {
    try {
      if (attemptCount > 0) {
        console.log(`Retrying:`)
      }
      console.log(`Attempt #${attemptCount + 1} ...`)
      const url = `${MINIKIT_TX_API_BASE_URL}/${transactionId}?app_id=${APP_ID}&type=transaction`
      console.log(`Request URL:`, url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.WORLD_API_KEY}`
        }
      })

      const transactionResponse: WorldMinikitTransaction = await response.json()
      const { transactionHash } = transactionResponse

      if (transactionHash) {
        return transactionHash
      } else {
        // @ts-ignore
        console.error(transactionResponse?.attribute)

        console.log('Could not get txHash - retrying...')
        throw new Error('Could not get txHash - retrying...')
      }
    } catch (error) {
      console.log('Error:')
      console.error(`${error}`)
      if (++attemptCount >= DEFAULT_RETRY_ATTEMPTS) throw error
    }

    await delay(DEFAULT_RETRY_INTERVAL)
  }
}

/**
 * @function delay Delays the execution of an action.
 * @param {number} time The time to wait in seconds.
 * @returns {Promise<void>}
 */
function delay(time: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, time * 1000))
}
