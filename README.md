# @unmian/vite-plugin-svg

> 生成 SVG 精灵图的 Vite 插件

## 安装

配置私有仓库

```txt
// .yarnrc
"@unmian:registry" "https://npm.lescity.com.cn/"

//.npmrc
@unmian:registry=https://npm.lescity.com.cn/
```

安装依赖

```shell
# npm
npm i -D @unmian/vite-plugin-svg
# yarn
yarn add -D @unmian/vite-plugin-svg
# pnpm
pnpm install -D @unmian/vite-plugin-svg
```

修改配置文件并引入

```ts
// vite.config.js
import SvgSprite from "@unmian/vite-plugin-svg";

export default {
  plugins: [
    SvgSprite({
      include: ["icons/**"],
    }),
  ],
};
```

## 可选配置项

查看 [TS 声明文档](./src/types.ts) 来了解更多可选配置项的相关信息

## 许可

MIT License © 2022-PRESENT [Quarter](https://github.com/unmian)
