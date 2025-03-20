import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Poppins');
@import url('https://fonts.googleapis.com/css?family=Rubik');

  * {
    font-family: 'Poppins', sans-serif !important;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
  }

  #__next {
    position: relative;
    z-index: 1;
  }

  #portal-root {
    position: relative;
    z-index: 2;
  }

  --azureish-white: #ddebef;
  --beau-blue: #b9d9eb;
  --black-russian: #23262f;
  --blue-bolt: #00aeff;
  --blue-jeans: #64acff;
  --bright-gray: #e3e7ef;
  --bubbly: #79cfff;
  --catalina-blue: #011e72;
  --cetacean-blue: #160651;
  --chinese-silver: #cbcbcb;
  --crystal-blue: #6b96b3;
  --cultured: #f6f6f5;
  --dark-imperial-blue: #001c71;
  --dark-orchid: #942ccb;
  --fresh-blue: #8bdde2;
  --gold-foil: #c69c14;
  --indigo-rainbow: #242e60;
  --lincoln-green: #1e4e0e;
  --maastricht-blue: #08132f;
  --medium-aquamarine: #75e1b4;
  --medium-blue: #0008d4;
  --mint-cream: #f5faf9;
  --mist: #edf6f5;
  --naples-yellow: #f9d75e;
  --oxford-blue: #0e1951;
  --pale-cerulean: #97c1d9;
  --pale-sky: #c2e8fd;
  --peach: #ffebb5;
  --rackley: #5b8aab;
  --ripe-mango: #f9c722;
  --space-blue: #22326e;
  --ultramarine-blue: #3b5afa;
  --yellow-munsell: #f0c308;

  --font-title: 'Poppins', sans-serif;
  --font-body: 'Barlow', sans-serif;


  .slick-dots li{
    width: 18px;
    height: 18px;
    background: #109ec7;
    border-radius: 100%;
  }

  .slick-dots {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .slick-dots li.slick-active{
    background: transparent !important;
    border: 2px solid #109ec7;
  }

  .slick-dots li button::before{
    content: none !important;
    visibility: hidden;
  }
`

export default GlobalStyle
