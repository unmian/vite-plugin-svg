import { HtmlTagDescriptor, Plugin } from "vite"
import { readFileSync, readdirSync } from "fs"
import { Options } from "./types"
import { resolveOptions } from "./options"
import { CreateFilter, createFilter } from "@rollup/pluginutils"
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
// 填充色替换
const clearFill = /(fill="[^>+].*?")/g;
// 是否存在定义内容
const hasDefs = /(<defs[^>+]*>)(.*)(<\/defs>)/g;
// 换行正则
const clearReturn = /(\r)|(\n)/g;

/**
 * @description: 生成随机字符串
 * @author: Quarter
 * @param {number} len 字符串长度
 * @return {string}
 */
const randomString = (len: number = 32): string => {
  var t = "abcdefhijkmnprstwxyz",
    a = t.length,
    n = "";
  for (let i = 0; i < len; i++) {
    n += t.charAt(Math.floor(Math.random() * a));
  }
  return n
}

// id 随机字符串
const randomStr = randomString(6);
// id 编号
let counter = 0;

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
        const id = `${prefix}-${dirent.name.toLowerCase().replace(/\.svg$/g, "").replace(/[_\-*&^%$#@!=+\[\]<>,.]+/g, joiner)}`;
        let viewBox = "";
        let svgStr = readFileSync(filePath)
          .toString()
          .replace(clearReturn, "");
        if (hasDefs.test(svgStr)) {
          console.warn(`Jump over ${filePath} for <defs> tag`);
          continue;
        }
        svgStr = svgStr.replace(svgTitle, (_: string, $2: string) => {
          let width = "0";
          let height = "0";
          $2.replace(clearHeightWidth, (_: string, s2: string, s3: string) => {
            if (s2 === "width") {
              width = s3;
            } else if (s2 === "height") {
              height = s3;
            }
            return "";
          }
          )
          $2.replace(clearViewBox, (_: string, s2: string) => {
            viewBox = s2;
            return "";
          })
          if (!hasViewBox.test($2)) {
            viewBox = `0 0 ${width} ${height}`;
          }
          return "";
        })
          .replace("</svg>", "")
          .replace(clearFill, `fill="currentColor"`);
        symbolTags.push({
          tag: "symbol",
          attrs: {
            id,
            fill: "none",
            viewBox,
            xmlns: "http://www.w3.org/2000/svg",
          },
          children: svgStr,
        });
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
          children: [
            {
              tag: "defs",
              children: symbolTags,
            }
          ],
          injectTo: "body-prepend",
        }
      ];
    }
  }
}

export default SvgSprite;