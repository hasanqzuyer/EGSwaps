import { FC } from 'react'
import cn from 'classnames'

const partnersItems = [
  'PENCILS OF PROMISE',
  'GIVE INDIA',
  'CHAINLINK',
  'HRF',
  'OCEAN CLEANUP',
  'ACTION AGAINST HUNGER',
  'MALALA FUND',
  'GIVE INDIA',
  'BIG GREEN',
  'SALESFORCE',
  'CHILDREN INTERNATIONAL',
]

const ecosystemItems = [
  'Salesforce Exchange',
  'Gator Gang Collection',
  'EGSwap',
  'EG Social Impact Portal',
  'EG Blockchain Agency',
  'EGRamp',
  'NFT Staking Platform',
  'EGSpectre',
  'Perpetual Exchange',
  'Staking',
  'EG SmartRouter',
  'Futures Trading',
  'Liquidity Aggregator',
  'Revenue Sharing',
  'Pencils of Promise',
]

const ScrollGroup: FC<{ groupName: string; items: string[] }> = (props): JSX.Element => {
  const { groupName, items } = props

  const parseScrollContent = (list: string[]): JSX.Element[] => {
    return list.map((e, idx) => (
      <div
        className={cn(
          'rounded-[48px] py-3 px-5 mx-1 font-bold border-2 border-#27dfa8 border-solid text-base min-w-fit',
          {
            'bg-black text-[#27dfa8]': idx % 2 === 0,
            'bg-[#27dfa8] text-black': idx % 2 !== 0,
          },
        )}
      >
        {e}
      </div>
    ))
  }

  const firstList = items.slice(0, 10)
  const itemElementList = parseScrollContent(firstList)

  const scrollContainerClass =
    ' md:animate-scroll-horizontal animate-scroll-vertical  w-[335px] flex flex-wrap md:min-w-max justify-end md:flex-nowrap md:items-default items-center overflow-hidden md:overflow-visible md:w-full md:justify-start  mt-[60px] mb-[60px] min-h-full'
  //
  return (
    <div className="flex flex-col h-auto md:mt-5">
      <div className="text-[#727272] md:text-[#27dfa8] text-[32px] text-center font-bold h-auto">{groupName}</div>
      <div className="flex flex-col md:flex-row items-end relative gap-2 overflow-hidden h-[466px] md:h-auto md:justify-end">
        <div
          className="absolute top-[0px] left-0 w-full h-[100px] md:hidden z-1"
          style={{ background: 'linear-gradient(180deg, #000 37.86%, rgba(0, 0, 0, 0.00) 87.22%)' }}
        ></div>
        <div className={cn(scrollContainerClass, 'relative')}>{itemElementList}</div>
        <div
          className={cn(scrollContainerClass, `absolute bottom-[-588px] md:bottom-[-60px]`, {
            'md:left-[-3393px]': groupName === 'ECOSYSTEM',
            'md:left-[-3125px]': groupName !== 'ECOSYSTEM',
          })}
        >
          {itemElementList}
        </div>

        <div
          className="absolute bottom-[0px] left-0 w-full h-[100px] rotate-180 md:hidden z-1"
          style={{ background: 'linear-gradient(180deg, #000 37.86%, rgba(0, 0, 0, 0.00) 87.22%)' }}
        ></div>
      </div>
    </div>
  )
}

const EGTokenScroll: FC = () => {
  return (
    <div className="flex max-w-[1280px] md:w-full mt-[180px] md:mt-[60px] md:flex-col">
      <ScrollGroup groupName="ECOSYSTEM" items={ecosystemItems} />

      <div className="flex flex-col items-center mx-[50px] ">
        <span className="text-[#27dfa8] text-[48px] font-bold md:hidden">EG SWAP</span>
        <img src="/images/home2/coin2 1.png" className="mt-[140px md:w-[239px] md:mt-0" />
      </div>

      <ScrollGroup groupName="PARTNERS" items={partnersItems} />
    </div>
  )
}

export default EGTokenScroll
