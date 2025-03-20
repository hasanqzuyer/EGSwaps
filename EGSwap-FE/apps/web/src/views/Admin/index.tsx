import 'react-calendar/dist/Calendar.css'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { RemoveIcon, AddIcon, PencilIcon, CheckmarkIcon } from '@pancakeswap/uikit'
import { ADS_EG_API } from 'config/constants/endpoints'

const Container = styled.div`
  width: 100%;
  height: auto;
  overflow: cursor;
  display: flex;
  padding: 50px 100px;
  flex-wrap: wrap;

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 40px;
    width: 100%;
    margin: 0px 40px;
  }

  .sections {
    width: 100%;

    .subtitle {
      margin: 50px 0px;
      text-align: left;
      font-weitght: bolder;
      font-size: 20px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      gap: 10px 10px;
      align-items: center;
    }

    .items {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      justify-content: start;
      gap: 40px 10px;

      .item {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: left;
        gap: 20px 20px;
        width: 31%;

        img {
          width: 80%;
          height: 120px;
        }
        span {
          font-size: 100%;
          padding: 0px 0px;
        }
        p {
          font-size: 10px;
        }
        svg {
          align-self: flex-start;
        }
      }
    }
  }
`

const Admin = () => {
  const [adverts, setAdverts] = useState([])
  const [selectedFileAdvert, setSelectedFileAdvert] = useState(null)
  const [advertImagePreview, setAdvertImagePreview] = useState(null)
  const [currentEditAdvert, setCurrentEditAdvert] = useState(null)
  const [advertLink, setAdvertLink] = useState('')
  const [advertExpirationDate, setAdvertExpirationDate] = useState('')
  const [newAdvertExpirationDate, setNewAdvertExpirationDate] = useState('')
  const [newAdvertLink, setNewAdvertLink] = useState('')

  const [promotions, setPromotions] = useState([])
  const [selectedFilePromotion, setSelectedFilePromotion] = useState(null)
  const [promotionImagePreview, setPromotionImagePreview] = useState(null)
  const [currentEditPromotion, setCurrentEditPromotion] = useState(null)
  const [promotionLink, setPromotionLink] = useState('')
  const [promotionExpirationDate, setPromotionExpirationDate] = useState('')
  const [newPromotionExpirationDate, setNewPromotionExpirationDate] = useState('')
  const [newPromotionLink, setNewPromotionLink] = useState('')

  const FULL_API_URL = `${ADS_EG_API}/api/v1/images`
  const API_URL = `${ADS_EG_API}`
  useEffect(() => {
    reloadAdverts()
    reloadPromotions()
  }, [])

  // Adverts
  const reloadAdverts = () => {
    setAdverts([])
    axios
      .get(`${FULL_API_URL}/adverts`)
      .then((response) => setAdverts(response.data))
      .catch((error) => {
        setAdverts([])
        console.error('Error fetching data:', error)
        return
      })
  }

  const removeAdvert = (idx: number) => {
    if (idx !== null) {
      const advert = adverts[idx]
      axios
        .delete(`${FULL_API_URL}/adverts/${advert.id}`)
        .then(() => reloadAdverts())
        .catch((error) => {
          console.error('Error removing data:', error)
          return
        })
    } else {
      setAdvertImagePreview(null)
      setAdvertLink('')
    }
  }

  const handleFileAdvertChange = (event) => {
    setSelectedFileAdvert(event.target.files[0])
    const reader = new FileReader()
    reader.onload = (e) => {
      setAdvertImagePreview(e.target.result)
    }
    reader.readAsDataURL(event.target.files[0])
  }

  const createAdvert = async () => {
    const formData = new FormData()
    formData.append('file', selectedFileAdvert)
    formData.append('data', JSON.stringify({ link: newAdvertLink, expirationDate: newAdvertExpirationDate }))
    await axios.post(`${FULL_API_URL}/adverts`, formData)

    setSelectedFileAdvert(null)
    setCurrentEditAdvert(null)
    setAdvertImagePreview(null)
    setNewAdvertExpirationDate('')
    setAdvertLink(null)
    setNewAdvertLink(null)
    reloadAdverts()
  }

  const saveAdvert = async (idx: number) => {
    const editedAdvert = adverts[idx]
    if (editedAdvert.link !== advertLink || editedAdvert.expirationDate !== advertExpirationDate) {
      console.log(advertLink, advertExpirationDate)
      axios
        .put(`${FULL_API_URL}/adverts/${adverts[idx].id}`, {
          link: advertLink,
          expirationDate: advertExpirationDate,
        })
        .then((response) => {
          setCurrentEditAdvert(null)
          reloadAdverts()
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          return
        })
    } else {
      setCurrentEditAdvert(null)
      setAdvertExpirationDate('')
      setAdvertLink('')
    }
  }

  // Promotions
  const reloadPromotions = () => {
    axios
      .get(`${FULL_API_URL}/promotions`)
      .then((response) => setPromotions(response.data))
      .catch((error) => {
        console.error('Error fetching data:', error)
        return
      })
  }

  const removePromotion = (idx: number) => {
    if (idx !== null) {
      const promotion = promotions[idx]
      axios
        .delete(`${FULL_API_URL}/promotions/${promotion.id}`)
        .then(() => reloadPromotions())
        .catch((error) => {
          console.error('Error removing data:', error)
          return
        })
    } else {
      setPromotionImagePreview(null)
      setPromotionLink('')
    }
  }

  const handleFilePromotionChange = (event) => {
    setSelectedFilePromotion(event.target.files[0])
    const reader = new FileReader()
    reader.onload = (e) => {
      setPromotionImagePreview(e.target.result)
    }
    reader.readAsDataURL(event.target.files[0])
  }

  const createPromotion = async () => {
    const formData = new FormData()
    formData.append('file', selectedFilePromotion)
    formData.append('data', JSON.stringify({ link: newPromotionLink, expirationDate: newPromotionExpirationDate }))
    await axios.post(`${FULL_API_URL}/promotions`, formData)

    setSelectedFilePromotion(null)
    setCurrentEditPromotion(null)
    setPromotionImagePreview(null)
    setNewPromotionExpirationDate('')
    setPromotionLink(null)
    setNewPromotionLink(null)
    reloadPromotions()
  }

  const savePromotion = async (idx: number) => {
    const editedPromotion = promotions[idx]
    if (editedPromotion.link !== promotionLink || editedPromotion.expirationDate !== promotionExpirationDate) {
      axios
        .put(`${FULL_API_URL}/promotions/${editedPromotion.id}`, {
          link: promotionLink,
          expirationDate: promotionExpirationDate,
        })
        .then((response) => {
          setCurrentEditPromotion(null)
          reloadPromotions()
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          return
        })
    } else {
      setCurrentEditPromotion(null)
      setPromotionExpirationDate('')
      setPromotionLink('')
    }
  }

  console.log(adverts)

  return (
    <Container>
      <div className="title">Admin Panel</div>
      {/* Adverts */}
      <div className="sections">
        <div className="subtitle">
          Manage Adverts
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <AddIcon style={{ cursor: 'pointer' }} />
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileAdvertChange}
              style={{
                opacity: '0',
                position: 'absolute',
                left: '0px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
        <div className="items">
          {(adverts && adverts.length) || advertImagePreview ? (
            adverts.map((e, idx) => (
              <div className="item advert" key={idx}>
                <img src={e.base64Img} alt="carousel" />
                {currentEditAdvert === idx ? (
                  <input
                    placeholder="Link to advert"
                    onChange={(e) => setAdvertLink(e.target.value)}
                    value={advertLink}
                    style={{
                      padding: '8px 0px',
                      backgroundColor: 'transparent',
                      borderBottom: '1px solid #213266',
                      marginBottom: '4px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <span> Link: {e.link}</span>
                )}
                {currentEditAdvert === idx ? (
                  <input
                    type="date"
                    placeholder="Expiration Date"
                    onChange={(e) => setAdvertExpirationDate(e.target.value)}
                    value={advertExpirationDate}
                    style={{
                      padding: '8px 0px',
                      backgroundColor: 'transparent',
                      borderBottom: '1px solid #213266',
                      marginBottom: '4px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <span> Expiration Date: {e.expirationDate}</span>
                )}
                <span> Views: {e.views || 0}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0px 40px' }}>
                  <RemoveIcon
                    onClick={() => removeAdvert(idx)}
                    scale="sm"
                    className="hover:scale-105 cursor-pointer"
                  ></RemoveIcon>

                  {currentEditAdvert === idx ? (
                    <CheckmarkIcon onClick={() => saveAdvert(idx)} className="hover:scale-105 cursor-pointer" />
                  ) : (
                    <PencilIcon
                      onClick={() => {
                        setCurrentEditAdvert(idx)
                        setAdvertLink(adverts[idx].link)
                        setAdvertExpirationDate(adverts[idx].expirationDate)
                      }}
                      scale="sm"
                      className="hover:scale-105 cursor-pointer"
                    ></PencilIcon>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="item promotion">No adverts</div>
          )}
          {advertImagePreview && (
            <div className="item advert">
              <img src={advertImagePreview} alt="carousel" />
              <input
                placeholder="Link to advert"
                onChange={(e) => setNewAdvertLink(e.target.value)}
                value={newAdvertLink}
                style={{
                  padding: '8px 0px',
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid #213266',
                  marginBottom: '4px',
                  outline: 'none',
                }}
              />
              <input
                type="date"
                placeholder="Expiration Date"
                onChange={(e) => setNewAdvertExpirationDate(e.target.value)}
                value={newAdvertExpirationDate}
                style={{
                  padding: '8px 0px',
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid #213266',
                  marginBottom: '4px',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0px 40px' }}>
                <RemoveIcon onClick={() => removeAdvert(null)} scale="sm" className="hover:scale-105"></RemoveIcon>
                <CheckmarkIcon onClick={() => createAdvert()} className="hover:scale-105 cursor-pointer" />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Promotions */}
      <div className="sections">
        <div className="subtitle">
          Manage Promotions
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <AddIcon style={{ cursor: 'pointer' }} />
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFilePromotionChange}
              style={{
                opacity: '0',
                position: 'absolute',
                left: '0px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
        <div className="items">
          {(promotions && promotions.length) || promotionImagePreview ? (
            promotions.map((e, idx) => (
              <div className="item promotion" key={idx}>
                <img src={e.base64Img} alt="carousel" />
                {currentEditPromotion === idx ? (
                  <input
                    placeholder="Link to promotion"
                    onChange={(e) => setPromotionLink(e.target.value)}
                    value={promotionLink}
                    style={{
                      padding: '8px 0px',
                      backgroundColor: 'transparent',
                      borderBottom: '1px solid #213266',
                      marginBottom: '4px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <span> Link: {e.link}</span>
                )}
                {currentEditPromotion === idx ? (
                  <input
                    type="date"
                    placeholder="Expiration Date"
                    onChange={(e) => setPromotionExpirationDate(e.target.value)}
                    value={promotionExpirationDate}
                    style={{
                      padding: '8px 0px',
                      backgroundColor: 'transparent',
                      borderBottom: '1px solid #213266',
                      marginBottom: '4px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <span> Expiration Date: {e.expirationDate}</span>
                )}
                <span> Views: {e.views || 0}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0px 40px' }}>
                  <RemoveIcon
                    onClick={() => removePromotion(idx)}
                    scale="sm"
                    className="hover:scale-105 cursor-pointer"
                  ></RemoveIcon>

                  {currentEditPromotion === idx ? (
                    <CheckmarkIcon onClick={() => savePromotion(idx)} className="hover:scale-105 cursor-pointer" />
                  ) : (
                    <PencilIcon
                      onClick={() => {
                        setCurrentEditPromotion(idx)
                        setPromotionLink(promotions[idx].link)
                        setPromotionExpirationDate(promotions[idx].expirationDate)
                      }}
                      scale="sm"
                      className="hover:scale-105 cursor-pointer"
                    ></PencilIcon>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="item promotion">No promotions</div>
          )}
          {promotionImagePreview && (
            <div className="item promotion">
              <img src={promotionImagePreview} alt="carousel" />
              <input
                placeholder="Link to promotion"
                onChange={(e) => setNewPromotionLink(e.target.value)}
                value={newPromotionLink}
                style={{
                  padding: '8px 0px',
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid #213266',
                  marginBottom: '4px',
                  outline: 'none',
                }}
              />
              <input
                type="date"
                placeholder="Expiration Date"
                onChange={(e) => setNewPromotionExpirationDate(e.target.value)}
                value={newPromotionExpirationDate}
                style={{
                  padding: '8px 0px',
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid #213266',
                  marginBottom: '4px',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0px 40px' }}>
                <RemoveIcon onClick={() => removePromotion(null)} scale="sm" className="hover:scale-105"></RemoveIcon>
                <CheckmarkIcon onClick={() => createPromotion()} className="hover:scale-105 cursor-pointer" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export default Admin
