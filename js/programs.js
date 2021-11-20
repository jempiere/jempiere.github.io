/* New Code */

dom.idGet('programs').classList += 'active';

function doListen(){
	Array.from(dom.clGets('top')).forEach(button => {
	button.addEventListener('click',()=>{
		button.classList = 'top active';
	});
});

Array.from(dom.clGets('top active')).forEach(button => {
	button.addEventListener('click',()=>{
		button.classList = 'top';
	});
});
}

doListen();

dom.listen('click',doListen);