/*
 * @Author: Quarter
 * @Date: 2022-05-18 02:56:22
 * @LastEditTime: 2022-08-27 15:22:32
 * @LastEditors: Quarter
 * @Description: 合并用户配置项
 * @FilePath: /vite-plugin-svg/src/options.ts
 */

import type { Options, ResolvedOptions } from "./types";

/**
 * @description: 解析配置项
 * @param {Options} userOptions 用户配置项
 * @return {ResolvedOptions}
 */
export const resolveOptions = (userOptions: Options): ResolvedOptions => {
  const options = Object.assign(
    {
      exclude: [],
      include: [],
      prefix: "icon",
    },
    userOptions
  ) as ResolvedOptions;

  return options;
};
