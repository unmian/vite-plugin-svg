/*
 * @Author: Quarter
 * @Date: 2022-05-20 13:37:49
 * @LastEditors: Quarter
 * @LastEditTime: 2022-08-29 18:24:17
 * @FilePath: /vite-plugin-svg/src/index.ts
 * @Description: 入口文件
 */

import { createFilter, HtmlTagDescriptor, Plugin } from "vite";
import { Options } from "./types";
import { resolveOptions } from "./options";
import { transformSvgSprite } from "./svg-sprite";

/**
 * @description: SVG 精灵图插件
 * @author: Quarter
 * @param {Options} options 配置项
 * @return {Plugin}
 */
const SvgSpritePlugin = (options: Options = {}): Plugin => {
  const resolvedOptions = resolveOptions(options);
  const { include, exclude, prefix } = resolvedOptions;
  const filter = createFilter(include, exclude);
  return {
    name: "svg-sprite-plugin",
    transformIndexHtml: (): Promise<HtmlTagDescriptor[]> => {
      return new Promise<HtmlTagDescriptor[]>((resolve, reject) => {
        transformSvgSprite(".", filter, prefix)
          .then((str) => {
            resolve([
              {
                tag: "div",
                attrs: {
                  "autoGenerated-from": "vite-plugin-svg",
                  style: "position: absolute;width: 0;height: 0;visibility: hidden",
                },
                children: str,
                injectTo: "body-prepend",
              },
            ]);
          })
          .catch((error) => reject(error));
      });
    },
  };
};

export default SvgSpritePlugin;
