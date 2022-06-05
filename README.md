<p align="center">
  <a href="https://mojojs.org">
    <picture>
      <source srcset="https://github.com/mojolicious/mojo.js/blob/main/docs/images/logo-dark.png?raw=true" media="(prefers-color-scheme: dark)">
      <img src="https://github.com/mojolicious/mojo.js/blob/main/docs/images/logo.png?raw=true" style="margin: 0 auto;">
    </picture>
  </a>
</p>

[![](https://github.com/mojolicious/mojo-plugin-ejs/workflows/test/badge.svg)](https://github.com/mojolicious/mojo-plugin-ejs/actions)
[![npm](https://img.shields.io/npm/v/mojo-plugin-ejs.svg)](https://www.npmjs.com/package/mojo-plugin-ejs)

A mojo.js plugin that adds support for [ejs](https://www.npmjs.com/package/ejs) templates. The code of this plugin is a
good example for learning to build new plugins, you're welcome to fork it.

```js
import mojo from '@mojojs/core';
import ejsPlugin from 'mojo-plugin-ejs';

const app = mojo();
app.plugin(ejsPlugin);

// Render template "views/index.html.ejs"
app.get('/template', async ctx => {
  await ctx.render({view: 'index'});
});

// Render an inline ejs template
app.get('/inline', async ctx => {
  await ctx.render({inline: '<%- greeting %> World!', engine: 'ejs'}, {greeting: 'Hello'});
});

app.start();
```

To change the default engine for inline templates you can also set `app.renderer.defaultEngine` to `ejs`. Or you can
register the template engine with a completely different name.

```js
app.plugin(ejsPlugin, {name: 'foo'});
app.renderer.defaultEngine = 'foo';
```

## Installation

All you need is Node.js 16.0.0 (or newer).

```
$ npm install mojo-plugin-ejs
```
