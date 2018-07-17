import paper from 'paper'
import ScrollReveal from 'scrollreveal'

export default {
	props: ['data'],

	created() {
		if ( ! window.sr) window.sr = ScrollReveal();
	},

	mounted() {
		this.paper = paper.setup('paper-canvas-skills')

		const clickShape = new Path({
			strokeColor: '#8AFEE1',
			strokeWidth: 15,
			strokeCap: 'round',
		});

		this.paper.view.onClick = (e) => {
			clickShape.add(e.point)
		}

		this.paper.view.onDoubleClick = (e) =>  {
			clickShape.strokeColor.hue = Math.random() * 360;
		}

		sr.reveal('.skills-header', {
			origin: 'right',
			duration: 2000,
			distance: '100%',
			mobile: false,
			viewFactor: 0.5,
			afterReveal: function(el) {
				const img = el.querySelector('img')
				img.classList.add('animate')
			}
		}, 50)

	}
}