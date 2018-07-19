# PORTFOLIO

Look at all the cool stuff I've done.

Built with Webpack 4 and Vue.js

See it live in action on the internet at [Blake Netzeband . com](https://www.blakenetzeband.com)

## Notes to future self and anyone who reads this:
* Uses Hot Module Loading
* Split all .css files from .vue file. Split .js files when sensible (i.e. projects.vue)
* Everything in assets/images/ are directly copied to dist/
* CSS in assets/stylesheets uses vue-style-loader
* global included in App.vue
* Shape of data object is defined on top of data file
* Name of data files is *componentName*-*subComponentName*.js
* npm commands:
```
$ npm run dev
$ npm run build
```

## Stuff I could do better...
* Codespliting - main.js is too big
* Shrink png files even more? idk look into this because they're already compressed