import ejsPlugin from '../lib/ejs.js';
import mojo from '@mojojs/core';
import Path from '@mojojs/path';
import t from 'tap';

t.test('ejsPlugin', async t => {
  const app = mojo({mode: 'testing'});
  app.plugin(ejsPlugin);
  app.plugin(ejsPlugin, {name: 'foo'});

  app.renderer.viewPaths.push(Path.currentFile().sibling('support', 'views').toString());

  app.get('/', async ctx => {
    await ctx.render({view: 'test'}, {name: 'World'});
  });

  app.get('/layout', async ctx => {
    await ctx.render({view: 'test', layout: 'foo'}, {name: 'World'});
  });

  app.get('/layout2', async ctx => {
    await ctx.render({view: 'bar'});
  });

  app.get('/inline', async ctx => {
    await ctx.render({inline: '<%- greeting %> World!', engine: 'ejs'}, {greeting: 'Hello'});
  });

  app.get('/inline/foo', async ctx => {
    await ctx.render({inline: '<%- greeting %> World!', engine: 'foo'}, {greeting: 'Hello'});
  });

  app.get('/inline/mt', async ctx => {
    await ctx.render({inline: '<%== greeting %> World!'}, {greeting: 'Hello'});
  });

  app.get('/async', async ctx => {
    await ctx.render({view: 'async'}, {test: async () => 'Async works too'});
  });

  const ua = await app.newTestUserAgent({tap: t});

  await t.test('Plain template', async () => {
    (await ua.getOk('/')).statusIs(200).bodyLike(/Hello World/);
  });

  await t.test('With layout', async () => {
    (await ua.getOk('/layout')).statusIs(200).bodyLike(/Header.+Hello World.+Footer/s);
    (await ua.getOk('/layout2')).statusIs(200).bodyLike(/Header.+Bar.+Footer/s);
  });

  await t.test('Inline template', async () => {
    (await ua.getOk('/inline')).statusIs(200).bodyLike(/Hello World/);
    (await ua.getOk('/inline/foo')).statusIs(200).bodyLike(/Hello World/);
    (await ua.getOk('/inline/mt')).statusIs(200).bodyLike(/Hello World/);
  });

  await t.test('Async', async () => {
    (await ua.getOk('/async')).statusIs(200).bodyLike(/Async works too/);
  });

  await ua.stop();
});
