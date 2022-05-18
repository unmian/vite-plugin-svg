/*
 * @Author: Quarter
 * @Date: 2022-05-18 02:56:22
 * @LastEditTime: 2022-05-18 03:17:55
 * @LastEditors: Quarter
 * @Description: 合并用户配置项
 * @FilePath: /vite-plugin-svg/src/options.ts
 */

import type { Options, ResolvedOptions } from "./types"

export const resolveOptions = (userOptions: Options): ResolvedOptions => {
  const options = Object.assign({
    exclude: [],
    include: [],
    joiner: "-",
    prefix: "icon",
  }, userOptions) as ResolvedOptions;

  return options;
}
