# Formate: CSS, LESS and SCSS Formatter
VSCode plugin to format your CSS / LESS and SCSS files which can **vertical align** properties. See image for an demo.

![Formate: Vertical alignment](images/demo.gif)

## Installation
Install through VS Code extensions. Search for formate.

## Usage
On Windows:
1. CTRL + Shift + P -> Format Document
2. CTRL + ALT + F

On Mac:
1. CMD + Shift + P -> Format Document
2. CMD + ALT + F

## Extension Settings
| Setting                           | Description                                         | Type    | Default  |
|:--------------------------------- |:----------------------------------------------------|:-------:|:--------:|
| formate.enable                    | Enables/disables the extension                      | boolean | true     |
| formate.verticalAlignProperties   | Controls if properties should be aligned vertically | boolean | true     |
| formate.additionalSpaces          | if vertical alignment is on, this setting is to add extra spaces | boolean | 0     |
| formate.alignColon          | whether colon should be vertical aligned or not | boolean | true    |



## Release Notes

| Version | Notes |
|:--------|:------|
| 1.0.0   | Initial release of CSS, LESS and SCSS Formatter
| 1.0.1   | Few minor changes in package.json to publish to the marketplace.
| 1.1.0   | Added setting "formate.additionalSpaces" to insert additional spaces if required.
| 1.1.1   | Updated dependencies to fix the "potential security vulnerability" message.
