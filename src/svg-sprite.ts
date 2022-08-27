/*
 * @Author: Quarter
 * @Date: 2022-08-26 17:17:19
 * @LastEditors: Quarter
 * @LastEditTime: 2022-08-27 15:39:22
 * @FilePath: /vite-plugin-svg/src/svg-sprite.ts
 * @Description: 生成 svg 精灵图
 */

import { readFileSync, readdirSync } from "fs";
import path from "path";
import SVGSpriter, { Config } from "svg-sprite";
import { OptimizedSvg } from "svgo";
import { createFilter } from "vite";
import { svgo } from "./svgo";
import { renderNode, svgToElement } from "./svg-info-check";

// 是否是 svg 文件
const isSvg = /\.svg$/;

/**
 * @description: 生成配置
 * @param {string} prefix 前缀
 * @return {Config}
 */
const generateConfig = (prefix = "icon"): Config => ({
  mode: {
    inline: true,
    symbol: true,
  },
  svg: {
    xmlDeclaration: false,
    doctypeDeclaration: false,
    namespaceClassnames: false,
    rootAttributes: {},
  },
  shape: {
    id: {
      generator(name: string) {
        const svgPath = name.split("/");
        return `${prefix}-${svgPath[svgPath.length - 1].replace(".svg", "")}`;
      },
    },
    dimension: {
      maxWidth: 16,
      maxHeight: 16,
      attributes: false,
    },
  },
});

/**
 * @description: 加载 svg 文件
 * @param {SVGSpriter.SVGSpriter} svgSpriter 实例
 * @param {string} dir 目录
 * @param {function} filter 过滤器
 * @return
 */
export const loadSvgFile = (
  svgSpriter: SVGSpriter.SVGSpriter,
  dir: string,
  filter: ReturnType<typeof createFilter>,
): void => {
  const dirents = readdirSync(dir, {
    withFileTypes: true,
  });
  for (const dirent of dirents) {
    const filePath = path.resolve(dir, dirent.name).toString();
    if (filter(filePath)) {
      if (dirent.isDirectory()) {
        loadSvgFile(svgSpriter, filePath, filter);
      } else if (isSvg.test(filePath)) {
        const svgStr = readFileSync(filePath).toString();
        const { data = "", error } = svgo(svgStr) as OptimizedSvg;
        if (error) {
          // eslint-disable-next-line no-console
          console.error(`[${filePath}] Parse svg error: ${error}`);
          continue;
        }
        const raw = renderNode(svgToElement(data, { replaceColor: true }));
        svgSpriter.add(filePath, dirent.name, raw);
      }
    }
  }
};

/**
 * @description: 生成 svg 精灵图字符串
 * @param {string} dir 索引文件夹
 * @param {function} filter 过滤器
 * @param {string} prefix 前缀
 * @return {string}
 */
export const transformSvgSprite = (
  dir: string,
  filter: ReturnType<typeof createFilter>,
  prefix: string,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const spriter = new SVGSpriter(generateConfig(prefix));
    loadSvgFile(spriter, dir, filter);
    spriter.compile((error, { symbol: { sprite } }) => {
      if (error) {
        reject(error);
      }
      if (sprite && sprite.contents) {
        resolve(sprite.contents.toString());
      }
    });
  });
};
