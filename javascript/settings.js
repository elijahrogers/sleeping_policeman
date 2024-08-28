export default class Settings {
  resetDailyCount() {
    const currentDate = new Date().toDateString() // Ignore time

    if (currentDate !== this.lastResetDate) {
      ['twitter', 'reddit'].forEach(site => {
        localStorage.setItem(`${site}RequestCount`, 0)
      })

      this.lastResetDate = currentDate
    }
  }

  delayFor(site) {
    return this.delay(this.currentRequestCount(site))
  }

  delay(requestCount) {
    // Delay increases sublinearly
    return Math.sqrt(Math.floor(requestCount / 50)) * 250
  }

  incrementRequestCount(site) {
    this.resetDailyCount(); // Ensure count is reset if needed

    let currentCount = this.currentRequestCount(site)
    currentCount++;

    localStorage.setItem(`${site}RequestCount`, currentCount);
  }

  currentRequestCount(site) {
    return parseInt(localStorage.getItem(`${site}RequestCount`), 10) || 0;
  }

  castBoolean(val) {
    return val?.toLowerCase() === 'true'
  }

  get lastResetDate() {
    return localStorage.getItem('lastResetDate')
  }

  set lastResetDate(val) {
    localStorage.setItem('lastResetDate', val)
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
