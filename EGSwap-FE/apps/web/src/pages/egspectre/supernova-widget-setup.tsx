import Page from 'views/Page'
import Head from 'next/head'

const Supernova: React.FC<React.PropsWithChildren> = () => {
  const iframeCode = `<iframe class="egspectre-widget" src="${window.location.origin}/egspectre/supernova-widget" frameborder="0" />`
  const cssCode = `<link rel='stylesheet' href='${window.location.origin}/libs/widget.css' />`

  return (
    <Page>
      <Head>
        <link rel="stylesheet" href="/libs/widget.css" />
      </Head>
      <div className="flex w-full flex-col px-[10%]">
        <div className="flex w-full justify-center">
          <div dangerouslySetInnerHTML={{ __html: iframeCode }} />
        </div>
        <span className="text-xl font-medium mt-10">Installation</span>
        <span className="text-gray-700">
          Follow the instructions bellow to install and activate the Supernova widget on your website.
        </span>
        <div
          className="bg-[#282a36] w-full p-6 mt-4 text-white rounded-md overflow-x-auto"
          style={{ lineHeight: '150%' }}
        >
          <span className="text-gray-500">#Paste this in the {'<head>'} section of you website</span>
          <br />
          {cssCode}
          <br />
          <br />
          <span className="text-gray-500">#Paste this where you want to display swap widget</span>
          <br />
          {iframeCode}
        </div>
      </div>
    </Page>
  )
}

Supernova.displayName = 'egspectre'

export default Supernova
