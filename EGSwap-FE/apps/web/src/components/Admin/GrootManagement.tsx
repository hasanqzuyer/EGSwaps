import { ANON_API, MIN_PAYMENT_GROOT_AMOUNT } from 'config/constants/endpoints'
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { CopyButton } from '@pancakeswap/uikit'

const StyledTable = styled.table`
  width: 100%;
  border: 1px solid #0e1d47;
  margin: 20px 0;
  position: relative;
`
const StyledThead = styled.thead`
  background-color: #0e1d47;
  color: white;
  tr {
    th {
      border: 1px solid white;
      padding: 10px;
    }
  }
`
const StyledTbody = styled.tbody`
  background-color: #273c75;
  color: white;
  position: relative;
  tr {
    td {
      border: 1px solid #0e1d47;
      padding: 10px;
      text-align: center;
    }
    &:hover {
      background-color: #384d86;
    }
  }
`

interface User {
  tgUserId: string
  tgUsername: string
  walletAddress?: string
  referralCode?: string
  swappedTokens?: number
  pendingComissions?: number
  paidComissions?: number
  referredBy?: string
  createdAt?: Date
  updatedAt?: Date
  referrals?: {
    level1: number
    level2: number
    level3: number
  }
}

function padTwoDigits(num: number) {
  return num.toString().padStart(2, '0')
}

function dateInYyyyMmDdHhMmSs(date: Date, dateDiveder: string = '-') {
  return (
    [date.getFullYear(), padTwoDigits(date.getMonth() + 1), padTwoDigits(date.getDate())].join(dateDiveder) +
    ' ' +
    [padTwoDigits(date.getHours()), padTwoDigits(date.getMinutes()), padTwoDigits(date.getSeconds())].join(':')
  )
}

const GrootManagement: FC<any> = () => {
  const [users, setUsers] = useState<User[]>([])
  const [userLoading, setUserLoading] = useState<boolean>(false)
  const [paymentLoading, setPaymentLoading] = useState<number>(null)

  const getGrootUsers = async () => {
    setUserLoading(true)
    const resp = await axios.get(`${ANON_API}/user`)
    setUserLoading(false)
    setUsers(resp.data)
  }

  useEffect(() => {
    getGrootUsers()
  }, [])

  const payComission = async (idx: number) => {
    setPaymentLoading(idx)
    const resp = await axios.put(`${ANON_API}/user/referral/pay`, { tgUserId: users[idx].tgUserId })
    setPaymentLoading(null)
    getGrootUsers()
  }

  
  const getUsersYesterday = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const usersCreatedYesterday = users.filter((user: User) => {
      return new Date(user.createdAt) >= yesterday && new Date(user.createdAt) <= endOfYesterday;
    });

    return usersCreatedYesterday;
  }

  return (
    <div className="w-full">
      {userLoading && <div> Loading users.... </div>}
      {users.length === 0 && !userLoading && <div> There are no users registered </div>}
      <p>Total users: {users.length} </p>
      <p>Total users who have done swap: {users.filter((e: User) => e.swappedTokens > 1).length} </p>
      <p>Total users joined yesterday: {getUsersYesterday().length} </p>
      {users.length && (
        <StyledTable>
          <StyledThead>
            <tr>
              <th>Telegram Id</th>
              <th>Username</th>
              <th>Swapped Tokens</th>
              <th>Pending Commissions</th>
              <th>Paid Commissions</th>
              <th>Wallet Address</th>
              <th>Referral Code</th>
              <th>Referred By</th>
              <th>Referrals</th>
              <th>Created At</th>
              <th>Options</th>
            </tr>
          </StyledThead>
          <StyledTbody>
            {users.map((user, idx) => (
              <tr className="h-[45px]" key={idx}>
                <td className="w-fit">{user.tgUserId}</td>
                <td className="w-fit">{user.tgUsername}</td>
                <td className="w-fit">{user.swappedTokens || 0}</td>
                <td className="w-fit">{parseFloat((user.pendingComissions || 0).toFixed(4))}</td>
                <td className="w-fit">{parseFloat((user.paidComissions || 0).toFixed(4))}</td>
                <td className="w-fit">
                  {user.walletAddress || '-'}
                  {user.walletAddress && (
                    <CopyButton
                      color="#F0DC62"
                      width="20px"
                      text={user.walletAddress}
                      tooltipMessage={user.walletAddress}
                    />
                  )}
                </td>
                <td className="w-fit">{user.referralCode}</td>
                <td className="w-fit">{user.referredBy}</td>
                <td className="w-fit !text-left">
                  <p className="font-bold underline">
                    Total {user.referrals.level1 + user.referrals.level2 + user.referrals.level3}
                  </p>
                  <p>Level 1: {user.referrals.level1}</p>
                  <p>Level 2: {user.referrals.level2}</p>
                  <p>Level 3: {user.referrals.level3}</p>
                </td>
                <td className="w-fit">{dateInYyyyMmDdHhMmSs(new Date(user.createdAt))}</td>
                <td className="w-auto">
                  <div className="w-auto flex flex-row items-center justify-center">
                    <button
                      className="gap-x-2 flex justify-center items-center relative text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                      title="Pay"
                      onClick={() => payComission(idx)}
                      disabled={user.pendingComissions < MIN_PAYMENT_GROOT_AMOUNT}
                    >
                      {paymentLoading === idx && <span>Loading</span>}
                      {paymentLoading !== idx && (
                        <span>
                          {user.pendingComissions > MIN_PAYMENT_GROOT_AMOUNT ? 'Pay comissions' : 'No Pending Payment'}{' '}
                        </span>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </StyledTbody>
        </StyledTable>
      )}
    </div>
  )
}

export default GrootManagement
