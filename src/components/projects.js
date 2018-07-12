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