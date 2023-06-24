console.log("We are in service worker");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "context1",
    title: "Copy task",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "context2",
    title: "Read text",
    contexts: ["selection"],
  });

  chrome.contextMenus.onClicked.addListener(async (event) => {
    if (event.menuItemId === "context1") {
      const data = await getStorage("tasks");

      setStorage({
        tasks: [...data.tasks, event.selectionText],
      });
    }

    if (event.menuItemId === "context2") {
      chrome.tts.speak(event.selectionText, {
        lang: "es-ES",
        rate: 1.0,
      });
    }
  });
});

async function getStorage(key) {
  return await chrome.storage.local.get([key]);
}

function setStorage(value) {
  chrome.storage.local.set(value);
}
