import Settings from "./settings.js"
import Popup from "./popup.js"
import Patrolman from "./patrolman.js"

document.addEventListener('DOMContentLoaded', function () {
  const popup = new Popup()
  const settings = new Settings()
  const inputs = document.querySelectorAll('#options input')

  popup.update()

  inputs.forEach(input => {
    input.checked = settings[`slow${input.id}`]

    input.addEventListener('change', event => {
      const input = event.currentTarget
      settings[`slow${input.id}`] = input.checked
    })
  })
});

const patrolman = new Patrolman()

// Listen for beforeRequest and potentially delay it
browser.webRequest.onBeforeRequest.addListener(
  patrolman.delayRequest.bind(patrolman),
  { urls: patrolman.urls },
  ["blocking"]
);
