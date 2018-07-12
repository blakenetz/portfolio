<template>
	<section class="welcome">
		<canvas id="paper-canvas" resize></canvas>
		<div class="welcome-text">
			<h1>Blake Netzeband</h1>
			<h2>Web Developer</h2>
		</div>
	</section>
</template>

<script type="text/javascript">
	import paper from 'paper'

	export default {
		data () {
			return {
				paper: null //paperObject
			}
		},
		created() {
			paper.install(window) // unfortunately need to attach paper to global scope
		},
		mounted() {
			this.paper = paper.setup('paper-canvas')
			var path = new paper.Path();
      path.strokeColor = 'black';
      path.moveTo(new paper.Point(500, 500));
      path.lineTo(new paper.Point(150, 150));

		}
	}
</script>

<style src="../../assets/stylesheets/welcome.css" scoped></style>