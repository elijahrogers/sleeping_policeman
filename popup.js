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

function currentRequestCount(site) {
  return parseInt(localStorage.getItem(`${site}RequestCount`), 10) || 0;
}

async function getActiveTabHostName() {
  let tabs = await browser.tabs.query({ active: true, currentWindow: true });
  let activeTab = tabs[0];
  let url = new URL(activeTab.url);
  let hostName = url.hostname;
  return hostName;
}

async function updatePopup() {
  const contentDiv = document.getElementById('speedLimit')
  let site = null

  let hostName = await getActiveTabHostName();
  console.log(hostName)

  switch(hostName) {
    case "x.com":
      site = 'twitter'
      break;
    case "www.reddit.com":
      site = 'reddit'
      break;
    default:
      site = 'twitter'
      break;
  }

  let delay = Math.sqrt(Math.floor(currentRequestCount(site) / 50)) * 250
  contentDiv.textContent = `${Math.round(delay / 100) / 10 }S`

  const requests = document.getElementById('requestNum')
  requests.textContent = currentRequestCount(site).toLocaleString()

  const siteName = document.getElementById('siteName')
  siteName.textContent = site
}

document.addEventListener('DOMContentLoaded', function () {
  updatePopup()

  const settings = new Settings()
  const inputs = document.querySelectorAll('#options input')

  inputs.forEach(input => {
    input.checked = settings[`slow${input.id}`]

    input.addEventListener('change', event => {
      const input = event.currentTarget
      settings[`slow${input.id}`] = input.checked
      console.log(settings.slowTwitter)
    })
  })
});
