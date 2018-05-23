# To start

This is a project template for [vue-cli](https://github.com/vuejs/vue-cli)

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```

# Folder structure
* build - webpack config files
* config - webpack config files
* dist - build
* src - app
    * api
    * assets
    * common
    * components - vue components
    * mock
    * styles
    * views - pages
    * vuex
    * App.vue
    * main.js - main file
    * routes.js
* static - static assets

# Theme
You can change theme by 
1. [element-ui](http://element-cn.eleme.io)
2. Put theme packages in src/assets/theme/
3. Edit src/main.js 
``` bash
   import 'element-ui/lib/theme-chalk/index.css'
```
4. Edit src/styles/vars.scss

# Browser support

Modern browsers and IE 10+.

# License
[MIT](http://opensource.org/licenses/MIT)
