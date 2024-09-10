import Settings from "./settings.js"

export default class Popup {
  constructor() {
    this.settings = new Settings()
  }

  async getActiveTabHostName() {
    let tabs = await browser.tabs.query({ active: true, currentWindow: true });
    let activeTab = tabs[0];
    let url = new URL(activeTab.url);
    let hostName = url.hostname;
    return hostName;
  }

  async update() {
    const contentDiv = document.getElementById('speedLimit')
    let site = null

    if(!contentDiv) { return }

    let hostName = await this.getActiveTabHostName();

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

    const delay = this.settings.delayFor(site)
    contentDiv.textContent = `${Math.round(delay / 100) / 10 }S`

    const requests = document.getElementById('requestNum')
    requests.textContent = this.settings.currentRequestCount(site).toLocaleString()

    const siteName = document.getElementById('siteName')
    siteName.textContent = site
  }
}
