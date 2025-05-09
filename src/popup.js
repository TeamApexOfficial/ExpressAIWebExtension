let isSpeaking = false;
let isPaused = false;

document.getElementById("toggle-btn").addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: toggleReading,
	});
});

document.getElementById("pause-btn").addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: pauseOrResume,
	});
});

function toggleReading() {
	if (!window.speechSynthesis) return;

	if (!window._isSpeaking) {
		const text = document.body.innerText;
		const utterance = new SpeechSynthesisUtterance(text);
		window._utterance = utterance;
		window._isSpeaking = true;
		speechSynthesis.speak(utterance);

		utterance.onend = () => {
			window._isSpeaking = false;
		};
	} else {
		speechSynthesis.cancel();
		window._isSpeaking = false;
	}
}

function pauseOrResume() {
	if (!window.speechSynthesis) return;

	if (speechSynthesis.speaking && !speechSynthesis.paused) {
		speechSynthesis.pause();
	} else if (speechSynthesis.paused) {
		speechSynthesis.resume();
	}
}
