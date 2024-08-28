export default class Popup {
  currentRequestCount(site) {
    return parseInt(localStorage.getItem(`${site}RequestCount`), 10) || 0;
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

    let delay = Math.sqrt(Math.floor(this.currentRequestCount(site) / 50)) * 250
    contentDiv.textContent = `${Math.round(delay / 100) / 10 }S`

    const requests = document.getElementById('requestNum')
    requests.textContent = this.currentRequestCount(site).toLocaleString()

    const siteName = document.getElementById('siteName')
    siteName.textContent = site
  }
}
