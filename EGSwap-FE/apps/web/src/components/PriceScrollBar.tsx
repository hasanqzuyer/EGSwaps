export const PriceScrollBar = () => {
  return (
    <div
      id="cr-widget-marquee"
      data-coins="eg-token,monero,bitcoin,ethereum,ripple,bnb,solana,cardano,dogecoin,chainlink,baby-doge-coin,matic-network,floki,litecoin,avalanche,polkadot,shiba-inu"
      data-theme="dark"
      data-show-symbol="true"
      data-show-icon="true"
      data-show-period-change="true"
      data-period-change="24H"
      data-api-url="https://api.cryptorank.io/v0"
      style={{ marginTop: '50px', paddingTop: '4px', backgroundColor: '#161B20' }}
    >
      <a href="https://cryptorank.io">Coins by Cryptorank</a>
      <script src="https://cryptorank.io/widget/marquee.js"></script>
    </div>
  )
}
