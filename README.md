# GameNamePending
An awesome new Roguelike written in Javascript.

## Developing & Building
We don't use any new-fangled Javascript build system or anything like that. This makes "building" less of a headache. We do use RequireJS to manage Javascript modules, but this is purely client side.

To run the game, you will require a local web server. For testing, I recommend XAMPP, as it's simple to set up and will do everything required. Grab that here: https://www.apachefriends.org/index.html

Other options include WAMP on Windows, or a standard apache installation on Linux. Further instruction will assume a XAMPP installation, but the method is more or less the same for most configurations.

After XAMPP is up and running, you have 2 options:
1. (easy) clone the git repository directly into the XAMPP htdocs directory and work out of there.
2. (more config) set up an apache alias to point to another location where the local repo is located.

Then, while the web server is running, simply navigate to http://localhost/folder-of-repo

## Additional reading
We use RequireJS for splitting the code up into multiple files. The documentation for that system can be found here: http://requirejs.org/docs/api.html

We use the JSFace class system. Usage can be found here: https://github.com/tnhu/jsface

JSFace has a lot more features than we need. Being familiar with basic class declaration and inheritance is good enough for our purposes.

UnderscoreJS is currently available as well. Although, it may be removed if it finds no use. Its documentation can be found here: http://underscorejs.org/

The graphics library used is called PixiJS. We use version 3.
The docs for this version are located here: http://pixijs.github.io/docs/PIXI.html
The source can be found here: https://github.com/GoodBoyDigital/pixi.js/
