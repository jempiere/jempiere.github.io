//programs javascript configuration

let toggles = {
	a: false,
	b: false,
	c: false,
	d: false,
}

function build(bid = 'button', d1 = 'div', d2 = 'div', toggle = false){
	let button = dom.idGet(bid);
	let div1 = dom.idGet(d1);
	let div2 = dom.idGet(d2);

	button.onclick = e => {
		toggle = !toggle;
		if(toggle){
			div1.classList = '';
			div2.classList = '';
		} else {
			div1.classList = 'hd';
			div2.classList = 'hd';
		}
		log(bid+': '+toggle);
	}
}

build('ig','individual', 'group' ,toggles.a);
build('ce','core', 'enrich', toggles.b);
build('hp','help', 'prep', toggles.c);
build('aa','asl', 'art', toggles.d);