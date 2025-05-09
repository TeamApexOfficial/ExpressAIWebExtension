let isReading = false;
let isPaused = false;

document.getElementById("toggleBtn").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (!isReading) {
			chrome.tabs.sendMessage(tabs[0].id, { command: "start" });
			document.getElementById("toggleBtn").textContent = "Stop Reading";
		} else {
			chrome.tabs.sendMessage(tabs[0].id, { command: "stop" });
			document.getElementById("toggleBtn").textContent = "Start Reading";
		}
		isReading = !isReading;
	});
});

document.getElementById("pauseResumeBtn").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (!isPaused) {
			chrome.tabs.sendMessage(tabs[0].id, { command: "pause" });
			document.getElementById("pauseResumeBtn").textContent = "Resume";
		} else {
			chrome.tabs.sendMessage(tabs[0].id, { command: "resume" });
			document.getElementById("pauseResumeBtn").textContent = "Pause";
		}
		isPaused = !isPaused;
	});
});
