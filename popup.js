function currentRequestCount() {
  return parseInt(localStorage.getItem('requestCount'), 10) || 0;
}

document.addEventListener('DOMContentLoaded', function () {
  const contentDiv = document.getElementById('speedLimit')
  let delay = Math.sqrt(Math.floor(currentRequestCount() / 50)) * 250
  contentDiv.textContent = `${Math.round(delay / 100) / 10 }S`

  const requests = document.getElementById('requestNum')
  requests.textContent = currentRequestCount().toLocaleString()
});
