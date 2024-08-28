export default class Settings {
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
