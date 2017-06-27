# 动画

Angular动画实现了一套能跟纯CSS动画性能相媲美的类库，而对于浏览器而言是基于原生 [Web Animations API](https://w3c.github.io/web-animations/) 接口实现的，所以如果有浏览器上兼容问题，还需要引入 [web-animations.min.js](https://github.com/web-animations/web-animations-js)。

总之，很牛B。

## 引入模块

动画模块只允许导入一次，所以最好在根模块 `app.module.ts` 中导入它。

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
    imports: [ BrowserModule, BrowserAnimationsModule ]
});
```

然后可以组件导入相关动画常用类：

```typescript
import { trigger, style, transition, animate, group } from '@angular/animations';
```

## 创建动画

