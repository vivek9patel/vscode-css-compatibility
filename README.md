![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/vivek9patel.vscode-css-compatibility?logo=visualstudiocode)
![Visual Studio Marketplace Version (including pre-releases)](https://img.shields.io/visual-studio-marketplace/v/vivek9patel.vscode-css-compatibility?logo=visualstudiocode)
[![Open VSX](https://img.shields.io/badge/Open%20VSX-vscode--css--compatibility-purple)](https://open-vsx.org/extension/vivek9patel/vscode-css-compatibility)
# CSS Compatibility VScode

CSS Compatibility Checker is a Visual Studio Code extension designed to assist developers in identifying which CSS syntax, keywords, types, or functions are compatible or supported across various browsers and their versions. This extension provides real-time feedback by displaying compatibility information when hovering over CSS elements within your code.

<a href="https://www.buymeacoffee.com/vivek9patel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 140px !important;" ></a>

## Functionality
![demo](https://github.com/vivek9patel/vscode-css-compatibility/raw/main/images/demo.gif)

- **Hover Compatibility Information**: Instantly view compatibility information for CSS syntax, keywords, types, or functions by hovering over them in your code.
    - Deprecation: Easily identify CSS features that are deprecated and should be avoided in your projects.
    
        ![deprecation](https://github.com/vivek9patel/vscode-css-compatibility/raw/main/images/deprecated.png)
    - Non-Standard: Quickly spot CSS features that are non-standard and may not be supported consistently across browsers.
    
        ![non-standard](https://github.com/vivek9patel/vscode-css-compatibility/raw/main/images/non-standard.png)
    - Experimental: Identify CSS features that are still experimental and subject to change, helping you make cautious decisions about their implementation.
    
        ![experimental](https://github.com/vivek9patel/vscode-css-compatibility/raw/main/images/experimental.png)
- **Cross-Browser Support**: Access compatibility data for multiple browsers and their versions.
- **Seamless Integration**: Integrate seamlessly with your existing Visual Studio Code workflow, enhancing your development process without disrupting your productivity.

With version 1.0.2, you can now enable or disable any browser type from which you want to check compatibility for CSS from your vscode's settings.

![configuration](https://github.com/vivek9patel/vscode-css-compatibility/raw/main/images/vscode-settings.png)


## Installation
1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon in the sidebar.
3. Search for "vscode-css-compatibility".
4. Click on the Install button.

## Usage
1. Open a CSS/SCSS/LESS file in Visual Studio Code.
2. Hover over any CSS syntax, keyword, type, or function to view compatibility information.
3. You can enable/disable what browser type you want to check compatibility for in your vscode's settings file under "CSS Compatibility" configuration.
3. Use the provided information to make informed decisions about which CSS features to use in your projects.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributiors who wants to make this extension better can make contribution, which will be **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Added some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
