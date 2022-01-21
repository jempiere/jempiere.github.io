const alphabet = ['a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'];

function math(str=''){
	return doAdd(str);
}

function doAdd(str=''){
	for(let i in str){
		if(str[i] == 'e') {
			str[i] == `${Math.E}`; //e = 2.1 ...
			continue;
		};
		if(alphabet.includes(str[i])) throw new Error(`Unrecognized Symbol: ${str[i]}`);
	}
	let iv = 0.0;
	return doPar(str,'+').map(e=>doSub(e)).reduce((a,b) => a+b,iv);
}

function doSub(str=''){
	let fra = doPar(str,'-').map(e=>doMul(e));
	let iv = fra.shift();
	return fra.reduce((a,b) => a-b,iv);
}

function doMul(str=''){
	let iv = 1.0;
	return doPar(str,'*').map(e=>doMod(e)).reduce((a,b)=>a*b,iv);
}

function doMod(str=''){
	let fra = doPar(str,'%').map(e=>doDiv(e));
	let iv = fra.shift();
	return fra.reduce((a,b) => a%b, iv);
}

function doDiv(str=''){
	let fra = doPar(str,'/').map(e=>doExp(e));
	let iv = fra.shift();
	return fra.reduce((a,b) => a/b, iv);
}

function doExp(str=''){
	let fra = doPar(str,'^').map(e => {
		if(e[0] == '('){
			let expr = e.substr(1,e.length-2);
			return doAdd(expr);
		}
		return +e;
	});
	let iv = fra.shift();
	return fra.reduce((a,b)=>a**b,iv);
}

function doPar(expr='', op=''){
	let res = [];
	let braces = 0;
	let ws = '';
	for(let char of expr){
		if(char == '(') braces++;
		else if(char == ')') braces--;
		if(braces == 0 && char == op){
			res.push(ws); ws = '';
		}
		else ws+=char;
	}
	if(ws) res.push(ws);
	return res;
}

export {
	math,
}
