const urlMapping = {
  twitter: {
    domains: ["x.com", "pbs.twimg.com", "video.twimg.com"],
    urls: ["*://*.x.com/*", "*://*.twimg.com/*"]
  },
  reddit: {
    domains: ["www.reddit.com", "alb.reddit.com", "external-preview.redd.it", "www.redditstatic.com", "preview.redd.it", "v.redd.it", "b.thumbs.redditmedia.com"],
    urls: ["https://*.reddit.com/*", "*://*redditstatic.com/*", "*://*preview.redd.it/*", "*://*redd.it/*", "*://*b.thumbs.redditmedia.com/*"]
  }
}

class Settings {
  castBoolean(val) {
    return val?.toLowerCase() === 'true'
  }

  get slowTwitter() {
    return this.castBoolean(localStorage.getItem('slowTwitter'))
  }

  set slowTwitter(val) {
    localStorage.setItem('slowTwitter', val)
  }

  get slowReddit() {
    return this.castBoolean(localStorage.getItem('slowReddit'))
  }

  set slowReddit(val) {
    localStorage.setItem('slowReddit', val)
  }
}

function resetDailyCount() {
  const currentDate = new Date().toDateString() // Get current date as a string, ignoring time
  const lastResetDate = localStorage.getItem('lastResetDate')

  if (currentDate !== lastResetDate) {
      // Dates are different, so reset the count and update the last reset date
      Object.keys(urlMapping).forEach(site => { localStorage.setItem(`${site}RequestCount`, 0) })
      localStorage.setItem('lastResetDate', currentDate)
  }
}

function incrementRequestCount(site) {
  resetDailyCount(); // Ensure count is reset if needed before incrementing

  let currentCount = currentRequestCount(site)
  currentCount++;

  localStorage.setItem(`${site}RequestCount`, currentCount);
}

function currentRequestCount(site) {
  return parseInt(localStorage.getItem(`${site}RequestCount`), 10) || 0;
}

const settings = new Settings()

function delayRequest(requestDetails) {
    if (requestDetails.method !== "GET") {
      return; // If not a GET request, do nothing
    }

    let url = new URL(requestDetails.url)
    let domain = url.hostname;
    let site = null

    Object.entries(urlMapping).forEach(([key, value]) => {
      if(value.domains.includes(domain)) {
        site = key
      }
    })

    if(!site) { return }

    const delay = Math.sqrt(Math.floor(currentRequestCount(site) / 50)) * 250; // Delay increases sublinearly
    incrementRequestCount(site)

    return new Promise((resolve) => setTimeout(() => resolve({}), delay))
}

let urls = []

if(settings.slowReddit) {
  urls.push(...urlMapping.reddit.urls)
}

if(settings.slowTwitter) {
  urls.push(...urlMapping.twitter.urls)
}

// Listen for beforeRequest and potentially delay it
browser.webRequest.onBeforeRequest.addListener(
    delayRequest,
    { urls: urls },
    ["blocking"]
);
