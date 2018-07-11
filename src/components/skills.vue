<template>
	<section class="skills">
		<div class="skills-header">
			<h2>Skills</h2>
		</div>

		<div class="skills-row">
			<div v-for="skillObj in data" class="skills-column">
				<h3>{{skillObj.category}}</h3>
				<ul>
					<li v-for="item in skillObj.skills">{{item}}</li>
				</ul>
			</div>
		</div>

	</section>
</template>

<script type="text/javascript">
	export default {
		props: ['data'],
	}
</script>