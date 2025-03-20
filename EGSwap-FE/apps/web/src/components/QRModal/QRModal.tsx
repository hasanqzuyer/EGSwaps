import styled from 'styled-components'
import { Button } from '@pancakeswap/uikit'
import Dialog from '@mui/material/Dialog'

interface QRModalProps {
  open: boolean
  src: string
  closeModal: () => void
}

const ModalTitle = styled.span`
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 1.5;
`
const QRImage = styled.img`
  width: 100%;
  margin: 20px 0;
`
const CloseButton = styled(Button)`
  background-color: #f0dc62;
  width: 160px;
  height: 40px;
  border-radius: 20px;
  color: black;
  font-size: 14px;
  margin: 20px auto 0;
`

export default function QRModal({ open, src, closeModal }: QRModalProps) {
  return (
    <Dialog
      open={open}
      onClose={closeModal}
      PaperProps={{
        style: {
          backgroundColor: '#222a',
          backdropFilter: 'blur(6px)',
          maxWidth: '375px',
          width: '100%',
          border: '1px solid #fff4',
          padding: '20px'
        },
      }}
      transitionDuration={0}
    >
      <ModalTitle>Address QR Code (scan in your Wallet app)</ModalTitle>
      <QRImage src={src} alt="qr" />
      <CloseButton onClick={closeModal}>Close</CloseButton>
    </Dialog>
  )
}
