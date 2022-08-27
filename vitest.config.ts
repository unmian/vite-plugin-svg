/*
 * @Author: Quarter
 * @Date: 2022-08-27 14:11:13
 * @LastEditors: Quarter
 * @LastEditTime: 2022-08-27 15:39:05
 * @FilePath: /vite-plugin-svg/vitest.config.ts
 * @Description: vitest 配置
 */

/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
