# 组件类

组件类控制模板的渲染，换句话说**Angular的渲染是靠数据**，理解这一点非常重要。

## 长什么样？

通过 `@Component` 装饰器，可以快速告诉Angular这个组件是什么样的。

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { }
```

这里传递了三个信息：

+ `selector` 给组件设个门牌号，当这个组件被使用时，用它来告诉组件所处的位置。
+ `templateUrl` 告诉组件布局是什么样子的。
+ `styleUrls` 告诉组件应该粉刷成什么样子的。

### selector

一个带有语义的名称对于定位非常重要，因为组件最终在DOM树中会以 `<app-root></app-root>` 这样的标签存在。

有很多文章或人会告诉你这个名词就像 CSS Selector（CSS选择器）一样，所以也可以设置为 `[app-root]` 而调用是 `<div app-root></div>`，二者虽说都没问题，但我不建议这么理解，因为组件就是组件，它是**有意义的一个完整性功能完整的DOM**。

### templateUrl

指定组件模板，同她后缀意思一样传递的是一个 URL 地址 `./app.component.html`。当 Webpack 打包以后，会将上面的内容打包进js文件中。

> `./` 表示当前所在目录。

当然她也提供另一种写法，可以直接将模板内容写在装饰器里面。

```typescript
template: `<h1></h1>`
```

### styleUrls

同组件模板类似，只不过她是以**数组**形式出现。（别问我为什么是数组）

这里的URL接收不光可以是一个 `css` 文件，她允许接收时下所有浏览CSS预处理（例：scss、less等），当然这并不是Angular的功能，而是Webpack的特性。

更多细节见[样式](styles.md)章节。

## 组件类

组件类作用是**控制模板渲染，而控制的手段就是数据**。这一点非常重要，假设想要模板输出 “Hi,cipchk，约吗？”。

```typescript
@Component({
  selector: 'app-root',
  template: `<p>{{hi}}</p>`
})
export class AppComponent {
    hi: string = `Hi,cipchk，约吗？`;

    constructor() {
        setTimeout(() => {
            this.hi = `^_^`;
        }, 1e3)
    }
}
```

模板里用一对 `{{ }}` 双大括号包裹着组件类 `hi` 属性，你可以随时改变 `hi` 属性的值（这里设置了一个定时器3秒后改变值），Angular会实时同步更新模板的渲染。

> `constructor` 组件类构造函数，且由DI来完成实例。

组件与组件类的交互是通过模板相应的DOM事件来完成的，增加一组按钮，来告诉组件类到底约不约。

```typescript
@Component({
  selector: 'app-root',
  template: `
  <p>{{hi}}</p>
  <button (click)="telAs(true)">约</button>
  <button (click)="telAs(false)">不约</button>
  `
})
export class AppComponent {
    hi: string = `Hi,cipchk，约吗？`;
    
    telAs(result: boolean) {
      this.hi = result ? '你家、我家，还是如家？' : '88';
    }
}
```

模板使用 `(click)="telAs(true)"` 来访问组件类的方法，左边为DOM标准事件名 `click`，右边对应的是组件类 `telAs` 方法名及所须参数。

## 小结

除了ts 语法外，你是否发现上面的代码中并没有出现任何陌生的名词，模板中 `(click)` 点击事件名再熟悉不过了，而组件类也只是一个再简单不过的 ts 类而已。

这就是新的Angular模板引擎带来的变化，尽可能的依赖标准、减少学习成本。

如果你很细心不知是否发现，模板中会用 `{{ }}`、`()` 来表示一些特定的行为能力，这其实是Angular的一种数据流向的约定，这一点在[模板语法](template.md)会详细介绍。