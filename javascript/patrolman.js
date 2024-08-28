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

  currentRequestCount(site) {
    return parseInt(localStorage.getItem(`${site}RequestCount`), 10) || 0;
  }

  resetDailyCount() {
    const currentDate = new Date().toDateString() // Get current date as a string, ignoring time
    const lastResetDate = localStorage.getItem('lastResetDate')

    if (currentDate !== lastResetDate) {
        // Dates are different, so reset the count and update the last reset date
        Object.keys(this.urlMapping).forEach(site => { localStorage.setItem(`${site}RequestCount`, 0) })
        localStorage.setItem('lastResetDate', currentDate)
    }
  }

  incrementRequestCount(site) {
    resetDailyCount(); // Ensure count is reset if needed

    let currentCount = currentRequestCount(site)
    currentCount++;

    localStorage.setItem(`${site}RequestCount`, currentCount);
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

    const delay = Math.sqrt(Math.floor(currentRequestCount(site) / 50)) * 250; // Delay increases sublinearly
    incrementRequestCount(site)

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
