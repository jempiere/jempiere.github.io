var slideIndex = 1;
showSlide(slideIndex);


function setIndex(idx=0){
	slideIndex=idx;
}

function moveSlide(num=0){
	slideIndex+=num;
	showSlide(slideIndex);
}

function showSlide(n=0){
	let slides = dom.clGets('fade'); //array of slides. See concise.js for dom methods
	if(n > slides.length) slideIndex = 1; //wrap around if over slide count
	if(n == 0) slideIndex = slides.length;

	for(let item of slides){
		item.classList="invisible fade";
	}

	slides[slideIndex - 1].classList = "visible fade";
}