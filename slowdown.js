function resetDailyCount() {
  const currentDate = new Date().toDateString(); // Get current date as a string, ignoring time
  const lastResetDate = localStorage.getItem('lastResetDate');

  if (currentDate !== lastResetDate) {
      // Dates are different, so reset the count and update the last reset date
      localStorage.setItem('requestCount', 0);
      localStorage.setItem('lastResetDate', currentDate);
      console.log('Request count has been reset for the day.');
  }
}

function incrementRequestCount() {
  resetDailyCount(); // Ensure count is reset if needed before incrementing
  let currentCount = currentRequestCount()
  currentCount++;
  localStorage.setItem('requestCount', currentCount);
  console.log(`Current request count is ${currentCount}`);
}

function currentRequestCount() {
  return parseInt(localStorage.getItem('requestCount'), 10) || 0;
}


// Function to delay requests
function delayRequest(requestDetails) {
    if (requestDetails.method !== "GET") {
      return; // If not a GET request, do nothing
    }

    let url = new URL(requestDetails.url);
    let domain = url.hostname;

    // Check if the domain is one we want to throttle
    if (domain === "x.com" || domain === "pbs.twimg.com" || domain === "video.twimg.com") {

        // Calculate delay based on the count of requests
        let delay = Math.sqrt(Math.floor(currentRequestCount() / 50)) * 250; // Delay increases sublinearly

        incrementRequestCount()

        console.log(`Delaying request #${currentRequestCount()} to ${url} for ${delay} milliseconds.`);

        // Use setTimeout to delay the resolving of the request
        return new Promise((resolve) => setTimeout(() => resolve({}), delay));
    }
}

console.log('Slowdown running...')

// Listen for beforeRequest and potentially delay it
browser.webRequest.onBeforeRequest.addListener(
    delayRequest,
    { urls: ["*://*.x.com/*", "*://*.twimg.com/*"] },
    ["blocking"]
);
