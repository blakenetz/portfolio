import ScrollReveal from "scrollreveal";

export default {
  props: {
    data: Object,
    maxBoxCount: Number,
  },

  data() {
    return {
      targetedRowID: null,
      targetedProject: null,
    };
  },

  created() {
    window.sr = ScrollReveal();
  },

  mounted() {
    sr.reveal(
      ".project-square",
      {
        duration: 1000,
        delay: 250,
        origin: "right",
      },
      50
    );
  },

  methods: {
    getColor: function(rgb, i) {
      return "rgba(" + rgb + "," + (1 - i / this.maxBoxCount) + ")";
    },
    getGhostCount(i) {
      return this.maxBoxCount - Object.keys(this.data[i].data).length;
    },
    getRowId(i) {
      return this.data[i].displayName.toLowerCase().replace(/\s/g, "-");
    },
    getProjectId(rowI, projI) {
      return this.data[rowI].data[projI].name.toLowerCase().replace(/\s/g, "-");
    },
    handleClick: function(rowI, i) {
      this.targetedProject = this.data[rowI].data[i];
      this.targetedRowID = rowI;
      this.updateDetailSection(
        document.querySelector("#" + this.getRowId(rowI))
      );
    },
    updateDetailSection: function(el) {
      // update name, description and specs (if project has specs)
      el.querySelector(".project-title").innerHTML = this.targetedProject.name;
      el.querySelector(
        ".project-description"
      ).innerHTML = this.targetedProject.description;
      if (this.targetedProject.specs) {
        el.querySelector(
          ".project-specs"
        ).innerHTML = this.targetedProject.specs;
      } else {
        el.querySelectorAll(".specs").forEach(el =>
          el.classList.add("is-hidden")
        );
      }
      // update links
      const domLinks = el.querySelectorAll(".link");
      const projectLinks = Object.keys(this.targetedProject.links);
      for (var i = domLinks.length - 1; i >= 0; i--) {
        if (projectLinks.indexOf(domLinks[i].id) != -1) {
          domLinks[i].setAttribute(
            "href",
            this.targetedProject.links[domLinks[i].id]
          );
          domLinks[i].classList.remove("is-hidden");
        } else {
          domLinks[i].classList.add("is-hidden");
        }
      }
    },
  },
};
