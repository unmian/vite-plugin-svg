/*
 * @Author: Quarter
 * @Date: 2022-05-18 02:56:22
 * @LastEditTime: 2022-08-27 15:39:39
 * @LastEditors: Quarter
 * @Description: 类型声明文件
 * @FilePath: /vite-plugin-svg/src/types.ts
 */

import type { FilterPattern } from "vite";

// 配置项
export interface Options {
  exclude?: FilterPattern; // 排除路径
  include?: FilterPattern; // 包含路径
  prefix?: string; // 前缀
}

// 已处理配置项
export type ResolvedOptions = Required<Options>;
