//Dom methods. Allows access to DOM elements.
const dom = {
	idGet: (id) => document.getElementById(id),
	tagGets: (tag) => document.getElementsByTagName(tag),
	tanGets: (tag) => document.getElementsByTagNameNS(tag),
	clGets: (cls) => document.getElementsByClassName(cls),
	nameGets: (name) => document.getElementsByName(name),
	sel: () => document.getSelection(),
	listen: (act='', func) => document.addEventListener(act, func),
	unlisten: (act, func) => document.removeEventListener(act,func),
	createElement: (el) => document.createElement(el),
	appendChild: (el) => document.appendChild(el),
	removeChild: (el) => document.removeChild(el),
	forms: ()=> document.forms,
};

/* Shorter logging and error-logging messages */
const log = console.log;
const err = console.error;



/*run a funxtion once --> parameter b should be a function*/
const once = (b, ctx) => { 
	let r;
	return function() { 
		if(b) {r = b.apply(ctx || this, arguments); b = null;}
		return r;
	};
};

/*Get name of object variable*/
const getName = (item={}) => Object.keys(item)[0];


/*Return a random array value by itself*/
function randex(array=[]){
	return array[Math.floor(Math.random()*array.length)];
}

/*Return a random array value and it's index in an array*/
function randex(array=[],array_return){
	if(!array_return) return randex(array);
	let index = Math.floor(Math.random()*array.length);
	return [arr[index],index];
}

/*Link an audio or video stream to a player*/
const linkCaptureDevice = (player, video = true, audio = true)=>{
	MediaDevices.getUserMedia({video,audio}).then((stream)=>{
		player.src = stream;
	}).catch((e)=>err(e));
};

function last(array=[]){
	return array[array.length-1];
}

//

class Left extends HTMLDivElement {
}
window.customElements.define('left-e', Left);

class Right extends HTMLDivElement {
}
window.customElements.define('right-e', Right);
