# @quarter/vite-plugin-svg

SVG Icon Plugin for Vite

- Transform svg file as svg sprite

## Install

Config repository

```
// .yarnrc
"@quarter:registry" "https://npm.lescity.com.cn/"

//.npmrc
@quarter:registry=https://npm.lescity.com.cn/
```

Install

```bash
# npm
npm i @quarter/vite-plugin-svg -D
# yarn
yarn add @quarter/vite-plugin-svg -D
```

Add it to `vite.config.js`

```ts
// vite.config.js
import Vue from "@vitejs/plugin-vue";
import SvgSprite from "@quarter/vite-plugin-svg";

export default {
  plugins: [
    SvgSprite({
      include: [ "icons/**" ],
    }),
  ],
}
```

## Options

See [the tsdoc](./src/types.ts) for more advanced options

## License

MIT License © 2022-PRESENT [Quarter](https://github.com/unmian)