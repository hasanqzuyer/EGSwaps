import styled from 'styled-components'
import axios from 'axios'
import cn from 'clsx'

import { FC, useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { ANON_API } from 'config/constants/endpoints'
import { CopyButton } from '@pancakeswap/uikit'

const RECORDS_PER_PAGE = 10

export interface IApiKey {
  key: string
  active: boolean
  company: string
  expiredAt: Date
  createdAt: string
  updatedAt: string
}

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

const ApiKeysManagement: FC<{ keys: IApiKey[]; isLoading: boolean; refresh: any }> = (props) => {
  const { keys, refresh } = props
  const [addMode, setAddMode] = useState(false)
  const [currentKey, setCurrentKey] = useState(null)
  const [currentLogs, setCurrentLogs] = useState([])
  const [stats, setStats] = useState<{
    ordersExpired?: number
    ordersCompletedOrFinished?: number
    ordersExchangingOrSending?: number
    ordersWaiting?: number
    ordersFailed?: number
    ordersOther?: number
    totalOrders?: number
  }>({})
  const [countLogs, setCountLogs] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [openLogs, setOpenLogs] = useState(false)
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [error, setError] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [expirationDate, setExpirationDate] = useState(new Date())
  const [currentPage, setCurrentPage] = useState<number>(0)

  const handleKeyPress = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && openLogs) {
      setCurrentKey(null)
      setOpenLogs(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  })

  const softDeleteKey = async (idx: number) => {
    try {
      await axios.delete(
        `${ANON_API}/admin/api-keys/${keys[idx].key}?active=${keys[idx].active ? 'false' : 'true'}&soft_delete=true`,
      )
    } catch (error) {
      setError(error.toString())
    }
    refresh && refresh()
    return
  }

  const deleteKey = async (idx: number) => {
    try {
      await axios.delete(`${ANON_API}/admin/api-keys/${keys[idx].key}?soft_delete=false`)
    } catch (error) {
      setError(error.toString())
    }
    refresh && refresh()
    return
  }

  const handleAddNew = async () => {
    if (!addMode) {
      setAddMode(true)
      return
    }

    setIsSaving(true)

    try {
      await axios.post(`${ANON_API}/admin/open-api-key`, {
        company: newCompany,
        expirationDate,
      })
    } catch (error) {
      setError(error.toString())
    }
    setAddMode(false)
    setIsSaving(false)
    setNewCompany('')
    setExpirationDate(null)
    refresh && refresh()
  }

  const getLogsFromKey = async (apiKey: string, offset: number, limit: number) => {
    try {
      const resp = await axios.get(`${ANON_API}/admin/api-keys/${apiKey}/logs?offset=${offset}&limit=${limit}`)

      return resp.data.data
    } catch (error) {
      return []
    }
  }

  const getStatsFromKey = async (apiKey: string) => {
    try {
      const resp = await axios.get(`${ANON_API}/admin/api-keys/${apiKey}/stats`)

      return resp.data.data
    } catch (error) {
      return []
    }
  }

  const openModal = async (idx: number) => {
    setCurrentKey(keys[idx])
    setOpenLogs(true)
    setLoadingLogs(true)

    const { logs, count } = await getLogsFromKey(keys[idx].key, 0, RECORDS_PER_PAGE)
    setCountLogs(count)
    setCurrentLogs(logs)
    setLoadingLogs(false)

    const [stats] = await getStatsFromKey(keys[idx].key)
    setStats(stats)
  }

  const closeModal = async () => {
    setCurrentKey(null)
    setCurrentPage(0)
    setCurrentLogs([])
    setCountLogs(0)
    setOpenLogs(false)
    setStats({})
  }

  const mapStatus = (order: any) => {
    if (!order) {
      return 'no order created'
    }

    const mapper = {
      '0': 'Waiting',
      '1': 'Received',
      '2': 'Exchanging',
      '3': 'Sending',
      '4': 'Finished',
      '5': 'Expired',
      '6': 'Failed',
    }

    if (order?.order_status?.toString() === '0') {
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const creationTimestamp = new Date(order.date.createAt).getTime() / 1000
      const timeDifference = currentTimestamp - creationTimestamp
      const threshold = 48 * 60 * 60
      if (timeDifference > threshold) {
        return mapper['5']
      }
    }

    return mapper[order?.order_status?.toString()]
  }

  const goToPage = async (idx: number) => {
    setCurrentPage(idx)
    // setCurrentLogs([])
    setLoadingLogs(true)
    const { logs, count } = await getLogsFromKey(currentKey.key, RECORDS_PER_PAGE * idx, RECORDS_PER_PAGE)
    setCountLogs(count)
    setCurrentLogs(logs)
    setLoadingLogs(false)
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-between">
        <div>List of API Keys</div>
        <div className="cursor-pointer" onClick={refresh}>
          {props.isLoading ? 'Loading' : 'Refresh'}
        </div>
      </div>
      <StyledTable>
        <StyledThead>
          <tr>
            <th>Company</th>
            <th>Key</th>
            <th>Active</th>
            <th>Expiration Date</th>
            <th>Created At</th>
            <th>Options</th>
          </tr>
        </StyledThead>
        <StyledTbody>
          {keys?.map((key, idx) => (
            <tr className="h-[45px]" key={idx}>
              <td className="w-fit">{key.company}</td>
              <td className="w-fit" title={key.key}>
                <CopyButton color="#F0DC62" width="20px" text={key?.key} tooltipMessage={key?.key} />
              </td>
              <td className="w-fit">{key.active ? 'Yes' : 'No'}</td>
              <td className="w-fit">{dateInYyyyMmDdHhMmSs(new Date(key.expiredAt))}</td>
              <td className="w-fit">{dateInYyyyMmDdHhMmSs(new Date(key.createdAt))}</td>
              <td className="w-auto">
                <div className="w-auto flex flex-row items-center justify-center">
                  <button
                    className="gap-x-2 flex justify-center items-center relative text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    title="Disabled/Enabled"
                    onClick={() => softDeleteKey(idx)}
                  >
                    {key.active ? (
                      <span className="text-green-700 text-[30px] mb-[6px]">&#x26AC;</span>
                    ) : (
                      <span className="text-gray-700 text-[30px] mb-[6px]">&#x26AC;</span>
                    )}
                    <span> Status </span>
                  </button>
                  <button
                    className="flex justify-center items-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => deleteKey(idx)}
                  >
                    {' '}
                    Remove{' '}
                  </button>
                  <button
                    className="flex justify-center items-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => openModal(idx)}
                  >
                    {' '}
                    Logs{' '}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {addMode && (
            <tr>
              <td className="w-fit">
                <input
                  className="text-center text-black"
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                />
              </td>
              <td className="w-fit">-</td>
              <td className="w-fit">-</td>
              <td className="w-fit">
                <input
                  className="text-center text-black"
                  type="date"
                  value={expirationDate.toISOString().split('T')[0]}
                  onChange={(e) => setExpirationDate(new Date(e.target.value))}
                />
              </td>
              <td className="w-fit">-</td>
              <td className="w-fit"></td>
            </tr>
          )}
        </StyledTbody>
      </StyledTable>
      <div className="w-full flex items-center justify-between">
        <div className="w-full">
          <button
            onClick={handleAddNew}
            disabled={isSaving}
            className="w-24 h-10 rounded-md bg-[#0E1D47] hover:bg-[#273c75] text-white"
          >
            {isSaving ? <CircularProgress color="success" size={20} /> : addMode ? 'Save' : 'Add New'}
          </button>
          {addMode && !isSaving && (
            <button
              onClick={() => setAddMode(false)}
              className="w-24 h-10 mx-2 rounded-md bg-[#0E1D47] hover:bg-[#273c75] text-white"
            >
              Cancel
            </button>
          )}
        </div>
        <div>
          {<div className="w-full text-red text-[12px] my-4">{error}</div>}
          {props.isLoading && <div className="cursor-pointer">Saving</div>}
        </div>
      </div>

      {/* Modal */}
      {openLogs && currentKey && (
        <div className="fixed z-10 inset-0 overflow-y-auto top-[10%]">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="relative z-10 bg-white rounded-lg p-6 sm:w-full">
              {/* Modal content */}
              <div className="mb-4">
                <h1 className="text-lg font-bold">
                  API KEY LOGS - {currentKey.company} ({stats.totalOrders})
                </h1>
                <div className="text-[14px]">
                  {Object.keys(stats).length ? (
                    <>
                      <p>Orders expired: {stats.ordersExpired || 0}</p>
                      <p>Orders completed:{stats.ordersCompletedOrFinished || 0}</p>
                      <p>Orders Failed: {stats.ordersFailed || 0}</p>
                      <p>Orders Waiting: {stats.ordersWaiting || 0}</p>
                      <p>Orders Exchanging/Sending: {stats.ordersExchangingOrSending || 0}</p>
                      <p>Orders Other: {stats.ordersOther || 0}</p>
                    </>
                  ) : (
                    <p> Loading stats</p>
                  )}
                </div>

                {!loadingLogs && currentLogs?.length === 0 && (
                  <div className="flex flex-row sm:flex-col gap-x-4">Empty Logs</div>
                )}

                <div className="my-4 flex flex-col gap-4 overflow-scroll h-[30rem]">
                  <StyledTable>
                    <StyledThead>
                      <tr className="text-center">
                        <td>#</td>
                        <td>Endpoint</td>
                        <td>Method</td>
                        <td>Order Id</td>
                        <td>Custom Id</td>
                        <td>Order Status</td>
                        <td>Created At</td>
                      </tr>
                    </StyledThead>
                    <StyledTbody>
                      {currentLogs.map((log: any, idx) => (
                        <tr className="text-center">
                          <td className={loadingLogs ? 'text-white/20' : ''}>
                            {currentPage * RECORDS_PER_PAGE + (idx + 1)}
                          </td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>{log.url || 'unknown'}</td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>{log.action || 'unknown'}</td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>{log?.order?._id || '-'}</td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>{log?.order?.customId || '-'}</td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>{mapStatus(log?.order) || '-'}</td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>
                            {dateInYyyyMmDdHhMmSs(new Date(log.createdAt))}
                          </td>
                        </tr>
                      ))}
                    </StyledTbody>
                  </StyledTable>
                  {loadingLogs && (
                    <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 border border-gray-400 text-[32px] text-white">
                      Loading...
                    </h1>
                  )}
                </div>

                {currentLogs?.length > 0 && (
                  <div className="flex space-x-2 items-center justify-center flex-wrap">
                    {Array.from({ length: Math.ceil(countLogs / RECORDS_PER_PAGE) }).map((_, idx) => (
                      <span
                        className={cn('cursor-pointer', { 'font-bold underline-offset-1': currentPage === idx })}
                        onClick={() => goToPage(idx)}
                      >
                        {idx + 1}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Close button */}
              <button onClick={closeModal} className="absolute top-0 right-0 p-2">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ApiKeysManagement
