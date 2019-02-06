<template>
	<section class="projects">
		<h2>Projects</h2>

		<div class="project-row" v-for="(projects, rowI) in data">
			<h3>{{projects.displayName}}</h3>

			<div class="row-container">
				<div
					v-for="(project, i) in projects.data"
					:key="projects.displayName + '-' + i"
					class="project-square gtm-project"
					:id="getProjectId(rowI, i)"
					@click="handleClick(rowI, i)"
					@keyup.space.prevent="handleClick(rowI, i)"
					:style="{ 'background': getColor(projects.rgb, i) }"
					tabindex="1"
				>
					<p>{{project.name}}</p>
				</div>

				<div
					v-for="(box, i) in getGhostCount(rowI)"
					:key="'ghost-' + i"
					class="project-square ghost"
					:style="{ 'background': getColor(projects.rgb, (maxBoxCount-getGhostCount(rowI) + i)) }"
				></div>
			</div>

			<div
				v-show="targetedRowID == rowI"
				:id="getRowId(rowI)"
				class="project-details"
				:style="{ 'color': 'rgb(' + projects.rgb + ')' }"
			>
				<h3 class="project-title"></h3>
				<p class="project-description"></p>

				<h4 class="specs">Built with:</h4>
				<p class="project-specs specs"></p>

				<div class="project-links" :style="{ 'color': 'rgb(' + projects.rgb + ')' }">
					<a class="link is-hidden" id="github" href target="_blank" rel="noopener noreferrer">
						<i class="hover fa fa-github-square fa-2x" aria-hidden="true"></i>
					</a>
					<a class="link is-hidden" id="url" href target="_blank" rel="noopener noreferrer">
						<i class="hover fa fa-desktop fa-2x" aria-hidden="true"></i>
					</a>
					<a class="link is-hidden" id="youtube" href target="_blank" rel="noopener noreferrer">
						<i class="hover fa fa-youtube-square fa-2x" aria-hidden="true"></i>
					</a>
					<a class="link is-hidden" id="pics" href target="_blank" rel="noopener noreferrer">
						<i class="hover fa fa-camera-retro fa-2x" aria-hidden="true"></i>
					</a>
					<a class="link is-hidden" id="linkedin" href target="_blank" rel="noopener noreferrer">
						<i class="hover fa fa-linkedin-square fa-2x" aria-hidden="true"></i>
					</a>
				</div>
			</div>
		</div>

		<div class="projects-footer">
			<img src="/assets/images/mountain.png" alt="distressed image of mountain">
		</div>
	</section>
</template>

<script type="text/javascript" src="./projects.js"></script>
<style src="../../assets/stylesheets/projects.css" scoped></style>