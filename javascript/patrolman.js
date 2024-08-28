import Settings from "./settings.js"

export default class Patrolman {
  constructor () {
    this.settings = new Settings()
    this.urls = []

    if(this.settings.slowReddit) {
      this.urls.push(...this.urlMapping.reddit.urls)
    }

    if(this.settings.slowTwitter) {
      this.urls.push(...this.urlMapping.twitter.urls)
    }
  }

  delayRequest(requestDetails) {
    if (requestDetails.method !== "GET") {
      return; // If not a GET request, do nothing
    }

    let url = new URL(requestDetails.url)
    let domain = url.hostname;
    let site = null

    Object.entries(this.urlMapping).forEach(([key, value]) => {
      if(value.domains.includes(domain)) {
        site = key
      }
    })

    if(!site) { return }

    const delay = this.settings.delayFor(site)
    this.settings.incrementRequestCount(site)

    return new Promise((resolve) => setTimeout(() => resolve({}), delay))
  }

  get urlMapping() {
    return {
      twitter: {
        domains: ["x.com", "pbs.twimg.com", "video.twimg.com"],
        urls: ["*://*.x.com/*", "*://*.twimg.com/*"]
      },
      reddit: {
        domains: ["www.reddit.com", "alb.reddit.com", "external-preview.redd.it", "www.redditstatic.com", "preview.redd.it", "v.redd.it", "b.thumbs.redditmedia.com"],
        urls: ["https://*.reddit.com/*", "*://*redditstatic.com/*", "*://*preview.redd.it/*", "*://*redd.it/*", "*://*b.thumbs.redditmedia.com/*"]
      }
    }
  }
}
