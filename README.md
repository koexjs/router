# koa-router

[![NPM version](https://img.shields.io/npm/v/@zcorky/koa-router.svg?style=flat)](https://www.npmjs.com/package/@zcorky/koa-router)
[![Coverage Status](https://img.shields.io/coveralls/zcorky/koa-router.svg?style=flat)](https://coveralls.io/r/zcorky/koa-router)
[![Dependencies](https://david-dm.org/@zcorky/koa-router/status.svg)](https://david-dm.org/@zcorky/koa-router)
[![Build Status](https://travis-ci.com/zcorky/koa-router.svg?branch=master)](https://travis-ci.com/zcorky/koa-router)
![license](https://img.shields.io/github/license/zcorky/koa-router.svg)
[![issues](https://img.shields.io/github/issues/zcorky/koa-router.svg)](https://github.com/zcorky/koa-router/issues)

> Simple Router for Koa

### Install

```
$ npm install @zcorky/koa-router
```

### Usage

```javascript
// See more in test
import * as router from '@zcorky/koa-router';

import * as Koa from 'koa';
const app = new Koa();

app.use(router.get('/', async (ctx) => {
  ctx.body = 'home';
}));

app.use(router.get('/health', async (ctx) => {
  ctx.status = 200;
  ctx.body = 'ok';
}));

app.use(router.get('/product/:pid', async (ctx) => {
  ctx.body = ctx.params.pid;
}));

app.use(router.get('/product/:pid/:cid', async (ctx) => {
  ctx.body = ctx.params.pid + ': ' + ctx.params.cid;
}));

// fallback
app.use(async (ctx) => {
  ctx.body = {
    name: 'name',
    value: 'value',
  };
});

app.listen(8000, '0.0.0.0', () => {
  console.log('koa server start at port: 8000');
});
```

### Related
* [koa-router](https://github.com/alexmingoia/koa-router)
* [koa-route](https://github.com/koajs/route)