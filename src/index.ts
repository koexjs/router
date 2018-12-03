import { Context } from 'koa';
import * as pathToRegexp from 'path-to-regexp';

import { match, decode } from './utils';

const debug = require('debug')('koa-router');

declare module 'koa' {
  export interface Context {
    params?: Params;
    routePath?: string;
  }
}

export interface Params {
  [key: string]: string;
};

export type Handler = (ctx: Context, next: () => Promise<void>) => Promise<void>;

const createMethod = (method: string) => {
  if (method) method = method.toUpperCase();

  return (path: string, handler: Handler) => {
    const keys: pathToRegexp.Key[] = [];
    const re = pathToRegexp(path, keys);
    debug('%s %s -> %s', method || 'ALL', path, re);

    return async function (ctx: Context, next: () => Promise<void>) {
      // method
      if (!match(ctx, method)) return next();

      // path
      const matched = re.exec(ctx.path);
      if (matched) {
        const args = matched.slice(1).map(decode);
        ctx.routePath = path;
        ctx.params = keys.reduce((last, item, index) => (last[item.name] = args[index], last), {});

        debug('%s %s matches %s', ctx.method, path, ctx.path, JSON.stringify(ctx.params));

        return await handler(ctx, next);
      }

      // miss
      await next();
    };
  };
};

export const get = createMethod('get');
export const post = createMethod('post');
export const put = createMethod('put');
export const patch = createMethod('patch');
export const del = createMethod('delete');
export const head = createMethod('head');
export const options = createMethod('options');
