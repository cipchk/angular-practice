# 生命周期

Angular从程序引导启动、再到创建与销毁组件动作都有一系列钩子事件，它允许我们在某个阶段有机会做点处理。

## 一、引导模块启动

Angular应用由多个模块树，每个模块又由组件树组成，归到底还是以组件树组成的应用。

因此，你会在 `main.ts` 看到这样的引导模块启动的语句：

```typescript
platformBrowserDynamic().bootstrapModule(AppModule);
```

所以，如果你希望在Angular应用启动之前需要一些系统级数据的话，可以在引导启动之前先请求数据。

## 二、组件生命周期

Angular每个组件都有相应的钩子允许我们在某个时刻让我们有技术处理点事。

总览如下：

| 名称 | 说明 | 范围 |
|:----|:----|:----:|
| `constructor` | 构造函数 | 指令和组件 |
| `ngOnChanges()` | 属性变更通知 | 指令和组件 |
| `ngOnInit()` | 组件初始化 | 指令和组件 |
| `ngDoCheck()` | 每一次变更检测时 | 指令和组件 |
| `ngAfterContentInit()` | 子组件初始化后 | 组件 |
| `ngAfterContentChecked()` | 子组件变更检测之后 | 组件 |
| `ngAfterViewInit()` | 组件初始化后 | 组件 |
| `ngAfterViewChecked()` | 组件每次变更检测之后 | 组件 |
| `ngOnDestroy()` | 初始销毁之前 | 指令和组件 |

### 1、构造函数

组件初始化时首先调用的组件的构造函数 `constructor`，但是它不是Angular生命周期钩子中的一个。

这是因为组件是一个类，是类就有构造函数。因此，对于构造函数**只做**一些定义或初始化变量。

所以，DI也是利用构造函数进行注入依赖类，比如注入一个 `Http` 类，允许类可以访问网络请求。

```typescript
constructor(private http: Http) { }
```

### 2、`ngOnChanges()` 属性变更通知

当**所有绑定属性**的值发生变化结束后触发，会捕获所有变更属性的新值、旧值以及是否为首次变更字段。比如当变更 `user` 属性时会返以下结构数据：

```typescript
{
    "user": {
        "currentValue": { "name": "cipchk" }, // 新值
        "previousValue": undefined, // 旧值
        "firstChange": true // 是否首次变更
    }
}
```

**@Input() & ngOnChanges()**

在 [@Input()](class/input.md) 我们介绍 ts 语言支持利用getters/setters来控制对成员的访问，因此，从优先级角度来说相比较 `ngOnChanges()` 是低于 `@Input()` 的，这一点大家也要注意了。

### 3、`ngOnInit()` 组件初始化

组件或指令初始化完成后数据变更检测前触发。

因此，这个时候组件的模板 `template` 值已经写入DOM树当中，这个时候在这里做数据请求与处理再适合不过了。

### 4、`ngDoCheck()` 变更检测

每次变更检测（**不管是否有数据**）周期时触发，这是一个**高频率**触发，所以**不要**在这时在做一些复杂的操作。

### 5、`ngAfterContentInit()` & `ngAfterViewInit()`

我重要描述一下这个两个可能比较难于理解的地方，但是，要说这两个钩子前，得先了解一下：`@ViewChild()` 与 `@ContentChild()`。

**@ViewChild()**

用来获取当前**组件模板**中出现的组件对象，这个比较好理解，即：

```typescript
@Component({
    selector: 'user-list',
    template: `<user-detail></user-detail>`
})
export class UserListComponent {
    @ViewChild(UserDetailComponent) userDetailComp: UserDetailComponent;
    ngAfterViewInit() { 
        // this.userDetailComp
    }
}
```

用来获取用户明细 `user-detail` 组件。

**@ContentChild()**

用来获取当前组件模板 `<ng-content></ng-content>` 里头出现的组件对象。

```typescript
// 用户列表
@Component({
    selector: 'user-list',
    template: `
        <user-detail>
            <h2>订单列表</h2><user-trade></user-trade>
        </user-detail>
    `
})
export class UserListComponent {}

// 用户明细组件
@Component({
    selector: 'user-detail',
    template: `
        用户明细
        <ng-content></ng-content>
    `
})
export class UserDetailComponent {
    @ContentChild(UserTradeComponent) tradeComp: UserTradeComponent;
    ngAfterViewInit() { 
        // this.tradeComp
    }
}
```

首先，`user-deatil` 内部必须包含 `<ng-content></ng-content>` 才能显示 `<h2>订单列表</h2><user-trade></user-trade>` 内容

其次，通过 `@ContentChild()` 来获取这一部分里头的内容的组件。

**执行顺序**

有了这一认识，以及这四个钩子都带有 `After` 字样来表示是在之后才触发。

故而，对于 `AfterContent` 系列钩子优先于 `AfterView` 系列钩子也就顺理成章。因为在组件遇到 `ng-content` 时需要先处理完后才会继续后续的部分。

**Init & Checked**

`Init` 只会初始化一样，这是理所当然的，当组件在DOM树中出现肯定也需要实例一次嘛。

`Checked` 每次变更检测（**不管是否有数据**）周期时触发。

### 6、`ngAfterContentChecked()` & `ngAfterViewChecked()`

每次变更检测（**不管是否有数据**）周期时触发，优先级略低于 `ngDoCheck()`。

### 7、`ngOnDestroy()` 销毁

组件或指令初始销毁之前触发。

## 三、`ngOnInit()` & `ngAfterContentInit()`

如前所述，这两个钩子都只会执行一次，但是二者是有一定的区别的。

对于 `ngOnInit()` 是指组件初始化完成，但未涉及任何变更检测前。反观后者是在第一次变更检测并渲染完成后触发。

这也就是为什么，前面 `@ViewChild()` 与 `@ContentChild()` 都会在 `ngAfterContentInit()`，因为只有这个阶段的子组件才算真正的完成初始化。