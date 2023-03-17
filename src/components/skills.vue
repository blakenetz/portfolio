<template>
  <section class="skills">
    <canvas id="paper-canvas-skills" resize="true"></canvas>

    <section class="skills-header">
      <div class="skills-sr">
        <div class="skills-heading">
          <h2>Skills</h2>
          <p id="skills-tip">(Feel free to click around...)</p>
        </div>
        <img
          src="~/assets/images/hand.png"
          alt="a retro-styled image of a pointing hand"
        />
      </div>
      <p class="skills-text">
        There's 2 ways to go about this section. I could either list every bit
        of tech I've touched, which would probably be outdated by the time you
        read it. Or I could give you the ten-thousand foot view. I think I'll go
        with the later.
      </p>
      <p class="skills-text">
        At this point in my career, I consider myself in expert in web
        technologies, especially those leaning towards the front-end.
      </p>
      <ul>
        <li>
          I have extensive experience with React and its forever expanding
          ecosystem. I've created and deployed countless apps and mentored
          countless more developers in React. I've professional experience with
          numerous React-adjacent tools, such as React Native, Next.js,
          developing UI libraries; and React project skills such as crafting
          custom build tools, architecting mono-repos and other complex apps,
          etc.
        </li>
        <li>
          I have professional experience in UI/UX design, including asset
          creation, developing mock-ups for stakeholders and running usability
          tests. I believe UI/UX includes the consideration of
          <i>all</i> users, which is why I make all my apps WCAG compliant.
        </li>
      </ul>
      <p class="skills-text">
        In short, I have all the tools needed to bring an idea into a successful
        production-ready app.
      </p>
    </section>

    <div class="svg-wrapper">
      <svg width="500" height="150" viewBox="0 0 500 150">
        <defs>
          <pattern
            id="pattern"
            x="0"
            y="5"
            width="500"
            height="15"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="500"
              y2="0"
              stroke-width="10"
              stroke="black"
            ></line>
          </pattern>
        </defs>
        <ellipse
          cx="250"
          cy="180"
          rx="250"
          ry="150"
          fill="url(#pattern)"
        ></ellipse>
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

<script lang="ts">
import paper from 'paper'
import { defineComponent } from 'vue'

import data from '~/assets/data/skills-skills'

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

const scope = new paper.PaperScope()
scope.setup('paper-canvas-skills')

export default defineComponent({
  name: 'SkillsSection',

  data(): SkillsDataType {
    return {
      data,
      links,
      path: null,
    }
  },

  mounted() {
    scope.activate()

    this.path = new scope.Path({
      strokeColor: 'rgba(138, 254, 225, 0.5)',
      strokeWidth: 15,
      strokeCap: 'round',
    })

    scope.view.onClick = (e: paper.MouseEvent) => {
      if (this.path) {
        this.path.add(e.point)
      }
    }

    scope.view.onDoubleClick = (_e: paper.MouseEvent) => {
      if (this.path?.strokeColor) {
        this.path.strokeColor.hue = Math.random() * 360
      }
    }

    this.$ScrollReveal().reveal(
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

<style src="~/assets/stylesheets/skills.css" scoped></style>