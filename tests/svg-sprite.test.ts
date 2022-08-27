/*
 * @Author: Quarter
 * @Date: 2022-08-27 10:21:37
 * @LastEditors: Quarter
 * @LastEditTime: 2022-08-27 15:37:26
 * @FilePath: /vite-plugin-svg/tests/svg-sprite.test.ts
 * @Description: svg 精灵图测试
 */

import path from "path";
import { createFilter } from "vite";
import { describe, expect, test } from "vitest";
import { transformSvgSprite } from "../src/svg-sprite";

describe("func transformSvgSprite", () => {
  test("right type of result ", () => {
    const filter = createFilter("icons/**");
    transformSvgSprite(path.resolve(__dirname, ".."), filter, "test").then(
      (str) => expect(str).toBeTypeOf("string")
    );
  });
});
