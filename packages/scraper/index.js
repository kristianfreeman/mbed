addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

const helpText =
  'pass ?url param to get page data back\n\nGET https://mbed.signalnerve.workers.dev/?url=https://egghead.io\n\n{\n  "title": "egghead.io",\n  "description": "Concise screencast video tutorials that cover the best tools, libraries, and frameworks that modern javascript web developers can use to code more effectively and stay current.",\n  "image": "https://res.cloudinary.com/dg3gyk0gu/image/upload/v1566948117/transcript-images/Eggo_Notext.png",\n  "url": "https://www.egghead.io"\n}\n\n-> wip, find source @ https://github.com/signalnerve/mbed'

const WHITELIST = [
  'description',
  'og:description',
  'og:image',
  'og:title',
  'og:type',
  'og:url',
  'twitter:card',
]

const elementToMetaTag = element => {
  const tag = {}
  const keys = ['name', 'property', 'content']
  keys.forEach(key => {
    const attr = element.getAttribute(key)
    if (attr) tag[key] = attr
  })
  return tag
}

const handleAPIRequest = async url => {
  const matches = []

  const metaHandler = {
    element: element => {
      if (element.tagName === 'meta') {
        const tag = elementToMetaTag(element)
        if (!!Object.keys(tag).length) matches.push(tag)
      }
    },
  }

  const titleHandler = {
    text: text => {
      matches.push({ name: '<title>', content: text.text })
    },
  }

  try {
    const rewriter = new HTMLRewriter()
      .on('meta', metaHandler)
      .on('title', titleHandler)
    await rewriter.transform(await fetch(url)).arrayBuffer()
    const whitelisted = matches.filter(({ property, name }) => {
      const key = property || name
      return WHITELIST.includes(key)
    })
    return whitelisted
  } catch (err) {
    console.log(err.message)
  }

  return matches
}

async function handleRequest({ request }) {
  try {
    const url = new URL(request.url)
    const scrapeUrl = url.searchParams.get('url')
    if (scrapeUrl) {
      const valueForKey = key => {
        const match = matches.find(m => m.property === key || m.name === key)
        return match ? match.content : null
      }
      const matches = await handleAPIRequest(scrapeUrl)
      return new Response(
        JSON.stringify({
          title: valueForKey('<title>') || valueForKey('og:title'),
          description:
            valueForKey('description') || valueForKey('og:description'),
          image: valueForKey('og:image'),
          url: valueForKey('og:url') || scrapeUrl,
        }),
        {
          headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    } else {
      return new Response(helpText)
    }
  } catch (err) {
    console.error(err)
    return new Response(err)
  }
}
