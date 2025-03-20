import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { apiPost } from 'hooks/api'

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

const WidgetManagement = (props) => {
  const [widgetUsers, setWidgetUsers] = useState([])
  const [currentWidgetUser, setCurrentWidgetUser] = useState(null)
  const [currentOrders, setCurrentOrders] = useState([])
  const [stats, setStats] = useState<{
    ordersExpired?: number
    ordersCompletedOrFinished?: number
    ordersExchangingOrSending?: number
    ordersWaiting?: number
    ordersFailed?: number
    ordersOther?: number
    totalOrders?: number
  }>({})
  const [openOrders, setOpenOrders] = useState(false)
  const [loadingLogs, setLoadingLogs] = useState(false)

  const handleKeyPress = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape' && openOrders) {
      setCurrentWidgetUser(null)
      setOpenOrders(false)
    }
  }

  const fetchData = async () => {
    const response = await apiPost('/admin/widget-users')
    setWidgetUsers(response.data)
  }

  const openModal = async (idx: number) => {
    setCurrentWidgetUser(widgetUsers[idx])
    setCurrentOrders(widgetUsers[idx].orders)
    setOpenOrders(true)
    setLoadingLogs(false)
  }

  const closeModal = async () => {
    setCurrentWidgetUser(null)
    setCurrentOrders([])
    setOpenOrders(false)
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

    if (order?.order_status?.toString() !== '0') {
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

  const refreshWidgets = () => {
    if (props.isLoading) {
      return
    }
    setWidgetUsers([])
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  })

  return (
    <div className="w-full">
      <div className="w-full flex flex-row justify-between">
        <div>List of Widgets</div>
        <button
          onClick={refreshWidgets}
          className="cursor-pointer w-24 h-10 rounded-md bg-[#0E1D47] hover:bg-[#273c75] text-white"
        >
          {props.isLoading ? 'Loading' : 'Refresh'}
        </button>
      </div>
      <StyledTable>
        <StyledThead>
          <tr>
            <th>Widget</th>
            <th>Options</th>
          </tr>
        </StyledThead>
        <StyledTbody>
          {widgetUsers.map((e, idx) => (
            <tr className="h-[45px]" key={idx}>
              <td className="w-fit">{e.name}</td>
              <td className="w-auto">
                <div className="w-auto flex flex-row items-center justify-center">
                  <button
                    className="flex justify-center items-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => openModal(idx)}
                  >
                    Orders
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </StyledTbody>
      </StyledTable>

      {/* Modal */}
      {openOrders && currentWidgetUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto top-[10%]">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="relative z-10 bg-white rounded-lg p-6 sm:w-full">
              {/* Modal content */}
              <div className="mb-4">
                <h1 className="text-lg font-bold">
                  Orders - {currentWidgetUser.name} ({currentOrders.length})
                </h1>
                <div className="text-[14px]">
                  {/* {Object.keys(stats).length && (
                    <>
                      <p>Orders expired: {stats.ordersExpired || 0}</p>
                      <p>Orders completed:{stats.ordersCompletedOrFinished || 0}</p>
                      <p>Orders Failed: {stats.ordersFailed || 0}</p>
                      <p>Orders Waiting: {stats.ordersWaiting || 0}</p>
                      <p>Orders Exchanging/Sending: {stats.ordersExchangingOrSending || 0}</p>
                      <p>Orders Other: {stats.ordersOther || 0}</p>
                    </>
                  )} */}
                </div>

                {!loadingLogs && currentOrders?.length === 0 && (
                  <div className="flex flex-row sm:flex-col gap-x-4">Empty Logs</div>
                )}

                <div className="my-4 flex flex-col gap-4 overflow-scroll h-[30rem]">
                  <StyledTable>
                    <StyledThead>
                      <tr className="text-center">
                        <td>#</td>
                        <td>Order Id</td>
                        <td>Order Status</td>
                        <td>Created At</td>
                      </tr>
                    </StyledThead>
                    <StyledTbody>
                      {currentOrders.map((order: any, idx) => (
                        <tr className="text-center">
                          <td className={loadingLogs ? 'text-white/20' : ''}>{idx + 1}</td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>{order?._id || '-'}</td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>{mapStatus(order) || '-'}</td>
                          <td className={loadingLogs ? 'text-white/20' : ''}>
                            {dateInYyyyMmDdHhMmSs(new Date(order.creation_time * 1000))}
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
export default WidgetManagement
