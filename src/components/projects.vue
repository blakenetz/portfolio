<template>
	<section class="projects">

		<div class="projects-header">
			<div class="circle-container">
				<div id="outline"></div>
				<div id="base"></div>
				<div id="circle-1"></div>
				<div id="circle-2"></div>
				<div id="circle-3"></div>
			</div>

			<div class="projects-title">
				<h2>Projects</h2>
			</div>
		</div>

		<div class="project-row" v-for="(projects, rowI) in data" >
			<div class="row-title">
				<h3>{{projects.displayName}}</h3>
			</div>

			<div class="row-container">
				<div v-for="(project, i) in projects.data"
						class="project-square gtm-project"
						:id="getProjectId(rowI, i)"
						:style="{ 'background': getColor(projects.rgb, i) }"
						@click="handleClick(rowI, i)"
						@keyup.space.prevent="handleClick(rowI, i)"
						:key="projects.displayName + '-' + i"
						tabindex="1"
						>
					<p>{{project.name}}</p>
				</div>
				<div v-for="(box, i) in getGhostCount(rowI)" :key="'ghost-' + i">
					<div class="project-square ghost"
							:style="{ 'background': getColor(projects.rgb, (maxBoxCount-getGhostCount(rowI) + i)) }" >
					</div>
				</div>
			</div>

			<transition @before-enter="beforeEnter">
				<div v-show="targetedRowID == rowI"
							:id="getRowId(rowI)"
							class="project-details"
							name="project-transition"
					>
					<div class="project-details-inner">
						<div class="project-details-inner-content">
							<h3 class="project-title"></h3>

							<h4>Description:</h4>
							<p class="project-description"></p>

							<h4 class="specs">Specs:</h4>
							<p class="project-specs specs"></p>

							<div class="project-links">
								<a class="link is-hidden" id="github" href="" target="_blank" rel="noopener noreferrer">
									<i class="fa fa-github-square fa-2x" aria-hidden="true"></i>
								</a>
								<a class="link is-hidden" id="url" href="" target="_blank" rel="noopener noreferrer">
									<i class="fa fa-desktop fa-2x" aria-hidden="true"></i>
								</a>
								<a class="link is-hidden" id="youtube" href="" target="_blank" rel="noopener noreferrer">
									<i class="fa fa-youtube-square fa-2x" aria-hidden="true"></i>
								</a>
								<a class="link is-hidden" id="pics" href="" target="_blank" rel="noopener noreferrer">
									<i class="fa fa-camera-retro fa-2x" aria-hidden="true"></i>
								</a>
								<a class="link is-hidden" id="linkedin" href="" target="_blank" rel="noopener noreferrer">
									<i class="fa fa-linkedin-square fa-2x" aria-hidden="true"></i>
								</a>
							</div>
						</div>
						<i class="fa fa-times-circle close-icon"
								aria-label="close"
								aria-hidden="true"
								@click="handleCloseClick"
								@keyup.space.prevent="handleCloseClick"
								tabindex="1"
						></i>
					</div>
				</div>
			</transition>

		</div>

		<div class="projects-footer">
			<img src="/static/assets/mountain.png" alt="distressed image of mountain">
		</div>

	</section>
</template>

<script type="text/javascript">
	export default {
		props: {
			data: {
				type: Object
			},
			maxBoxCount: {
				type: Number
			},
		},
		data () {
			return {
				targetedRowID: null,
				targetedProject: null,
			}
		},
		methods: {
			getColor: function (rgb, i) {
				return 'rgba(' + rgb + ',' + (1 - (i / this.maxBoxCount)) + ')'
			},
			getGhostCount(i) {
				return this.maxBoxCount - Object.keys(this.data[i].data).length
			},
			getRowId(i) {
				return this.data[i].displayName.toLowerCase().replace(/\s/g, '-')
			},
			getProjectId(rowI, projI) {
				return this.data[rowI].data[projI].name.toLowerCase().replace(/\s/g, '-')
			},
			handleClick: function (rowI, i) {
				this.targetedProject = this.data[rowI].data[i]
				if (rowI == this.targetedRowID && i != this.targetProjectID) {
					this.updateTargetBlock( document.querySelector('#' + this.getRowId(rowI)) )
				}
				this.targetedRowID = rowI
			},
			handleCloseClick: function () {
				this.targetedRowID = null
			},
			beforeEnter: function (el) {
				this.updateTargetBlock(el);
			},
			updateTargetBlock: function (el) {
				el.querySelector('.project-title').innerHTML = this.targetedProject.name
				el.querySelector('.project-description').innerHTML = this.targetedProject.description
				// some fun projects don't have specs
				if (this.targetedProject.specs)
					el.querySelector('.project-specs').innerHTML = this.targetedProject.specs
				else
					el.querySelectorAll('.specs').forEach((el) => el.classList.add('is-hidden'))
				const domLinks = el.querySelectorAll('.link')
				const projectLinks = Object.keys(this.targetedProject.links);
				for (var i = domLinks.length - 1; i >= 0; i--) {
					if (projectLinks.indexOf(domLinks[i].id) != -1) {
						domLinks[i].setAttribute('href', this.targetedProject.links[domLinks[i].id])
						domLinks[i].classList.remove('is-hidden')
					}
					else {
						domLinks[i].classList.add('is-hidden')
					}
				}
			},
		},
	}
</script>