<template>
  <section class="projects">
    <h2>Projects</h2>

    <div v-for="(projects, rowI) in data" :key="projects.displayName" class="project-row">
      <h3>{{ projects.displayName }}</h3>

      <div class="row-container">
        <div v-for="(project, i) in projects.data" :id="getProjectId(rowI, i)" :key="projects.displayName + '-' + i"
          class="project-square" :style="{ background: getColor(projects.rgb, i) }" tabindex="1"
          @click="handleClick(rowI, i)" @keyup.space.prevent="handleClick(rowI, i)">
          <p>{{ project.name }}</p>
        </div>

        <div v-for="(box, i) in getGhostCount(rowI)" :key="'ghost-' + i" class="project-square ghost" :style="{
          background: getColor(
            projects.rgb,
            maxBoxCount - getGhostCount(rowI) + i
          ),
        }"></div>
      </div>

      <div v-show="targetedRowID == rowI" :id="getRowId(rowI)" class="project-details"
        :style="{ color: 'rgb(' + projects.rgb + ')' }">
        <h3 class="project-title"></h3>
        <p class="project-description"></p>

        <h4 class="specs">Built with:</h4>
        <p class="project-specs specs"></p>

        <div class="project-links" :style="{ color: 'rgb(' + projects.rgb + ')' }">
          <a id="github" class="link is-hidden" href="" target="_blank" rel="noopener noreferrer">
            <i class="hover fa fa-github-square fa-2x" aria-hidden="true"></i>
          </a>
          <a id="url" class="link is-hidden" href="" target="_blank" rel="noopener noreferrer">
            <i class="hover fa fa-desktop fa-2x" aria-hidden="true"></i>
          </a>
          <a id="youtube" class="link is-hidden" href="" target="_blank" rel="noopener noreferrer">
            <i class="hover fa fa-youtube-square fa-2x" aria-hidden="true"></i>
          </a>
          <a id="pics" class="link is-hidden" href="" target="_blank" rel="noopener noreferrer">
            <i class="hover fa fa-camera-retro fa-2x" aria-hidden="true"></i>
          </a>
          <a id="linkedin" class="link is-hidden" href="" target="_blank" rel="noopener noreferrer">
            <i class="hover fa fa-linkedin-square fa-2x" aria-hidden="true"></i>
          </a>
          <a id="behance" class="link is-hidden" href="" target="_blank" rel="noopener noreferrer">
            <i class="hover fa fa-behance-square fa-2x" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="projects-footer">
      <img src="/images/mountain.png" alt="distressed image of mountain" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ScrollReveal from 'scrollreveal'

import { liveProjects, schoolProjects, funProjects } from '../assets/data/projects'


interface Data {
  displayName: string
  data: ProjectData[]
  rgb: string
}

interface ProjectSectionData {
  targetedRowID?: number
  targetedProject: ProjectData
  data: Data[]
  maxBoxCount: number
}

const data: Data[] = [
  {
    displayName: 'In The Wild',
    data: liveProjects,
    rgb: '208, 143, 140',
  },
  {
    displayName: 'Escuela',
    data: schoolProjects,
    rgb: '78, 111, 133',
  },
  {
    displayName: 'Just For Fun',
    data: funProjects,
    rgb: '208, 168, 117',
  },
]

const minBoxCount = 8 // hard coded for now. not really needed to loop through every project
const maxBoxCount = window.innerWidth / 128 > minBoxCount
  ? (window.innerWidth - 64) / 128 // (window - padding) / projectSquare
  : minBoxCount

export default defineComponent({
  name: 'ProjectsSection',

  data(): ProjectSectionData {
    return {
      targetedRowID: undefined,
      targetedProject: {} as ProjectData,
      data,
      maxBoxCount,
    }
  },

  mounted() {
    ScrollReveal().reveal(
      '.project-square',
      {
        duration: 1000,
        delay: 250,
        origin: 'right',
      },
      50
    )
  },

  methods: {
    getColor: function (rgb: string, i: number) {
      return 'rgba(' + rgb + ',' + (1 - i / this.maxBoxCount) + ')'
    },
    getGhostCount(i: number) {
      return Math.floor(
        this.maxBoxCount - Object.keys(this.data[i].data).length
      )
    },
    getRowId(i: number) {
      return this.data[i].displayName.toLowerCase().replace(/\s/g, '-')
    },
    getProjectId(rowI: number, projI: number) {
      return this.data[rowI].data[projI].name.toLowerCase().replace(/\s/g, '-')
    },
    handleClick: function (rowI: number, i: number) {
      this.targetedProject = this.data[rowI].data[i]
      this.targetedRowID = rowI

      const el = document.querySelector<HTMLElement>('#' + this.getRowId(rowI))
      if (el) {
        this.updateDetailSection(el)
      }
    },
    updateDetailSection: function (el: HTMLElement) {
      // update name, description and specs (if project has specs)
      el.querySelector('.project-title')!.innerHTML = this.targetedProject.name
      el.querySelector('.project-description')!.innerHTML =
        this.targetedProject.description
      if (this.targetedProject.specs) {
        el.querySelector('.project-specs')!.innerHTML =
          this.targetedProject.specs
      } else {
        el.querySelectorAll('.specs').forEach((el) =>
          el.classList.add('is-hidden')
        )
      }
      // update links
      if (this.targetedProject.links) {
        const domLinks = el.querySelectorAll('.link')
        const projectLinks = Object.keys(this.targetedProject.links)
        for (let i = domLinks.length - 1; i >= 0; i--) {
          const domLink = domLinks[i]
          const possibleLink = this.targetedProject.links[domLink.id as Link]
          if (projectLinks.includes(domLink.id) && possibleLink) {
            domLinks[i].setAttribute('href', possibleLink)
            domLink.classList.remove('is-hidden')
          } else {
            domLink.classList.add('is-hidden')
          }
        }
      }
    },
  },
})
</script>
<style src="../assets/stylesheets/projects.css" scoped></style>