<template>
  <section class="skills">
    <canvas id="paper-canvas-skills" resize="true"></canvas>

    <section class="skills-header">
      <div class="skills-sr">
        <div class="skills-heading">
          <h2>Skills</h2>
          <p id="skills-tip">(Feel free to click around...)</p>
        </div>
        <img src="/images/hand.png" alt="a retro-styled image of a pointing hand" />
      </div>
    </section>

    <section class="skills-row">
      <div v-for="skillObj in data" class="skills-column" :key="skillObj.category">
        <h3>{{ skillObj.category }}</h3>
        <ul>
          <li v-for="item in skillObj.skills" :key="item">{{ item }}</li>
        </ul>
      </div>
    </section>

    <section class="svg-wrapper">
      <svg width="500" height="150" viewBox="0 0 500 150">
        <defs>
          <pattern id="pattern" x="0" y="5" width="500" height="15" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="500" y2="0" stroke-width="10" stroke="black"></line>
          </pattern>
        </defs>
        <ellipse cx="250" cy="180" rx="250" ry="150" fill="url(#pattern)"></ellipse>
      </svg>
    </section>

    <footer class="icons">
      <a v-for="link in links" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">
        <i class="hover fa fa-2x" :class="link.icon" aria-hidden="true"></i>
      </a>
    </footer>
  </section>
</template>

<script lang="ts">
import paper from 'paper'
import { defineComponent } from 'vue'
import ScrollReveal from 'scrollreveal'

import { skills } from '../assets/data/skills'

interface SkillsDataType {
  data: SkillData[]
  links: SkillLink[]
  path: paper.Path | null
}

const links: SkillLink[] = [
  {
    href: 'https://github.com/blakenetz',
    icon: 'fa-github',
  },
  {
    href: 'https://medium.com/@blakenetz',
    icon: 'fa-medium',
  },
  {
    href: 'https://www.behance.net/blakenetz',
    icon: 'fa-behance',
  },
  {
    href: 'https://www.linkedin.com/in/blakenetz',
    icon: 'fa-linkedin',
  },
  {
    href: 'mailto:blake.netzeband@gmail.com',
    icon: 'fa-envelope',
  },
]




export default defineComponent({
  name: 'SkillsSection',
  props: {
    scope: { type: paper.PaperScope, required: true }
  },

  data(): SkillsDataType {
    return {
      data: skills,
      links,
      path: null,
    }
  },

  mounted() {
    this.scope.setup('paper-canvas-skills')
    this.scope.activate()

    this.path = new this.scope.Path({
      strokeColor: 'rgba(138, 254, 225, 0.5)',
      strokeWidth: 15,
      strokeCap: 'round',
    })

    this.scope.view.onClick = (e: paper.MouseEvent) => {
      if (this.path) {
        this.path.add(e.point)
      }
    }

    this.scope.view.onDoubleClick = (_e: paper.MouseEvent) => {
      if (this.path?.strokeColor) {
        this.path.strokeColor.hue = Math.random() * 360
      }
    }

    ScrollReveal().reveal(
      '.skills-sr',
      {
        origin: 'right',
        duration: 2000,
        distance: '100%',
        mobile: false,
        viewFactor: 0.5,
        afterReveal: function (el: HTMLElement) {
          const img = el.querySelector('img')
          if (img) {
            img.classList.add('animate')
          }
        },
      },
      50
    )
  },
})
</script>

<style src="../assets/stylesheets/skills.css" scoped></style>