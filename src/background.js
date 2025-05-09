chrome.tabs.onRemoved.addListener((tabId) => {
	chrome.runtime.sendMessage({ type: "stopSpeech" });
});
