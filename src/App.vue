<script setup lang="ts">
import paper from "paper";

import Welcome from './components/Welcome.vue'
import Projects from './components/Projects.vue'
import Skills from './components/Skills.vue'

interface Scopes {
  welcome: paper.PaperScope;
  skills: paper.PaperScope;
}

const scopes: Scopes = {
  welcome: new paper.PaperScope(),
  skills: new paper.PaperScope()
}
</script>

<template>
  <Welcome :scope="scopes.welcome" />
  <Projects />
  <Skills :scope="scopes.skills" />
</template>


