import {math} from './math.mjs';

const online  = () => {
	let bool = window.navigator.onLine;
	let status = document.getElementById('status');
	let haze   = document.getElementById('glow');

	status.style.color = status.style.fill = bool ? '#34E1B0' : '#FC5063';
	haze.style.color = haze.style.fill = bool ? '#34E1B0' : '#FC5063';

}

const setEnd  = (element) => {
	let range, selection;
	range = document.createRange();
	range.selectNodeContents(element);
	range.collapse(false);

	selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
}

online();
window.addEventListener('online', online);
window.addEventListener('offline', online);


document.getElementById('calculator').addEventListener('keydown', e => {
	if(`${e.key}`.toLowerCase() == 'enter'){
		e.preventDefault();
		e.target.innerText = math(e.target.innerText);
		setEnd(e.target);
	}
})

document.getElementById('lookup').addEventListener('keydown', e => {
	let text = e.target.value.replaceAll(' ','+');
	console.log(text);
	if(`${e.key}`.toLowerCase() == 'enter'){
		console.log('submitted');
		if(text.startsWith('https://')) window.open(text,'_self');
		else if(text.startsWith('www.')) window.open('https://'+text,'_self');
		else if(text.startsWith('localhost:')) window.open('http://'+text,'_self');
		else if(text.startsWith('file://')) window.open(text,'_self');
		else window.open('https://duckduckgo.com/?t=ffab&q='+text+'&ia=web','_self');//do normal google stuff
	}
})
