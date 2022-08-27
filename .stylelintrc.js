module.exports = {
  extends: "stylelint-config-ali",
  rules: {
    "color-hex-length": "long",
    "selector-pseudo-element-no-unknown": [true, ["v-deep"]],
  },
};
