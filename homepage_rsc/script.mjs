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


const inputs = [...document.getElementsByClassName('input')];
const RCOL = document.getElementById('rcol');
const color = {r:0,g:0,b:0};

for(let input of inputs){
	input.addEventListener('keydown',doHandle);
	input.addEventListener('keyup',doHandle);
}
function doHandle(e){
	if(e.key == 'Enter') e.preventDefault();
	if(~e.key.toLowerCase().indexOf('arrow')) return;
	const cl = [...e.target.classList];
	if(cl.includes('number') && !isValidNumber(e.target.textContent,e.key))
		e.preventDefault(0);
	if(cl.includes('text') && !isValidHex(e.target.textContent,e.key))
		e.preventDefault(0);
	updateColor(e.target,cl);
}

function updateColor(element,classList){
	if(!classList.includes('input')) return;


	let res   = 'rgb(0,0,0,255)';
	const pos = element.id;

	if(classList.includes('number')){
		color[pos] = element.textContent;
		res = formatRGB(...Object.values(color));
		document.getElementById('hex').textContent = formatHex(`#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}`);
	}
	if(classList.includes('text')){
		const temp = formatHex(element.textContent);
		color['r'] = parseInt(temp[0],16) || color['r'];
		color['g'] = parseInt(temp[1],16) || color['g'];
		color['b'] = parseInt(temp[2],16) || color['b'];
		document.getElementById('r').textContent = color['r'];
		document.getElementById('g').textContent = color['g'];
		document.getElementById('b').textContent = color['b'];
		res = '#'+temp.join('');
	}
	RCOL.style.backgroundColor = res;
}

function isValidNumber(body, added){
	if(added == 'Backspace') return true;
	if(body.length < 3 && ~'0.1.2.3.4.5.6.7.8.9'.indexOf(added))
		return true;
}

function isValidHex(body, added){
	if(added == 'Backspace') return true;
	if(body.length < 9 && ~'#0123456789abcdef'.indexOf(added.toLowerCase())){
		return true;
	}
}

function formatRGB(r,g,b){
	return `rgb(${r},${g},${b})`;
}

function formatHex(str){
	str = str.replaceAll(/\s|[#]+/g,'');
	if(str.length < 1) return ['00','00','00','ff'];
	const len = str.length;
	const bSize = (len>6) ? 4 : 3;				 //the size of the buckets
	const rSize = (len%bSize)?1:len/bSize; //number of indices per bucket

	const arr = new Array(bSize); //array of buckets size
	const test = bucketSplit(str,rSize);
	for(let i in test)
		if(test[i].length < 2)
			test[i] = `${test[i]}${test[i]}`;

	if(test.length < 4) test.push('ff');

	return test;
}

function bucketSplit(str,bSize){
	const res = [];
	let   acc = '';
	let index = 0;
	while(42){
		acc += str[index++];
		if(acc.length == bSize){
			res.push(acc);
			acc = '';
			str = str.slice(bSize);
			index = 0;
		}
		if(index == str.length) break;
	}
	return res;
}
