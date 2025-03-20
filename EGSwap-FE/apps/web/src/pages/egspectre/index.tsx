import useIsMobile from 'hooks/useIsMobile'
import styled, { css } from 'styled-components'
import { useRouter } from 'next/router'
import Slider from 'react-slick'
import Head from 'next/head'

const gradientBorder = css`
  background: linear-gradient(to right, #a1f9d0, #66aefe);
  -webkit-background-clip: text;
  color: transparent;
  border-image: linear-gradient(to right, #a1f9d0, #66aefe);
  border-image-slice: 1;
`

const LaunchButton = styled.button`
  width: 263px;
  height: 62px;
  border: 3px solid #a1f9d0;
  border-radius: 31px !important;
  color: white;
  font-size: 20px;
  font-weight: 700;
  font-style: normal;
  transition: all 0.3s ease;
  &:hover {
    scale: 1.02;
  }
  &:active {
    scale: 1;
  }
`

const Spectre = () => {
  const { isMobile, isResponsive } = useIsMobile()
  const router = useRouter()
  const settings = {
    dots: true,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isResponsive ? 2 : 3,
    slidesToScroll: isMobile ? 1 : isResponsive ? 2 : 3,
    autoplay: true,
    // adaptiveHeight: true,
    // centerMode: true,
  }

  const openTgBot = () => window.open('https://t.me/EGSpectre_bot', '_blank')

  return (
    <>
      <Head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.js"></script>
      </Head>
      <div className="flex flex-col flex-1">
        <div
          className="h-[656px] w-full flex justify-center items-center bg-[url(/images/spectre/header.jpg)] md:bg-[url(/images/spectre/header-mobile.jpg)] md:h-[1044px] md:pt-[69px] md:items-start"
          style={{ backgroundSize: 'cover' }}
        >
          <div className="max-w-[1254px] w-full flex flex-col md:px-4">
            <span
              className="text-[62px] font-bold md:text-5xl md:text-center"
              style={{
                backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              EGSpectre
            </span>
            <span className="text-[48px] font-bold mt-2 text-white md:text-[32px] max-w-2xl md:text-center">
              Future of Financial Privacy on the Blockchain
            </span>

            <div className="flex flex-wrap gap-4 my-10 max-w-[670px] md:mx-auto md:justify-center">
              <img src="/images/spectre/icons/Algorand.png" alt="Algorand" />
              <img src="/images/spectre/icons/Aptos.png" alt="Aptos" />
              <img src="/images/spectre/icons/Arbitrum.png" alt="Arbitrum" />
              <img src="/images/spectre/icons/Avalanche.png" alt="Avalanche" />
              <img src="/images/spectre/icons/Beldex.png" alt="Beldex" />
              <img src="/images/spectre/icons/Binance Smart Chain.png" alt="Binance Smart Chain" />
              <img src="/images/spectre/icons/Bitcoin.png" alt="Bitcoin" />
              <img src="/images/spectre/icons/Cardano.png" alt="Cardano" />
              <img src="/images/spectre/icons/Cro.png" alt="Cro" />
              <img src="/images/spectre/icons/Doge.png" alt="Doge" />
              <img src="/images/spectre/icons/ETH.png" alt="ETH" />
              <img src="/images/spectre/icons/Fantom.png" alt="Fantom" />
              <img src="/images/spectre/icons/Litecoin.png" alt="Litecoin" />
              <img src="/images/spectre/icons/Monero.png" alt="Monero" />
              <img src="/images/spectre/icons/MultiversX.png" alt="MultiversX" />
              <img src="/images/spectre/icons/Polygon.png" alt="Polygon" />
              <img src="/images/spectre/icons/Ripple.png" alt="Ripple" />
              <img src="/images/spectre/icons/Solana.png" alt="Solana" />
              <img src="/images/spectre/icons/Sui.png" alt="Sui" />
              <img src="/images/spectre/icons/Tron.png" alt="Tron" />
            </div>
            <div className="flex gap-4 md:justify-center sm:flex-col sm:items-center">
              <LaunchButton onClick={() => router.push('/egspectre/swap')}>LAUNCH EGSPECTRE</LaunchButton>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center" style={{ background: 'url(/images/spectre/background1.jpg)' }}>
          <div className="max-w-[1254px] w-full flex flex-col py-[121px] items-center md:px-4">
            <span className="text-[60px] font-bold mt-2 text-[#242E60] md:text-center md:text-[48px]">
              The Blockchain Privacy Paradox
            </span>

            <div className="flex mt-[58px] md:flex-col">
              <div>
                <span className="text-lg text-[#0e1951]">
                  Blockchain technology heralds a new age in data transparency and decentralization, characterized by
                  its three main pillars: Immutability, Transparency, and Decentralization. However, with these benefits
                  come inherent challenges, particularly when it comes to preserving individual privacy.
                  <br />
                  <br />
                  In a blockchain landscape where every transaction is transparent, maintaining financial privacy
                  becomes paramount. Your crypto wallet, once exposed, can potentially reveal your balance, trading
                  behaviors, and much more. This transparency, although a significant blockchain strength, can be a
                  point of vulnerability, especially in the following scenarios.
                </span>
                <ul className="text-[#0e1951] space-y-3 mt-[60px] text-lg">
                  <li>Maintaining personal wealth privacy.</li>
                  <li>Keeping trade results confidential.</li>
                  <li>Making anonymous donations to socio-political causes.</li>
                  <li>Businesses wanting to protect their financial activities.</li>
                  <li>Individuals desiring discretion in gifting without revealing their net worth.</li>
                </ul>
              </div>
              <img src="/images/spectre/coins 1.png" className="mr-[60px] md:w-full md:mt-8" />
            </div>
          </div>
        </div>

        <div
          className="w-full flex justify-center"
          style={{ background: 'url(/images/spectre/Drawbacks.jpg)', backgroundSize: 'cover' }}
        >
          <div className="max-w-[1254px] w-full flex flex-col py-[121px] items-center md:px-4">
            <span className="text-[60px] font-bold mt-2 text-[#fff] leading-tight max-w-4xl text-center md:text-[48px]">
              Current Privacy Solutions and their Drawbacks
            </span>

            <Slider {...settings} className=" mt-[72px] gap-0 w-full space-x-[-50px] ml-[90px]">
              <div>
                <div
                  className="max-w-[373px] w-[373px] h-[578px] rounded-[24px] p-8 flex flex-col items-center bg-[linear-gradient(155deg, rgba(255, 255, 255, 0.00) -2.13%, rgba(255, 255, 255, 0.15) 136.58%)] py-8"
                  style={{
                    boxShadow: ' 0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                    backdropFilter: 'blur(9.07044506072998px',
                    border: '1.814px solid #30a1c7',
                  }}
                >
                  <span className="text-[36px] font-bold text-white">Solution 1</span>
                  <img src="/images/spectre/mixer.png" className="w-[210px] h-[209px] mt-11 mb-5" />
                  <span className="text-center text-lg text-[#fff]">
                    Unregulated and frequently illicit alternatives such as Mixers or Coinjoin.
                    <br />
                    <br />
                    <b>Risk:</b> Bad Press, Sanctions and Criminal charges.
                  </span>
                </div>
              </div>

              <div>
                <div
                  className="max-w-[373px] w-[373px] h-[578px] rounded-[24px] p-8 flex flex-col items-center bg-[linear-gradient(155deg, rgba(255, 255, 255, 0.00) -2.13%, rgba(255, 255, 255, 0.15) 136.58%)] py-8"
                  style={{
                    boxShadow: ' 0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                    backdropFilter: 'blur(9.07044506072998px',
                    border: '1.814px solid #30a1c7',
                  }}
                >
                  <span className="text-[36px] font-bold text-white">Solution 2</span>
                  <img src="/images/spectre/safe.png" className="w-[266px] h-[237px] mt-11 mb-5" />
                  <span className="text-center text-lg text-[#fff]">
                    Using a Central Exchange (CEX).
                    <br />
                    <br />
                    <b>Risk:</b> Extensive KYC, risk of funds getting lost/blocked, and remember, Not your keys, Not
                    your crypto.
                  </span>
                </div>
              </div>
              <div>
                <div
                  className="max-w-[373px] w-[373px] h-[578px] rounded-[24px] p-8 flex flex-col items-center bg-[linear-gradient(155deg, rgba(255, 255, 255, 0.00) -2.13%, rgba(255, 255, 255, 0.15) 136.58%)] py-8"
                  style={{
                    boxShadow: ' 0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                    backdropFilter: 'blur(9.07044506072998px',
                    border: '1.814px solid #30a1c7',
                  }}
                >
                  <span className="text-[36px] font-bold text-white">Solution 3</span>
                  <img src="/images/spectre/hack.png" className="w-[239px] h-[229px] mt-11 mb-5" />
                  <span className="text-center text-lg text-[#fff]">
                    Privacy Tokens like Monero & Zcash and other solutions like Mimblewimble, SideChains and Off-Chains
                    etc.
                    <br />
                    <br />
                    <b>Risk:</b> Complicated to use for the average user.
                  </span>
                </div>
              </div>
            </Slider>
          </div>
        </div>

        <div className="w-full flex justify-center" style={{ background: 'url(/images/spectre/background1.jpg)' }}>
          <div className="max-w-[1437px] w-full flex flex-col py-[121px] items-center md:px-4 md:py-[69px]">
            <div className="flex mt-[58px] md:flex-col">
              <div className="flex flex-col">
                <span className="text-[60px] font-bold mt-2 text-[#242E60] md:text-center md:text-[48px]">
                  Not another Tornado Cash
                </span>
                <span className="text-lg text-[#0e1951] mt-10">
                  Tornado Cash, a currency mixer, was a popular solution for many users for a number of years. A mixer
                  enhances privacy by mixing tokens from different users, making it harder to trace the source and
                  destination of transactions.
                  <br />
                  <br />
                  As a result, it became very attractive to cybercriminals seeking to launder money.{' '}
                  <b>On August 8, 2022, Tornado Cash was sanctioned by the U.S. Treasury (OFAC)</b> and eventually shut
                  down for failing to install sufficient controls to prevent it from laundering cash for harmful cyber
                  actors on a regular basis.
                  <br />
                  <br />
                  Due to its downfall, the mainstream narrative started associating “privacy” with “enabling criminal
                  activity” instead of highlighting the benefits to individuals. We are hoping to change this perception
                  with a compliant solution that prevents illicit activity and focuses on improving personal financial
                  privacy
                </span>
              </div>
              <img src="/images/spectre/torn-x2 1.png" />
            </div>
          </div>
        </div>

        <div
          className="w-full flex justify-center"
          style={{ background: 'url(/images/spectre/Our-opportunity.jpg)', backgroundSize: 'cover' }}
        >
          <div className="max-w-[650px] w-full flex flex-col py-[121px] items-center md:px-4  ">
            <span className="text-[60px] font-bold mt-2 text-[#fff] md:text-center md:text-[48px]">
              Our Opportunity
            </span>

            <div className="flex mt-[58px] text-center text-[22px] text-white">
              Tornado Cash mixed over $7.6 billion worth of Ether since its launch in August 2019.
              <br />
              <br />
              The daily volume reached over $100 Million consistently. It is estimated that almost 30% of the funds sent
              through it were tied to illicit actors.
              <br />
              <br />
              Now that it has been shut down:
              <br />
              Where does the 70% of legitimate demand go?
            </div>

            <div
              className="rounded-[22px] p-6 pt-[64px] mt-[100px] relative flex text-center text-white"
              style={{
                background: 'rgba(0, 0, 0, 0.10)',
                boxShadow: '0px 4.838px 59.26px 0px #000',
                backdropFilter: 'blur(9.07044506072998px)',
                border: '4px solid #FFF',
                textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                lineHeight: '171%',
              }}
            >
              If we assume a daily demand of $70 million for legitimate users seeking financial privacy, we would be
              able to get a 1% market share of that, even that is $700K of volume going through EGSpectre!
              <div className="absolute top-[-40px] left-0 w-full flex justify-center">
                <img src="/images/spectre/Ellipse 2081.svg" className="" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-full flex justify-center"
          style={{ background: 'url(/images/spectre/background1.jpg)', backgroundSize: 'cover' }}
        >
          <div className="max-w-[1254px] w-full flex flex-col py-[121px] items-center md:py-[69px]">
            <span className="text-[60px] font-bold mt-2 text-[#242E60] md:text-center md:text-[48px]">
              Announcing EGSpectre
            </span>
            <span className="text-[18px]  mt-2 text-[#0E1951E5] md:text-center">
              EGSpectre is a fully compliant solution to privacy on the blockchain.
            </span>

            <div className="flex mt-[58px] flex-wrap gap-9 justify-center ">
              <div
                className="h-[137px] w-[390px] px-8 rounded-[32px] bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 8.007px 8.007px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <span className="text-lg text-[#0e1951]">EGSpectre is NOT a currency mixer.</span>
              </div>
              <div
                className=" h-[137px] w-[390px] px-8 rounded-[32px] bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 8.007px 8.007px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <span className="text-lg text-[#0e1951]">
                  Automatically blocks any wallets belonging to sanctioned entities.
                </span>
              </div>
              <div
                className=" h-[137px] w-[390px] px-8 rounded-[32px] bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 8.007px 8.007px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <span className="text-lg text-[#0e1951]">Does not require user accounts.</span>
              </div>
              <div
                className=" h-[137px] w-[390px] px-8 rounded-[32px] bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 8.007px 8.007px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <span className="text-lg text-[#0e1951]">Does not accept payments from users.</span>
              </div>
              <div
                className=" h-[137px] w-[390px] px-8 rounded-[32px] bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 8.007px 8.007px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <span className="text-lg text-[#0e1951]">
                  Does not charge its users any fees. It receives commission from exchanges.
                </span>
              </div>
              <div
                className=" h-[137px] w-[390px] px-8 rounded-[32px] bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 8.007px 8.007px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <span className="text-lg text-[#0e1951]">
                  Is not a Market Maker nor does it own/utilize any liquidity pools.
                </span>
              </div>
              <div
                className=" h-[137px] w-[390px] px-8 rounded-[32px] bg-white flex items-center justify-center"
                style={{ boxShadow: '0px 8.007px 8.007px 0px rgba(0, 0, 0, 0.05)' }}
              >
                <span className="text-lg text-[#0e1951] text-center">Never retains possession of user funds.</span>
              </div>
            </div>

            <span className="text-[42px] font-bold mt-[80px] text-[#242E60] md:text-center">
              Cross-Chain Bridge . Private Transactions . Zero Gas Fees
            </span>

            <Slider {...settings} className="mt-[72px] gap-0 w-full space-x-[-30px] ml-[80px]">
              <div className="max-w-[373px]">
                <div
                  className="p-4 rounded-[24px] bg-white w-fit"
                  style={{
                    boxShadow: '0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                    backdropFilter: 'blur(9.07044506072998px)',
                  }}
                >
                  <img className="w-full" src="/images/spectre/swap.png" />
                </div>
              </div>
              <div className="max-w-[373px]">
                <div
                  className="p-4 rounded-[24px] bg-white  w-fit"
                  style={{
                    boxShadow: '0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                    backdropFilter: 'blur(9.07044506072998px)',
                  }}
                >
                  <img className="w-full" src="/images/spectre/Module 1.png" />
                </div>
              </div>
              <div className="max-w-[373px]">
                <div
                  className="p-4 rounded-[24px] bg-white w-fit"
                  style={{
                    boxShadow: '0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                    backdropFilter: 'blur(9.07044506072998px)',
                  }}
                >
                  <img className="w-full" src="/images/spectre/Module 2.png" />
                </div>
              </div>
            </Slider>

            <img src="/images/spectre/shadow.png" className="mt-[74px]" />

            <div
              className="rounded-[32px] p-8 text-[#0E1951E5] mt-[74px] mx-[183px] text-lg relative md:mx-4 md:pt-12"
              style={{
                background: 'linear-gradient(150deg, #FFF 0%, #EDF6F5 90.02%)',
                boxShadow: '0px 8.007px 8.007px 0px rgba(0, 0, 0, 0.05)',
              }}
            >
              Although EGSpectre scans and blocks wallets belonging to sanctioned entities, at the backend, it
              technically is a tunnel between exchanges and the legal risk sits with the exchange, not EGSpectre.
              <br />
              <br />
              In the absolute worst-case scenario of any legal issues which we cannot resolve immediately, EGSpectre is
              an add-on to the EGSwap and it can simply be turned off without effecting other parts of the DEX.
              <div className="absolute top-[-40px] left-[-40px] flex md:w-full md:justify-center md:left-0">
                <img src="/images/spectre/Ellipse 2081.svg" className="" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-full flex justify-center "
          style={{ background: 'url(/images/spectre/Drawbacks.jpg)', backgroundSize: 'cover' }}
        >
          <div className="max-w-[1254px] w-full flex flex-col py-[121px] items-center md:px-4 md:py-[69px]">
            <span className="text-[60px] font-bold mt-2 text-[#fff] md:text-center md:text-[48px]">
              How does it work?
            </span>
            <span className="text-[18px]  mt-2 text-[#fff] md:text-center">
              EGSpectre uses Private Cryptocurrencies* as a tunnel between exchanges.
            </span>
            <div className="flex mt-[72px] gap-[55px] flex-wrap justify-center">
              <div
                className="max-w-[373px] w-[373px] rounded-[24px] p-8 flex flex-col items-center bg-[linear-gradient(155deg, rgba(255, 255, 255, 0.00) -2.13%, rgba(255, 255, 255, 0.15) 136.58%)] py-8"
                style={{
                  boxShadow: ' 0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                  backdropFilter: 'blur(9.07044506072998px',
                  border: '1.814px solid #30a1c7',
                }}
              >
                <span className="text-[36px] font-bold text-white">Select</span>
                <img src="/images/spectre/touchscreen 1.svg" className="w-[114px] h-[114px] mt-11 mb-5" />
                <span className="text-center text-lg mt-10 text-white">
                  Pick the 2 tokens you want to exchange. i.e Ethereum ERC-20 to BNB Bep-20
                </span>
              </div>

              <div
                className="max-w-[373px] w-[373px] rounded-[24px] p-8 flex flex-col items-center bg-[linear-gradient(155deg, rgba(255, 255, 255, 0.00) -2.13%, rgba(255, 255, 255, 0.15) 136.58%)] py-8"
                style={{
                  boxShadow: ' 0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                  backdropFilter: 'blur(9.07044506072998px',
                  border: '1.814px solid #30a1c7',
                }}
              >
                <span className="text-[36px] font-bold text-white">Swap</span>
                <img src="/images/spectre/swap 1.svg" className="w-[114px] h-[114px] mt-11 mb-5" />
                <span className="text-center text-lg mt-10 text-white">
                  EGSpectre connects to Exchange 1 and swaps your crypto to a Private Crypto
                </span>
              </div>

              <div
                className="max-w-[373px] w-[373px] rounded-[24px] p-8 flex flex-col items-center bg-[linear-gradient(155deg, rgba(255, 255, 255, 0.00) -2.13%, rgba(255, 255, 255, 0.15) 136.58%)] py-8"
                style={{
                  boxShadow: ' 0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                  backdropFilter: 'blur(9.07044506072998px',
                  border: '1.814px solid #30a1c7',
                }}
              >
                <span className="text-[36px] font-bold text-white">Hop</span>
                <img src="/images/spectre/travel-insurance 1.svg" className="w-[114px] h-[114px] mt-11 mb-5" />
                <span className="text-center text-lg mt-10 text-white">
                  Your anonymous Private Crypto is sent from Exchange 1 to Exchange 2
                </span>
              </div>

              <div
                className="max-w-[373px] w-[373px] rounded-[24px] p-8 flex flex-col items-center bg-[linear-gradient(155deg, rgba(255, 255, 255, 0.00) -2.13%, rgba(255, 255, 255, 0.15) 136.58%)] py-8"
                style={{
                  boxShadow: ' 0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                  backdropFilter: 'blur(9.07044506072998px',
                  border: '1.814px solid #30a1c7',
                }}
              >
                <span className="text-[36px] font-bold text-white">Anonymize</span>
                <img src="/images/spectre/incognito 1.svg" className="w-[114px] h-[114px] mt-11 mb-5" />
                <span className="text-center text-lg mt-10 text-white">
                  Your Private Crypto on Exchange 2 is swapped to your desired receiving token
                </span>
              </div>

              <div
                className="max-w-[373px] w-[373px] rounded-[24px] p-8 flex flex-col items-center bg-[linear-gradient(155deg, rgba(255, 255, 255, 0.00) -2.13%, rgba(255, 255, 255, 0.15) 136.58%)] py-8"
                style={{
                  boxShadow: ' 0px 4.838px 59.26px 0px rgba(0, 7, 72, 0.12)',
                  backdropFilter: 'blur(9.07044506072998px',
                  border: '1.814px solid #30a1c7',
                }}
              >
                <span className="text-[36px] font-bold text-white">Collect</span>
                <img src="/images/spectre/eraser 1.svg" className="w-[114px] h-[114px] mt-11 mb-5" />
                <span className="text-center text-lg mt-10 text-white">
                  Your desired token is sent to the wallet of your choice and all links between sender and receiver are
                  erased.
                </span>
              </div>
            </div>

            <span className="text-sm text-white mt-[80px] mb-[60px] text-center">
              * Private Crypto means Cryptocurrencies like Monero, Verge & ZCash etc. Monero is used most often. It was
              launched in 2014 & is a Top 50 ranked decentralized and confidential cryptocurrency. Thanks to its
              privacy-boosting mechanisms, external observers are unable to differentiate between addresses engaged in
              Monero transactions, the quantities being transacted, address balances, or transaction history.
            </span>
          </div>
        </div>

        <div className="w-full flex justify-center" style={{ background: 'url(/images/spectre/background1.jpg)' }}>
          <div className="max-w-[1254px] w-full flex flex-col py-[121px] items-center md:px-4 md:py-[69px]">
            <span className="text-[60px] font-bold mt-2 text-[#242E60] md:text-center md:text-[48px]">
              Supported Chains
            </span>
            <div className="flex flex-wrap gap-4 mt-[75px] max-w-[620px] justify-center">
              <img src="/images/spectre/icons/Algorand.png" alt="Algorand" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Aptos.png" alt="Aptos" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Arbitrum.png" alt="Arbitrum" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Avalanche.png" alt="Avalanche" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Beldex.png" alt="Beldex" className="w-[55px] h-[55px]" />
              <img
                src="/images/spectre/icons/Binance Smart Chain.png"
                alt="Binance Smart Chain"
                className="w-[55px] h-[55px]"
              />
              <img src="/images/spectre/icons/Bitcoin.png" alt="Bitcoin" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Cardano.png" alt="Cardano" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Cro.png" alt="Cro" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Doge.png" alt="Doge" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/ETH.png" alt="ETH" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Fantom.png" alt="Fantom" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Litecoin.png" alt="Litecoin" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Monero.png" alt="Monero" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/MultiversX.png" alt="MultiversX" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Polygon.png" alt="Polygon" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Ripple.png" alt="Ripple" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Solana.png" alt="Solana" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Sui.png" alt="Sui" className="w-[55px] h-[55px]" />
              <img src="/images/spectre/icons/Tron.png" alt="Tron" className="w-[55px] h-[55px]" />
            </div>
          </div>
        </div>

        <div
          className="w-full flex justify-center "
          style={{ background: 'url(/images/spectre/Drawbacks.jpg)', backgroundSize: 'cover' }}
        >
          <div className="max-w-[1254px] w-full flex flex-col py-[121px] items-center md:px-4">
            <span className="text-[60px] font-bold mt-2 text-[#fff] md:text-center md:text-[48px]">
              Frequently Asked Questions
            </span>

            <div className="flex flex-col gap-3 mt-[60px]" id={'accordion-collapse'} data-accordion="collapse">
              {[
                [
                  'How does EGSPectre Work?',
                  `EGSpectre utilizes the Private blockchains for the purpose of enhancing the privacy of your transactions. The process involves an automated sequence: it begins by converting your chosen input currency to a Private Crypto on one exchange, then subsequently transfers this Private Crypto to a different exchange where it is traded into your desired receiving currency. Since Private Crypto operate on an anonymous blockchain, the simple action of moving them from one exchange to another effectively severs the connection between the sender's and receiver's wallets.
              <br><br>The fundamental essence of EGSpectre lies in its role as a collector of top-tier non-custodial exchanges. Once a User Swap Request is initiated, the platform takes charge of directing these requests to non-custodial instant exchanges that are renowned for their quality.
              <br><br>It's crucial to note that EGSpectre maintains a strict stance of non-involvement when it comes to users' Digital Currency. At no juncture do we gain access to users' digital holdings. The company refrains from intervening in user transactions, abstains from receiving user deposits, avoids handling user funds, and does not impose any fees on user transactions.`,
                ],
                [
                  'Does EGSpectre Charge any fees?',
                  `
              EGSpectre extends its services to users free of charge. The platform generates income by securing a commission from the exchange to which it refers users. Importantly, this commission is subtracted from the exchange's spread, without imposing any additional cost on users who opt for EGSpectre over engaging directly with a partner exchange.
              
              `,
                ],
                [
                  `Do I have to send the exact funds to the wallet shown?
              Can I send less or more?`,
                  `You have to send the exact funds to the wallet shown otherwise your transaction will not be processed. If you make a mistake or send incorrect funds, don't worry, they are most likely not lost. Raise a ticket in Discord and our admins can help track the transaction for you to help recover your funds. But to save time for everyone, ensure you send the correct amount of tokens to the wallet shown.`,
                ],
                [
                  `Do you need to connect your Web3 wallet to EGSpectre in order
                to initiate a transaction?`,
                  `Absolutely not. EGSpectre operates without the necessity of connecting a wallet to facilitate transactions. The process is incredibly simple: select a currency pair, designate a recipient wallet address, and dispatch your funds to the EGSpectre wallet address. Wait for the magic to happen. It really is that simple.`,
                ],
                [
                  `Does EGSpectre have Know Your Customer (KYC) and Anti Money Laundering (AML) obligations?`,
                  `EGSpectre automatically blocks any wallets belonging to sanctioned entities.
                <br>
                <br>

                <div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                  <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                  </svg>
                  <span class="sr-only">Info</span>
                  <div>
                  Sanctioned entities refer to entities listed on economic/trade embargo lists, such as by the US, EU, or UN, with which anyone subject to those jurisdictions is prohibited from dealing. This includes the Specially Designated Nationals (SDN) list of the US Department of the Treasury’s Office of Foreign Assets Control (OFAC). EGSpectre checks our internal database, the SDN list, and many other third-party data providers to block wallets known to carry out illicit trading.
                  </div>
                </div>
                <br>
                Additionally, EGSpectre transactions adhere to a non-KYC approach; nevertheless, concealed within the system are automated filters that function to prevent any illicit undertakings within the platform. These filters, overseen by our partnered exchanges, are synonymous with Anti-Money Laundering (AML) protocols.
                <br><br>
                Should a transaction raise concerns regarding potential criminal involvement, the exchange partners might necessitate supplementary information in accordance with their KYC/AML regulations.
                <br><br>
                In the improbable occurrence of such an event, EGSpectre will undertake one of two actions: either connect you with the exchange partner for resolution or defer to the exchange partner's preferred remedial procedure.`,
                ],
                [
                  `I sent my funds but now it shows the status as ‘Order Expired’.
                Is my capital at risk?`,
                  `No. Your funds are safe. Contact us and we will happily look into this for you`,
                ],
                [
                  `My EGSpectre Order status shows that my order is completed, but funds were not received?`,
                  `Sometimes, due to network congestion, your transaction may be "pending" and stuck in a queue to get processed. Firstly, open up your wallet in BscScan or EtherScan (or whatever chain you are transacting on) and check your transaction history. If you see a "pending transaction", this is most likely a network delay or gas issue which will resolve itself in time. If you do not see such a pending transaction, contact us, and will will look into this for you.`,
                ],
              ].map((item, i) => (
                <div className="w-[847px] md:w-full bg-white rounded-[18px]">
                  <h2 id={'accordion-collapse-heading-' + (i + 1)}>
                    <button
                      type="button"
                      className="flex items-center justify-between text-[20px] text-left w-full p-5 rtl:text-right text-[#0E1951E5]  rounded-t-[18px]  gap-3 font-bold"
                      data-accordion-target={'#accordion-collapse-body-' + (i + 1)}
                      aria-expanded="true"
                      aria-controls={'accordion-collapse-body-' + (i + 1)}
                    >
                      <span>{item[0]}</span>
                      <svg
                        data-accordion-icon
                        className="w-3 h-3 rotate-180 shrink-0"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5 5 1 1 5"
                        />
                      </svg>
                    </button>
                  </h2>
                  <div
                    id={'accordion-collapse-body-' + (i + 1)}
                    className="hidden"
                    aria-labelledby={'accordion-collapse-heading-' + (i + 1)}
                  >
                    <div
                      className="p-5 text-[#0E1951E5]"
                      style={{ lineHeight: '135%' }}
                      dangerouslySetInnerHTML={{ __html: item[1] }}
                    >
                      {}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Spectre
