import * as termsOfService from './../config/terms-of-service.json'
import * as spectreTermsOfService from './../config/eg-spectre-terms-of-service.json'

const TermsOfService = () => {
  const allTerms: any = [termsOfService, spectreTermsOfService]
  const websitesUrls = ['https://egswap.exchange', 'https://egswap.exchange/terms-of-service']
  return (
    <div
      className="my-8"
      style={{
        fontFamily: 'Poppins',
      }}
    >
      {allTerms.map((site: any, idx: number) => (
        <div key={idx} className="max-w-2xl mx-auto p-4">
          <h1 className="text-4xl font-semibold mb-8">{site.title}</h1>
          <p className="mb-4 font-bold">Last modified: {site.lastModified.date}</p>
          <p className="mb-4">{site.lastModified.text}</p>
          {site.lastModified.notice && <p className="mb-4 font-bold">{site.lastModified.notice}</p>}
          {site.content.map((subtitle: any, idx: number) => (
            <div key={idx} className="mb-8">
              <h2 className="text-xl font-bold mb-2">{subtitle.title}</h2>
              {subtitle.paragraphs.map((p: any, idx: number) => (
                <p className="mb-3" key={idx}>
                  {p}
                </p>
              ))}
              {subtitle.bullets?.length > 0 ? (
                <ul>
                  {subtitle.bullets.map((b: any, idx: number) => (
                    <li className="mb-2" key={idx}>
                      {b}
                    </li>
                  ))}
                </ul>
              ) : (
                <></>
              )}
              {subtitle.extraParagraphs?.length > 0 ? (
                <ul>
                  {subtitle.extraParagraphs.map((p: any, idx: number) => (
                    <p className="mb-3" key={idx}>
                      {p}
                    </p>
                  ))}
                </ul>
              ) : (
                <></>
              )}
            </div>
          ))}
          <div className="mb-3"></div>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default TermsOfService
