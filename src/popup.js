document.getElementById("toggle-btn").addEventListener("click", async () => {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: toggleSpeechWithHighlight,
	});
});

document.getElementById("pause-btn").addEventListener("click", async () => {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: () => {
			if (speechSynthesis.speaking && !speechSynthesis.paused) {
				speechSynthesis.pause();
			} else if (speechSynthesis.paused) {
				speechSynthesis.resume();
			}
		},
	});
});

function toggleSpeechWithHighlight() {
	if (window._isSpeaking) {
		speechSynthesis.cancel();
		removeHighlight();
		window._isSpeaking = false;
		return;
	}

	window._isSpeaking = true;
	const text = document.body.innerText;
	const sentences = text.match(/[^.!?]+[.!?]*/g) || [];
	let index = 0;

	const voices = speechSynthesis.getVoices();
	const voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];

	function speakNext() {
		if (index >= sentences.length || !window._isSpeaking) {
			removeHighlight();
			window._isSpeaking = false;
			return;
		}

		const sentence = sentences[index].trim();
		const utterance = new SpeechSynthesisUtterance(sentence);
		utterance.voice = voice;
		utterance.rate = 1.1;

		utterance.onstart = () => highlight(sentence);
		utterance.onend = () => {
			index++;
			speakNext();
		};

		speechSynthesis.speak(utterance);
	}

	// Ensure voices are loaded before speaking
	if (speechSynthesis.getVoices().length === 0) {
		speechSynthesis.onvoiceschanged = speakNext;
	} else {
		speakNext();
	}
}

function highlight(sentence) {
	removeHighlight();
	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT
	);
	let node;
	while ((node = walker.nextNode())) {
		const i = node.nodeValue.indexOf(sentence);
		if (i !== -1) {
			const range = document.createRange();
			range.setStart(node, i);
			range.setEnd(node, i + sentence.length);

			const mark = document.createElement("mark");
			mark.style.backgroundColor = "deepskyblue";
			mark.style.padding = "2px";
			mark.style.borderRadius = "4px";
			mark.appendChild(range.extractContents());
			range.insertNode(mark);
			mark.scrollIntoView({ behavior: "smooth", block: "center" });
			break;
		}
	}
}

function removeHighlight() {
	document.querySelectorAll("mark").forEach((m) => {
		const text = document.createTextNode(m.textContent);
		m.parentNode.replaceChild(text, m);
	});
}
