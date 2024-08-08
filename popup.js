class Settings {
  castBoolean(val) {
    return val.toLowerCase() === 'true'
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

function currentRequestCount() {
  return parseInt(localStorage.getItem('requestCount'), 10) || 0;
}

document.addEventListener('DOMContentLoaded', function () {
  const contentDiv = document.getElementById('speedLimit')
  let delay = Math.sqrt(Math.floor(currentRequestCount() / 50)) * 250
  contentDiv.textContent = `${Math.round(delay / 100) / 10 }S`

  const requests = document.getElementById('requestNum')
  requests.textContent = currentRequestCount().toLocaleString()

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
