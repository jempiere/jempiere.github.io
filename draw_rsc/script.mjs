import {dom, range, round, log, floor} from '../libs/concise.mjs';

const canvas = dom.idGet('canvas');
const slider = dom.idGet('islide');
const toggle = dom.idGet('toggle');
let   tbool  = false;
const clbttn = dom.idGet('clear');
const colors = dom.idGet('colors'); //div with color spans
const pclick = dom.idGet('palette'); //button to show div

const ctx = CTX(canvas);

const color = {
	buffer: HEX(0,0,0),
	main: HEX(0,0,0),
	clear: HEX('F','F','F'),
}

class Color {
	constructor(r=0,g=0,b=0){
		this.r=r;
		this.g=g;
		this.b=b;
	}
	darken(percent=75){
		percent /= 100;
		this.r *= percent;
		this.g *= percent;
		this.b *= percent;
		return this;
	}
}

const pointer = {
	down: false,
	last_x: 0,
	last_y: 0,
	size: 1,
}

main();

function main(){
	canvas.addEventListener('pointerdown',onDown);
	canvas.addEventListener('pointermove',onMove);
	canvas.addEventListener('pointerup',onUp);
	canvas.addEventListener('pointerleave',onLeave);
	slider.addEventListener('change',onChange);
	slider.addEventListener('input',onInput);
	toggle.addEventListener('click',onToggleClick);
	clbttn.addEventListener('click',onClear);
	pclick.addEventListener('mouseover',updateColor);
	colors.addEventListener('mouseover',updateColor);
	colors.addEventListener('click',updateColor);
	addColors();
	set_dimensions(canvas);
	init_ctx(ctx);
	clear(ctx);
	updateColor();
}

/*ACTUAL FUNCTIONS*/
function onDown(e){
	let position = mouse_pos(e);
	pointer.last_x = position.x;
	pointer.last_y = position.y;
	pointer.down = true;
}
function onMove(e){
	if(pointer.down){
		let position = mouse_pos(e);
		draw(e.target.getContext('2d'),position.x,position.y,SIZE(e.pressure,pointer.size));
		pointer.last_x = position.x;
		pointer.last_y = position.y;
		updateColor();
	}
}
function onUp(e){
	pointer.down = false;
}
function onLeave(e){
	pointer.down = false;
}
function onChange(e){
	pointer.size = parseInt(e.target.value,10);
	updateColor();
}
function onInput(e){
	const min = e.target['min'];
	const max = e.target['max'];
	const val = e.target['value'];
	const sizestr = `${(val-min) * 100 / (max-min)}% 100%`;
	e.target.style.backgroundSize = sizestr;
	updateColor();
}
function onToggleClick(e){
	tbool = !tbool;
	if(tbool){
		e.target.style.backgroundColor = '#333';
		color.buffer = color.main;
		color.main = color.clear;
		pointer.size *= 1.25;
	} else {
		e.target.style.backgroundColor = '#555';
		color.main = color.buffer;
		color.buffer = '';
		pointer.size /= 1.25;
	}
}
function onClear(e){
	clear(canvas.getContext('2d'));
	updateColor();
}
function addColors(){
	let res = [
		new Color(255,0,0),
		new Color(255,127,0),
		new Color(255,255,0),
		new Color(0,255,0),
		new Color(0,255,255),
		new Color(0,0,255),
		new Color(127,0,255)
	];
	let shades = [
		new Color(0,0,0),
		new Color(37,37,37),
		new Color(73,73,73),
		new Color(110,110,110),
		new Color(145,145,145),
		new Color(185,185,185),
		new Color(255,255,255),
	];

	res.forEach(a => colors.appendChild(colorEl('color',a)));
	res.forEach(b => colors.appendChild(colorEl('color',b.darken(60))));
	res.forEach(c => colors.appendChild(colorEl('color',c.darken(50))));
	shades.forEach(s => colors.appendChild(colorEl('color',s)));
}
function updateColor(){
	pclick.style.backgroundColor = color.main;
}


/*FUNCTIONAL STUFF*/
function colorEl(cls, c){
	let r = c.r;
	let g = c.g;
	let b = c.b;
	let res = dom.createElement('span');
	res.classList = cls;
	res.style.backgroundColor = `rgb(${r},${g},${b})`;
	res.addEventListener('click', e => {
		color.main = e.target.style.backgroundColor;
		//log(e.target.style.backgroundColor);
	});
	return res;
}

function CTX(canvas){
	return canvas.getContext('2d');
}
function POS(X,Y){
	return {
		x: X,
		y: Y,
	}
}
function SIZE(pressure,factor){
	return pressure*factor*pointer.size
}
function RLEN(str, len){
	if(str.length < len){
		str = str.repeat(len - str.length);
	}
	return str;
}
function HEXR(num){
	return RLEN(num.toString(16));
}
function HEX(r,g,b,flag=false){ //flag if they're base 10 numbers lol
	if(flag){
		return `${HEXR(r)}${HEXR(g)}${HEXR(b)}`;
	}
	return `#${r}${g}${b}`
}
function RGB(hex){
	if(hex.startsWith('#')) hex = hex.substring(1);
	let res = [];
	let acc = '';
	for(let char of hex){
		acc+=char;
		if(acc.length == 2){
			res.push(acc); acc = '';
		}
	}
	return res.map(e => parseInt(e,16))
}

/*RENDERING*/
function draw(ctx,x,y,size){
	ctx.strokeStyle = color.main;
	ctx.lineWidth = size;
	ctx.beginPath();
	ctx.moveTo(pointer.last_x,pointer.last_y);
	ctx.lineTo(x,y);
	ctx.closePath();
	ctx.stroke();
}

function clear(ctx){
	ctx.fillStle = color.clear;
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

/*HELPERS*/
function mouse_pos(e){
	let canvas = e.target;
	let rect = canvas.getBoundingClientRect();
	let scale = POS(canvas.width/rect.width,canvas.height/rect.height);
	return (e.layerX
	?{
		x: (e.clientX - rect.left) * scale.x,
		y: (e.clientY - rect.top) * scale.y,
	 }
	:{})
}

function set_dimensions(canvas, arg = { w: 850, h: 1100 }) {
	canvas.height = arg.h;
	canvas.width = arg.w;
	clear(canvas.getContext('2d'));
}

function init_ctx(ctx){
	ctx.strokeStyle = color.main;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.fillStyle = HEX('F','F','F');
}
