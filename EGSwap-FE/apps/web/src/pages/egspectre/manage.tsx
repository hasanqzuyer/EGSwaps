'use client'
import { useState, useEffect, useReducer } from 'react'
import { useToast } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import Page from 'views/Page'
import { Flex, CopyButton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import CircularProgress from '@mui/material/CircularProgress'
import { apiPost } from 'hooks/api'
import { TimestampToDateString, displayAddress, fixedFloat } from 'utils/helper'
import RefreshImg from '../../assets/refresh.png'
import { getExchangeName, getStatus, getOrderPageLink } from 'utils/egspectre'
import ApiKeysManagement from 'components/Admin/ApiKeysManagement'
import GrootManagement from 'components/Admin/GrootManagement'
import WidgetManagement from 'components/Admin/WidgetManagement'

const StyledTable = styled.table`
  width: 100%;
  border: 1px solid #0e1d47;
  margin: 20px 0;
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
const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  justify-content: center;
`

const ManageAlert: React.FC<{
  val: string
  setVal: (e: string) => void
  active: boolean
  setActive: (e: boolean) => void
  submit: (e: { warning_status: boolean; message: string }) => void
  loading: boolean
}> = ({ val, setVal, active, setActive, submit, loading }) => {
  const { toastError } = useToast()
  const [isEdit, setIsEdit] = useState(false)

  const handleUpdate = () => {
    if (isEdit) {
      toastError('Warning', 'Please save the message before submit')
      return
    }
    if (window.confirm('Are you sure you want to change the warning message?')) {
      const params = {
        warning_status: active,
        message: val,
      }
      submit(params)
    }
  }

  return (
    <>
      <div className="border border-solid border-black w-full mb-10">
        <div className="flex flex-row items-center justify-center w-full">
          <p className="grid place-items-center w-full text-black">Turn on alert to users</p>
          <div className="w-80 h-10 border-l border-solid border-black">
            <button
              onClick={() => setActive(true)}
              className={`w-1/2 h-full ${
                active && 'bg-[#0E1D47] text-white'
              } text-black hover:text-white hover:bg-[#273c75]`}
            >
              YES
            </button>
            <button
              onClick={() => setActive(false)}
              className={`w-1/2 h-full ${
                !active && 'bg-[#0E1D47] text-white'
              } text-black hover:text-white hover:bg-[#273c75]`}
            >
              NO
            </button>
          </div>
        </div>
      </div>
      <div className="w-full border border-solid min-h-[250px] flex flex-col items-center justify-between">
        <div className="flex items-center min-h-[150px] w-full bg-slate-300 p-2">
          <button
            onClick={() => setIsEdit((prev) => !prev)}
            className="mr-10 w-24 h-10 rounded-md bg-[#0E1D47] hover:bg-[#273c75] text-white"
          >
            {isEdit ? 'SAVE' : 'EDIT'}
          </button>
          {isEdit ? (
            <textarea
              value={val}
              onChange={(e) => setVal(e.target.value)}
              rows={6}
              placeholder="PLEASE WRITE WARNING MESSAGE HERE..."
              maxLength={255}
              className="w-full border bg-white border-b-slate-900 text-black min-h-[150px] p-2"
              id="warning-textarea"
            />
          ) : (
            <div className="min-h-[150px] text-center text-black p-2 border border-solid w-full items-center flex">
              {val}
            </div>
          )}
        </div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-24 h-10 rounded-md bg-[#0E1D47] hover:bg-[#273c75] text-white"
        >
          {loading ? <CircularProgress color="success" size={20} /> : 'UPDATE'}
        </button>
      </div>
    </>
  )
}

const ManageMaintenance: React.FC<{
  val: boolean
  setVal: (e: boolean) => void
  submit: (e: boolean) => void
  loading: boolean
}> = ({ val, setVal, submit, loading }) => {
  const handleUpdate = () => {
    if (window.confirm('Are you sure you want to change the website maintenance status?')) {
      submit(val)
    }
  }

  return (
    <>
      <div className="w-full mb-10">
        <div className="flex flex-row items-center justify-center w-full sm:flex-col">
          <div className="sm:border sm:border-solid grid place-items-center w-full">Maintenance website mode</div>
          <div className="w-80 h-10 border border-solid sm:w-full">
            <button
              onClick={() => setVal(true)}
              className={`w-1/2 h-full ${val && 'bg-[#0E1D47] text-white'} hover:text-white hover:bg-[#273c75]`}
            >
              YES
            </button>
            <button
              onClick={() => setVal(false)}
              className={`w-1/2 h-full ${!val && 'bg-[#0E1D47] text-white'} hover:text-white hover:bg-[#273c75]`}
            >
              NO
            </button>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[250px] flex flex-col items-center justify-between">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-24 h-10 rounded-md bg-[#0E1D47] hover:bg-[#273c75] text-white"
        >
          {loading ? <CircularProgress color="success" size={20} /> : 'UPDATE'}
        </button>
      </div>
    </>
  )
}

const Manage: React.FC<React.PropsWithChildren> = () => {
  const { toastError, toastSuccess } = useToast()
  const router = useRouter()
  const { address: account, isConnecting } = useAccount()

  const [isSearching, setIsSearching] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [tab, setTab] = useState('info')
  const [warningMsg, setWarningMsg] = useState('')
  const [alertActive, setAlertActive] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const searchOrderFunc = async () => {
    if (orderId.length > 24)
      toastError('Invalid EGSpectre ID', 'This EGSpectre ID is invalid. For any further inquiries, contact Support.')
    else {
      setIsSearching(true)
      const orderRes = await apiPost(`orders/admin/${orderId}`, null, 'GET', null, 'admin')
      console.log('orderRes=', orderRes)
      setIsSearching(false)
      if (orderRes.code === 200) {
        setOrderData(orderRes.data)
      } else
        toastError('Invalid EGSpectre ID', 'This EGSpectre ID is invalid. For any further inquiries, contact Support.')
    }
  }

  const getWarningStatus = async () => {
    setIsLoading(true)
    const res = await apiPost('admin/getWarningStatus')
    setIsLoading(false)
    setWarningMsg(res.data.message)
    setAlertActive(res.data.warning_status)
  }

  const getApiKeys = async () => {
    setIsLoading(true)
    const res = await apiPost('admin/api-keys')
    setIsLoading(false)
    setApiKeys(res.data)
  }

  const handleUpdateWarningStatus = async (params: { warning_status: boolean; message: string }) => {
    setIsLoading(true)
    const res = await apiPost('admin/updateWarningStatus', params, 'POST', null, 'admin')
    setIsLoading(false)
    if (res.code !== 200) {
      toastError('Update failed', 'Please try again')
      router.push(`/egspectre/login`)
    } else toastSuccess('Success', 'Updated successfully')
  }

  const getMaintenanceMode = async () => {
    setIsLoading(true)
    const res = await apiPost('admin/getMaintenanceMode')
    setIsLoading(false)
    setMaintenanceMode(res.data.maintenance_status)
  }

  const handleUpdateMaintenance = async (params: boolean) => {
    const update = { maintenance_status: params }
    setIsLoading(true)
    const res = await apiPost('admin/updateMaintenanceMode', update, 'POST', null, 'admin')
    setIsLoading(false)
    if (res.code !== 200) {
      toastError('Session expired', 'Please try again')
      router.push(`/egspectre/login`)
    } else toastSuccess('Success', 'Updated successfully')
  }

const checkIsAdmin = async () => {
    const jwtToken = localStorage.getItem('@egspectreToken')
    if (!jwtToken) {
      router.push(`/egspectre/login`)
      return
    }
    const params = { wallet_address: account }
    const isAdminRes = await apiPost('admin/isAdmin', params, 'POST', null, 'admin')
    if (!isAdminRes.data?.isAdmin) {
      toastError('Warning', 'You are not admin')
      router.push(`/egspectre/login`)
    } else {
      getWarningStatus()
      getMaintenanceMode()
      getApiKeys()
    }
  }
  useEffect(() => {
    if (!isConnecting) {
      if (!account) {
        toastError('Warning', 'Please sign in with your wallet')
        router.push(`/egspectre/login`)
      } else checkIsAdmin()
    }
  }, [isConnecting, account, router.pathname])

  return (
    <Page>
      <Flex
        width={['789px', '100%']}
        minHeight={'100vh'}
        flexDirection="column"
        position="relative"
        alignItems="center"
      >
        <div className="mt-8 sm:mt-6 flex sm:flex-col w-[90%] overflow-hidden mb-20 sm:mb-6 flex-row">
          <div className="flex flex-col w-[15%] bg-[#0E1D47] min-h-[600px] sm:w-full sm:flex-row sm:min-h-[100px]">
            <span
              onClick={() => setTab('alert')}
              className={`w-full text-center py-10 uppercase text-white border-b border-b-orange-100 border-solid hover:bg-[#273c75] cursor-pointer ${
                tab === 'alert' && 'bg-[#273c75]'
              }`}
              style={{ textShadow: tab === 'alert' ? '2px 2px 10px white' : 'none' }}
            >
              Warning Alert
            </span>
            <span
              onClick={() => setTab('info')}
              className={`w-full text-center py-10 uppercase text-white border-b border-b-orange-100 border-solid hover:bg-[#273c75] cursor-pointer ${
                tab === 'info' && 'bg-[#273c75]'
              }`}
              style={{ textShadow: tab === 'info' ? '2px 2px 10px white' : 'none' }}
            >
              Order Information
            </span>
            <span
              onClick={() => setTab('maintenance')}
              className={`w-full text-center py-10 uppercase text-white border-b border-b-orange-100 border-solid hover:bg-[#273c75] cursor-pointer ${
                tab === 'maintenance' && 'bg-[#273c75]'
              }`}
              style={{ textShadow: tab === 'maintenance' ? '2px 2px 10px white' : 'none' }}
            >
              Maintenance
            </span>
            <span
              onClick={() => setTab('apikeys')}
              className={`w-full text-center py-10 uppercase text-white border-b border-b-orange-100 border-solid hover:bg-[#273c75] cursor-pointer ${
                tab === 'apikeys' && 'bg-[#273c75]'
              }`}
              style={{ textShadow: tab === 'apikeys' ? '2px 2px 10px white' : 'none' }}
            >
              Api Key
            </span>
            <span
              onClick={() => setTab('feenix')}
              className={`w-full text-center py-10 uppercase text-white border-b border-b-orange-100 border-solid hover:bg-[#273c75] cursor-pointer ${
                tab === 'feenix' && 'bg-[#273c75]'
              }`}
              style={{ textShadow: tab === 'feenix' ? '2px 2px 10px white' : 'none' }}
            >
              Feenix BOT
            </span>
            <span
              onClick={() => setTab('widget')}
              className={`w-full text-center py-10 uppercase text-white border-b border-b-orange-100 border-solid hover:bg-[#273c75] cursor-pointer ${
                tab === 'feenix' && 'bg-[#273c75]'
              }`}
              style={{ textShadow: tab === 'widget' ? '2px 2px 10px white' : 'none' }}
            >
              Widget
            </span>
          </div>
          <div className="w-3/4 p-10 bg-[#fff] flex flex-col items-center sm:w-full overflow-scroll">
            {tab === 'info' && (
              <>
                <div
                  className="sm:hidden flex flex-row items-center justify-between w-[334px] h-10 max-w-md bg-white rounded-full px-3 z-20"
                  style={{
                    boxShadow: '2px 2px 3px 0px rgba(0, 0, 0, 0.15) inset',
                    border: '1px solid #D0D0D0',
                  }}
                >
                  <input
                    type="text"
                    className="border-none outline-none text-xs w-full z-20 bg-transparent text-black"
                    placeholder="Search by EGSpectre ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                  {isSearching ? (
                    <img src={RefreshImg.src} alt="" className={`w-[24px] h-[24px] animate-spin`} />
                  ) : (
                    <img
                      src="/images/anon/search.png"
                      alt="search"
                      className="cursor-pointer hover:scale-110 active:scale-100 z-20"
                      width={20}
                      onClick={searchOrderFunc}
                    />
                  )}
                </div>
                <StyledTable>
                  <StyledThead>
                    <tr>
                      <th>OPTION</th>
                      <th>VALUE</th>
                    </tr>
                  </StyledThead>
                  <StyledTbody>
                    <tr>
                      <td>Order ID</td>
                      <td>
                        <RowDiv>
                          {displayAddress(orderData?.orderId)}
                          <CopyButton
                            color="#F0DC62"
                            width="20px"
                            text={orderData?.orderId}
                            tooltipMessage={displayAddress(orderData?.orderId)}
                          />
                        </RowDiv>
                      </td>
                    </tr>
                    <tr>
                      <td>Created At</td>
                      <td>{TimestampToDateString(orderData?.creation_time)}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>{getStatus(orderData?.status)}</td>
                    </tr>
                    <tr>
                      <td>Anonymity</td>
                      <td>{orderData && (orderData?.is_anon ? 'Private' : 'Discreet')}</td>
                    </tr>
                    <tr>
                      <td>Exchange Flow</td>
                      <td>{orderData?.exchange_flow}</td>
                    </tr>
                  </StyledTbody>
                </StyledTable>
                <StyledTable>
                  <StyledThead>
                    <tr>
                      <th>OPTION</th>
                      <th>TOKEN A</th>
                      <th>TOKEN B</th>
                    </tr>
                  </StyledThead>
                  <StyledTbody>
                    <tr>
                      <td>Order ID</td>
                      <td>
                        <RowDiv>
                          <a
                            href={getOrderPageLink(
                              orderData?.exchange_flow.split('_')[0],
                              orderData?.tokenA_xmr_orderID,
                            )}
                            target={'_blank'}
                            rel="noreferrer"
                            className="underline"
                          >
                            {displayAddress(orderData?.tokenA_xmr_orderID, 4)}
                          </a>
                          <CopyButton
                            color="#F0DC62"
                            width="20px"
                            text={orderData?.tokenA_xmr_orderID}
                            tooltipMessage={displayAddress(orderData?.tokenA_xmr_orderID, 4)}
                          />
                        </RowDiv>
                      </td>
                      <td>
                        <RowDiv>
                          <a
                            href={getOrderPageLink(
                              orderData?.exchange_flow.split('_')[1],
                              orderData?.xmr_tokenB_orderID,
                            )}
                            target={'_blank'}
                            rel="noreferrer"
                            className="underline"
                          >
                            {displayAddress(orderData?.xmr_tokenB_orderID, 4)}
                          </a>
                          <CopyButton
                            color="#F0DC62"
                            width="20px"
                            text={orderData?.xmr_tokenB_orderID}
                            tooltipMessage={displayAddress(orderData?.xmr_tokenB_orderID, 4)}
                          />
                        </RowDiv>
                      </td>
                    </tr>
                    <tr>
                      <td>Symbol</td>
                      <td>{orderData?.from_symbol}</td>
                      <td>{orderData?.to_symbol}</td>
                    </tr>
                    <tr>
                      <td>Amount</td>
                      <td>{orderData?.from_amount}</td>
                      <td>{orderData?.to_amount}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>
                        <RowDiv>
                          {displayAddress(orderData?.paying_address)}
                          <CopyButton
                            color="#F0DC62"
                            width="20px"
                            text={orderData?.paying_address}
                            tooltipMessage={displayAddress(orderData?.paying_address)}
                          />
                        </RowDiv>
                      </td>
                      <td>
                        <RowDiv>
                          {displayAddress(orderData?.to_address)}
                          <CopyButton
                            color="#F0DC62"
                            width="20px"
                            text={orderData?.to_address}
                            tooltipMessage={displayAddress(orderData?.to_address)}
                          />
                        </RowDiv>
                      </td>
                    </tr>
                    <tr>
                      <td>Exchange Flow</td>
                      <td>{getExchangeName(orderData?.exchange_flow.split('_')[0])}</td>
                      <td>{getExchangeName(orderData?.exchange_flow.split('_')[1])}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>{getStatus(orderData?.inStatus)}</td>
                      <td>{getStatus(orderData?.outStatus)}</td>
                    </tr>
                  </StyledTbody>
                </StyledTable>
              </>
            )}
            {tab === 'alert' && (
              <ManageAlert
                val={warningMsg}
                setVal={setWarningMsg}
                active={alertActive}
                setActive={setAlertActive}
                submit={(e) => handleUpdateWarningStatus(e)}
                loading={isLoading}
              />
            )}
            {tab === 'maintenance' && (
              <ManageMaintenance
                val={maintenanceMode}
                setVal={setMaintenanceMode}
                submit={(e) => handleUpdateMaintenance(e)}
                loading={isLoading}
              />
            )}
            {tab === 'apikeys' && <ApiKeysManagement keys={apiKeys} isLoading={isLoading} refresh={getApiKeys} />}
            {tab === 'feenix' && <GrootManagement />}
            {tab === 'widget' && <WidgetManagement />}
          </div>
        </div>
      </Flex>
    </Page>
  )
}

export default Manage
