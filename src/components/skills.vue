<template>
	<section class="skills">
		<canvas id="paper-canvas-skills" resize="true"></canvas>

		<div class="skills-header">
			<div class="skills-sr">
				<div class="skills-text">
					<h2>Skills</h2>
					<p id="skills-tip">(Feel free to click around...)</p>
				</div>
				<img src="/assets/images/hand.png" alt="a retro-styled image of a pointing hand">
			</div>
		</div>

		<div class="skills-row">
			<div v-for="skillObj in data" class="skills-column" :key="skillObj.category">
				<h3>{{skillObj.category}}</h3>
				<ul>
					<li v-for="item in skillObj.skills" :key="item">{{item}}</li>
				</ul>
			</div>
		</div>

		<div class="svg-wrapper">
			<svg width="500" height="150" viewBox="0 0 500 150">
				<defs>
					<pattern id="pattern" x="0" y="5" width="500" height="15" patternUnits="userSpaceOnUse">
						<line x1="0" y1="0" x2="500" y2="0" stroke-width="10" stroke="black"></line>
					</pattern>
				</defs>
				<ellipse cx="250" cy="180" rx="250" ry="150" fill="url(#pattern)"></ellipse>
			</svg>
		</div>

		<div class="icons">
			<a
				v-for="link in links"
				:key="link.href"
				:href="link.href"
				target="_blank"
				rel="noopener noreferrer"
			>
				<i class="hover fa fa-2x" :class="link.icon" aria-hidden="true"></i>
			</a>
		</div>
	</section>
</template>

<script type="text/javascript" src="./skills.js"></script>

<style src="../../assets/stylesheets/skills.css" scoped></style>