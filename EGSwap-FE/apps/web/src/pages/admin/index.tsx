import { useState, useEffect } from 'react'
import axios from 'axios'
import Admin from '../../views/Admin'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const AdminPage = () => {
  const [isLogged, setLogged] = useState(false)
  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (account) {
      axios
        .post('/api/images/admin', { wallet: account })
        .then((response) => {
          const resp = response.data
          if (resp.allowed) {
            setLogged(response.data)
          } else {
            window.location.href = '/'
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          return
        })
    }
  }, [account])

  if (!account) {
    return <div>User not connected to wallet</div>
  }

  if (isLogged) {
    return <Admin />
  }

  return <div>Loading user</div>
}

export default AdminPage
