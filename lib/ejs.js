import {createHash} from 'crypto';
import Path from '@mojojs/path';
import {compile} from 'ejs';
import LRU from 'lru-cache';

export default function ejsPlugin(app) {
  app.renderer.addEngine('ejs', new EJSEngine());
}

class EJSEngine {
  constructor() {
    this.cache = new LRU({max: 100});
  }

  async render(ctx, options) {
    let template;

    if (options.inline !== undefined) {
      const checksum = createHash('md5').update(options.inline).digest('hex');
      template = this.cache.get(checksum);

      if (template === undefined) {
        template = compile(options.inline, {async: true});
        this.cache.set(checksum, template);
      }
    } else {
      template = this.cache.get(options.viewPath);

      if (template === undefined) {
        if (options.viewPath === undefined) throw new Error('viewPath is not defined for ejsEngine');
        const source = await new Path(options.viewPath).readFile('utf8');
        template = compile(source.toString(), {async: true, filename: options.viewPath});
        this.cache.set(options.viewPath, template);
      }
    }

    return Buffer.from(await template({...ctx.stash, stash: ctx.stash, ctx, view: options}));
  }
}
