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
		content = document.querySelector(".tutorial-content")?.innerText;
	}

	// general websites
	else if (window.location.href) {
		content = document.body?.innerText || "";
	}

	// here we are using the location.hostname to identify the website and extract relevant content ---------------------------------------------------------------------------------------------------------
	return content || "Relevant content not found.";
}

// function getFemaleVoice() {
// 	const voices = speechSynthesis.getVoices();
// 	return voices.find((voice) =>
// 		// voice.name.toLowerCase().includes("female") ||
// 		// voice.name.toLowerCase().includes("zira") || // Windows
// 		// voice.name.toLowerCase().includes("samantha") || // macOS
// 		voice.name.toLowerCase().includes("google uk english female")
// 	);
// }

// function speakText(text) {
// 	// Cancel any ongoing speech
// 	if (utterance) window.speechSynthesis.cancel();

// 	// Create new utterance
// 	utterance = new SpeechSynthesisUtterance(text);
// 	utterance.rate = 1;
// 	utterance.pitch = 1;

// 	const voices = speechSynthesis.getVoices();

// 	if (voices.length === 0) {
// 		// Wait for voices to load
// 		speechSynthesis.onvoiceschanged = () => {
// 			const femaleVoice = getFemaleVoice();
// 			if (femaleVoice) utterance.voice = femaleVoice; // Set only if found
// 			speechSynthesis.speak(utterance); // Speak regardless
// 		};
// 	} else {
// 		const femaleVoice = getFemaleVoice();
// 		if (femaleVoice) {
// 			utterance.voice = femaleVoice;
// 		}
// 		// Speak even if female voice not found
// 		speechSynthesis.speak(utterance);
// 	}
// }

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

window.addEventListener("beforeunload", () => {
	speechSynthesis.cancel();
});
