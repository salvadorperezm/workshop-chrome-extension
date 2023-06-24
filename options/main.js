const form = document.getElementById('form')
const inputContraint = document.getElementsByName('taskContraint')[0]

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const inputs = e.target.elements;

  chrome.storage.local.set({ config: inputs.taskContraint.value })
})

function main() {
  const result = chrome.storage.local.get(['config'])

  if (!result.hasOwnProperty('config')) {
    chrome.storage.local.set({ config: inputContraint.value })
  }
}

main()