
//async function doImports(url='',location=''){
//	document.body.insertAdjacentHTML(location, await importTemplateHTML(url));
//}

//doImports('/pages/navbar.html','afterbegin');
//doImports('/pages/footer.html','beforeend');



function doImports(location='', htmlString=``){
	document.body.insertAdjacentHTML(location,htmlString);
	}

doImports('afterbegin',`
	<section>
		<div id="nav">
			<a id="home" href="/pages/home.html">Home</a>
			<a id="about" href="/pages/about.html">About Us</a>
			<a id="beacon" href="/pages/beacon.html">Beacon Academy</a>
			<a id="programs"href="/pages/programs.html">Programs</a>
			<a id="scheduling" href="/pages/registration.html">Scheduling</a>
			<a id="pricing" href="/pages/pricing.html">Pricing</a>
			<a id="affiliates" href="/pages/affiliates.html">Affiliates</a>
		</div>
	</section>
`
);

doImports('beforeend',`
	<footer id="contact">
		<div class="footer">
			<div class="top">Temecula Tutor LLC</div>
			<div class="center">27715 Jefferson Ave. Suite 109, Temecula CA 92590</div>
			<div class="bottom"><a class="telephone" href="tel:9515516022">(951).551.6022</a></div>
		</div>
		<center>
			<div>
				Copyright © 2021 Temecula Tutor - All Rights Reserved.
			</div>
		</center>
	</footer>
`
);