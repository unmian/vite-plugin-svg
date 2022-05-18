import { HtmlTagDescriptor, Plugin } from "vite"
import { readFileSync, readdirSync } from "fs"
import { Options, ResolvedOptions } from "./types"
import { resolveOptions } from "./options"
import { CreateFilter, createFilter, FilterPattern } from "@rollup/pluginutils"
import path from "path"

// 是否是 svg 文件
const isSvg = /\.svg$/;
// svg 标题
const svgTitle = /<svg([^>+].*?)>/;
// svg 宽高正则
const clearHeightWidth = /(width|height)="([^>+].*?)"/g;
// svg 视图容器正则
const clearViewBox = /viewBox="([^>+].*?)"/g;
// 是否存在视图容器
const hasViewBox = /(viewBox="[^>+].*?")/g;
// 换行正则
const clearReturn = /(\r)|(\n)/g;

/**
 * @description: 遍历 svg 文件
 * @author: Quarter
 * @param {string} dir 文件夹
 * @param {function} filter 文件过滤器
 * @param {string} prefix 前缀
 * @param {string} joiner 连接符
 * @return {HtmlTagDescriptor[]}
 */
const traverseSvgFile = (dir: string, filter: ReturnType<CreateFilter>, prefix: string, joiner: string): HtmlTagDescriptor[] => {
  const symbolTags = [] as HtmlTagDescriptor[];
  const dirents = readdirSync(dir, {
    withFileTypes: true,
  });
  for (const dirent of dirents) {
    const filePath = path.resolve(dir, dirent.name).toString();
    if (filter(filePath)) {
      if (dirent.isDirectory()) {
        symbolTags.push(...traverseSvgFile(filePath, filter, prefix, joiner));
      } else if (isSvg.test(filePath)) {
        const id = `#${prefix}-${dirent.name.replace(/\.svg$/g, "").replace(/[_\-*&^%$#@!=+\[\]<>,.]+/g, joiner)}`;
        let viewBox = "";
        const svgStr = readFileSync(filePath)
          .toString()
          .replace(clearReturn, "")
          .replace(svgTitle, ($1: string, $2: string) => {
            let width = "0";
            let height = "0";
            $2.replace(clearHeightWidth, (s1: string, s2: string, s3: string) => {
              if (s2 === "width") {
                width = s3;
              } else if (s2 === "height") {
                height = s3;
              }
              return "";
            }
            )
            $2.replace(clearViewBox, (s1: string, s2: string) => {
              viewBox = s2;
              return "";
            })
            if (!hasViewBox.test($2)) {
              viewBox = `0 0 ${width} ${height}`;
            }
            return "";
          })
          .replace("</svg>", "")
        symbolTags.push({
          tag: "symbol",
          attrs: {
            id,
            fill: "none",
            viewBox,
            xmlns: "http://www.w3.org/2000/svg",
          },
          children: svgStr,
        })
      }
    }
  }
  return symbolTags;
}

/**
 * @description: svg 精灵图
 * @author: Quarter
 * @param {Options} options 配置项
 * @return {Plugin}
 */
const SvgSprite = (options: Options = {}): Plugin => {
  const resolvedOptions = resolveOptions(options);
  const { include, exclude, prefix, joiner } = resolvedOptions;
  const filter = createFilter(include, exclude);
  const symbolTags = traverseSvgFile(".", filter, prefix, joiner);
  return {
    name: "svg-converter",
    transformIndexHtml(): HtmlTagDescriptor[] {
      return [
        {
          tag: "svg",
          attrs: {
            xmlns: "http://www.w3.org/2000/svg",
            "xmlns:xlink": "http://www.w3.org/1999/xlink",
            style: "width: 0; height: 0; position: absolute; visibility: hidden",
          },
          children: symbolTags,
          injectTo: "body-prepend",
        }
      ];
    }
  }
}

export default SvgSprite;