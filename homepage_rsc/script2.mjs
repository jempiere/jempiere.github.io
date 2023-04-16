
const Simplify = (v) => {
  return v;
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

const idGet = (...a) => document.getElementById(...a);

/*
  Implementing the calculator bar
*/
let calculator = idGet("calculator");
calculator.addEventListener("keyup",e => {
  e.stopImmediatePropogation();
  if (e.key.toLowerCase() == 'enter'){
    e.preventDefault();
    calculator.textContent = Simplify(calculator.textContent);
    setEnd(calculator);
  }
});


/*
  Implementing the search bar
*/
let searchbar = idGet("lookup");
searchbar.addEventListener("keyup", e => {
  let text = searchbar.value.replaceAll(' ','+');
  if (e.key.toLowerCase() == 'enter'){
    if (text.startsWith('http://') || text.startsWith('https://') ) window.open(text,'_self');
    else if (text.startsWith('www.')) window.open('https://'+text,'_self');
    else if (text.startsWith('localhost:')) window.open('http://'+text,'_self');
    else if (text.startsWith('file://')) window.open(text,'_self');
    else window.open('https://duckduckgo.com/?t=ffab&q='+text+'&ia=web','_self');
  }
});

/*
  Implementing the color mixer
*/



let redBox   = idGet("r");
let greenBox = idGet("g");
let blueBox  = idGet("b");

let hexBox   = idGet("hex");

function HexString(number){
  if (number > 255 || number < 0 || !Number.isInteger(number)) return '00';
  return ('00'+number.toString(16)).slice(-2);
}

function fixColors(element, c1, c2, c3){
  hexBox.textContent = "#" + HexString(c1) + HexString(c2) + HexString(c3);
  if ( c1 > 0xf0 || c2 > 0xf0 || c3 > 0xf0){
    idGet("hex").style.color = "#000";
  } else {
    idGet("hex").style.color = "#FFF";
  }
  idGet("hex").style.backgroundColor = hexBox.textContent;
}

function handleColorChange(event){
  let r2,g2,b2;

  
  r2 = parseInt(redBox.value,10);
  g2 = parseInt(greenBox.value,10);
  b2 = parseInt(blueBox.value,10);

  document.documentElement.style.setProperty('--redColor',"#"+HexString(r2)+"0000");
  document.documentElement.style.setProperty('--greenColor',"#"+"00"+HexString(g2)+"00");
  document.documentElement.style.setProperty('--blueColor',"#"+"0000"+HexString(b2));
  // event.target.style.backgroundColor = `rgb({parseInt(event.target.value,10)},0,0)`;


  fixColors(hexBox,r2,g2,b2);
}

redBox.addEventListener("input",handleColorChange);
greenBox.addEventListener("input",handleColorChange);
blueBox.addEventListener("input",handleColorChange);
