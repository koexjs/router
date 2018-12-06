import * as Koa from 'koa';
import * as request from 'supertest';
import 'should';

import { get, post, put, patch, del, head, options } from '../src';

describe('koa router', () => {
  describe('the same path with different methods', () => {
    const app = new Koa();

    app.use(get('/', async ctx => {
      ctx.body = 'get';
    }));

    app.use(post('/', async ctx => {
      ctx.body = 'post';
    }));

    app.use(put('/', async ctx => {
      ctx.body = 'put';
    }));

    app.use(patch('/', async ctx => {
      ctx.body = 'patch';
    }));

    app.use(del('/', async ctx => {
      ctx.body = 'delete';
    }));

    app.use(head('/', async ctx => {
      ctx.status = 200;
    }));

    app.use(options('/', async ctx => {
      ctx.status = 200;
    }));

    app.use(ctx => {
      ctx.body = 'hello, world';
    });

    it('should get /', async () => {
      await request(app.listen())
        .get('/')
        .expect(200, 'get');
    });

    it('should post /', async () => {
      await request(app.listen())
        .post('/')
        .expect(200, 'post');
    });

    it('should put /', async () => {
      await request(app.listen())
        .put('/')
        .expect(200, 'put');
    });

    it('should patch /', async () => {
      await request(app.listen())
        .patch('/')
        .expect(200, 'patch');
    });

    it('should delete /', async () => {
      await request(app.listen())
        .delete('/')
        .expect(200, 'delete');
    });

    it('should head /', async () => {
      await request(app.listen())
        .head('/')
        .expect(200);
    });

    it('should options /', async () => {
      await request(app.listen())
        .options('/')
        .expect(200);
    });

    it('should fallback to the last middleware', async () => {
      await request(app.listen())
        .get('/xxxx')
        .expect(200, 'hello, world');
    });
  });

  describe('should parse params', () => {
    const app = new Koa();

    app.use(get('/:id', async ctx => {
      ctx.body = ctx.params;
    }));

    app.use(get('/:product/:comment', async ctx => {
      ctx.body = ctx.params;
    }));

    app.use(get('/:product/:comment/:user', async ctx => {
      ctx.body = ctx.params;
    }));

    app.use(ctx => {
      ctx.body = 'hello, world';
    });

    it('should parse one param', async () => {
      await request(app.listen())
        .get('/xxxx')
        .expect(200, { id: 'xxxx' });
    });

    it('should parse two params', async () => {
      await request(app.listen())
        .get('/a/b')
        .expect(200, { product: 'a', comment: 'b' });
    });

    it('should parse more params', async () => {
      await request(app.listen())
        .get('/a/b/c')
        .expect(200, { product: 'a', comment: 'b', user: 'c' });
    });

    it('should fallback to the last middleware', async () => {
      await request(app.listen())
        .get('/a/b/c/d')
        .expect(200, 'hello, world');
    });
  });

  describe('should support multiple middlewares', () => {
    const app = new Koa();
    const preMiddleware: Koa.Middleware = async function (ctx, next) {
      ctx.state.pre = 'pre';
      return next();
    };

    const middleware: Koa.Middleware = async function (ctx, next) {
      ctx.state.mid = 'mid'
      await next();
      ctx.set('X-Post-Action1', 'mid');
      ctx.state.mid1 = 'mid1';
    };

    const postMiddleware: Koa.Middleware = async function(ctx, next) {
      await next();
      ctx.set('X-Post-Action2', 'post');
      ctx.state.post = 'post';
    }

    app.use(get('/:id', preMiddleware, middleware, postMiddleware, async ctx => {
      ctx.state.should.have.property('pre');
      ctx.state.should.have.property('mid');
      ctx.state.should.not.have.property('mid1');
      ctx.state.should.not.have.property('post');

      ctx.body = ctx.params;
    }));

    it('should parse one param', async () => {
      await request(app.listen())
        .get('/xxxx')
        .expect('X-Post-Action1', 'mid')
        .expect('X-Post-Action2', 'post')
        .expect(200, { id: 'xxxx' });
    });
  });
});
