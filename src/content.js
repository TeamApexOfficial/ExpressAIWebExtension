let utterance;
let isSpeaking = false;

function extractRelevantContent() {
	let content = "";

	// here we are using the location.hostname to identify the website and extract relevant content ---------------------------------------------------------------------------------------------------------

	// Wikipedia
	if (location.hostname.includes("wikipedia.org")) {
		content = document.querySelector("#mw-content-text")?.innerText;
	}

	// GeeksforGeeks
	else if (location.hostname.includes("geeksforgeeks.org")) {
		content = document.querySelector(".text")?.innerText;
	}

	// Tutorialspoint
	else if (location.hostname.includes("tutorialspoint.com")) {
		content = document.querySelector(".mui-container-fluid")?.innerText;
	}

	// here we are using the location.hostname to identify the website and extract relevant content ---------------------------------------------------------------------------------------------------------
	return content || "Relevant content not found.";
}

function speakText(text) {
	if (utterance) window.speechSynthesis.cancel();
	utterance = new SpeechSynthesisUtterance(text);
	utterance.rate = 1;
	utterance.pitch = 1;
	speechSynthesis.speak(utterance);
}

chrome.runtime.onMessage.addListener((msg) => {
	if (msg.command === "start") {
		const content = extractRelevantContent();
		speakText(content);
		isSpeaking = true;
	} else if (msg.command === "stop") {
		speechSynthesis.cancel();
		isSpeaking = false;
	} else if (msg.command === "pause") {
		speechSynthesis.pause();
	} else if (msg.command === "resume") {
		speechSynthesis.resume();
	} else if (msg.type === "stopSpeech") {
		speechSynthesis.cancel();
	}
});
