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

			// glasses
			const leftGlass = new Path.Circle({
				center: [100, 70],
				radius: 50,
			})
			const rightGlass = leftGlass.clone()
			rightGlass.position.x += (rightGlass.bounds.width * 1.5)
			const bridge = new Path.Arc({
				from: [leftGlass.bounds.rightCenter.x, leftGlass.bounds.rightCenter.y],
				through: [leftGlass.bounds.rightCenter.x * 1.33, leftGlass.bounds.rightCenter.y * 0.99],
				to: [rightGlass.bounds.leftCenter.x, rightGlass.bounds.leftCenter.y],
			});
			const glasses = new Group({
				children: [rightGlass, bridge, leftGlass],
				strokeColor: 'black',
				strokeWidth: 10
			})

			// eyes
			const leftEye = leftGlass.clone()
			leftEye.scale(0.5)
			const rightEye = rightGlass.clone()
			rightEye.scale(0.5)
			const eyes = new Group({
				children: [rightEye, leftEye],
				strokeColor: 'white',
				strokeWidth: 20,
				fillColor: 'navy',
			})

			this.paper.view.onFrame = function(e) {
				for (var i = eyes.children.length - 1; i >= 0; i--) {
					for (var j = eyes.children[i].segments.length - 1; j >= 0; j--) {
						eyes.children[i].segments[j].point.x += Math.random() * 0.4 - 0.2
					}
					eyes.children[i].rotate(0.1);
				}
			}
		}
	}
</script>

<style src="../../assets/stylesheets/welcome.css" scoped></style>