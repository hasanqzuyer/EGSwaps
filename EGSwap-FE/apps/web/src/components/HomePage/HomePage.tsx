import React from 'react'
import styled from 'styled-components'
import Benefits from './Benefits'
import Buy from './Buy'
import Hero from './Hero'

const Container = styled.div`
  width: 100%;
  background-color: #f5f5f5;
`

const HomePage: React.FC = () => {
  return (
    <Container>
      <Hero />
      <Benefits />
      <Buy />
    </Container>
  )
}

export default HomePage
