<template>
	<section class="skills">
		<canvas id="paper-canvas-skills" resize="true"></canvas>
		<div class="skills-header">
			<div class="skills-text">
				<h2>Skills</h2>
				<p id="skills-tip">(Feel free to click around...)</p>
			</div>
			<img src="/assets/images/hand.png" alt="a retro-styled image of a pointing hand">
		</div>

		<div class="skills-row">
			<div v-for="skillObj in data" class="skills-column">
				<h3>{{skillObj.category}}</h3>
				<ul>
					<li v-for="item in skillObj.skills">{{item}}</li>
				</ul>
			</div>
		</div>

		<div class="svg-wrapper">
			<svg width="500" height="150" viewBox="0 0 500 150">
				<defs>
					<pattern id="pattern" x="0" y="5" width="500" height="15" patternUnits="userSpaceOnUse" >
						<line x1="0" y1="0" x2="500" y2="0" stroke-width="10" stroke="black"/>
	  			</pattern>
				</defs>
				<ellipse cx="250" cy="180" rx="250" ry="150" fill="url(#pattern)" />
			</svg>
		</div>

		<div class="icons">
			<a href="https://github.com/blakeface"
					class="gtm-contact"
					target="_blank"
					rel="noopener noreferrer">
						<i class="fa fa-github fa-2x gtm-contact"
								id="gtm-github"
								aria-hidden="true"></i>
			</a>
			<a href="mailto:blake.netzeband@gmail.com"
					class="gtm-contact"
					target="_blank"
					rel="noopener noreferrer">
						<i class="fa fa-envelope fa-2x gtm-contact"
								id="gtm-email"
								aria-hidden="true"></i>
			</a>
			<a href="https://www.linkedin.com/in/blakenetz"
					class="gtm-contact"
					target="_blank"
					rel="noopener noreferrer">
						<i class="fa fa-linkedin fa-2x gtm-contact"
								id="gtm-linkedin"
								aria-hidden="true"></i>
			</a>
			<a href="https://twitter.com/blakenetz"
					class="gtm-contact"
					target="_blank"
					rel="noopener noreferrer">
						<i class="fa fa-twitter fa-2x gtm-contact"
								id="gtm-twitter"
								aria-hidden="true"></i>
			</a>
			<a href="https://www.facebook.com/blakenetz"
					class="gtm-contact"
					target="_blank"
					rel="noopener noreferrer">
						<i class="fa fa-facebook fa-2x gtm-contact"
								id="gtm-facebook"
								aria-hidden="true"></i>
			</a>
			<a href="https://angel.co/blake-netzeband"
					class="gtm-contact"
					target="_blank"
					rel="noopener noreferrer">
						<i class="fa fa-angellist fa-2x gtm-contact"
								id="gtm-angellist"
								aria-hidden="true"></i>
			</a>
		</div>
	</section>
</template>

<script type="text/javascript" src="./skills.js"></script>

<style src="../../assets/stylesheets/skills.css" scoped></style>