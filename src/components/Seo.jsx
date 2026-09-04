import { Helmet } from 'react-helmet-async'

const SITE = 'https://atcfootball.com'

export default function Seo({ title, description, path = '/', image = '/img/hero-action.jpg', schema }) {
  const full = title ? `${title} | ATC Sports` : 'ATC Sports | Youth Flag Football & 7v7 in Roseville, CA'
  const url = `${SITE}${path}`
  const img = `${SITE}${image}`

  return (
    <Helmet prioritizeSeoTags>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ATC Sports" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}
