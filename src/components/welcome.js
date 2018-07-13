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

		// GLASSES
		const leftGlass = new Path.Circle({
			center: [100, 150],
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
			strokeColor: '#303a49',
			strokeWidth: 10,
		})

		// EYES
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

		// NOSE
		const nose = new Path({
			strokeColor: '#5DFDD5',
			strokeWidth: 7,
		});
		nose.add(
			{
				// top of nose
				x: leftGlass.bounds.rightCenter.x,
				y: leftGlass.bounds.rightCenter.y - leftGlass.bounds.height
			},
			{
				// tip of nose
				x: rightGlass.bounds.leftCenter.x,
				y: rightGlass.bounds.leftCenter.y + rightGlass.bounds.height
			},
			{
				// nostril
				x: leftGlass.bounds.leftCenter.x + (leftGlass.bounds.width / 2),
				y: rightGlass.bounds.leftCenter.y + leftGlass.bounds.height
			}
		)

		// ANIMATE
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