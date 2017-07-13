# Services 服务


## 为什么需要服务

同一个功能组件会有增、删、改，并且在不同组件中完成，而这些组件大多数会有对应的RESTful API接口，也可能这些接口返回的数据需要一定的转换。

在这样的问题之下，如果每一个组件内部自己去处理，会有大量的重复的 `Http` 之类的代码，在Angular中服务就是集中处理这类信息。服务本身是以**单例**形式存在的，所以组件间很容易可以通信，从而还能减少网络请求次数。

组件本身要获取**最有效**的数据，也只需要将对应的服务注入到组件树中即可。

同时对于组件可以通过Mock这些服务让组件**可测试性**变得异常简单。

## 如何创建服务

一个普通的类，加上 `@Injectable()` 装饰器即可：

```typescript
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

    get(id: number): Observable<User> {}

    add(user: User): boolean {}

    remove(user: User): boolean {}
}
```

你可以在任意组件树位置中注入它。

```typescript
@Coomponent({
    providers: [ UserService ]
})
```

由于它是**单例**形式，所以不管在哪个地方注入它都会可能会被另一个地方覆盖。因此，如果你的服务需要在整个应用中有效，可以直接在根模块中注入它。

```typescript
@NgModule({
    providers: [ UserService ]
})
```

最后，在你需要用到它的组件里，直接在构造函数中表明即可。

```typescript
export class AppComponent {
    constructor(private srv: UserService) { }
}
```

## 异步尽可能返回 `Observable` 类型

一直我都很强调 `Observable` 的运用，因为在 Angular 当中 `Observable` 就是一部分，它的强大让我们的代码看起来更优雅。

比如，上面获取用户详细 `get` 方法，在使用时，如果配合 `async` 管道，不知道有多爽。

比如：当网络请求返回后这段时间显示 【loading...】 字样，只需要这样字。

```typescript
@Coomponent({
    template: `
    <p *ngIf="user$ | async as user; else loading">
        name: {{user.name}}
    </p>
    <ng-template #loading>loading...</ng-template>
    `
})
export class AppComponent {

    constructor(private srv: UserService) { }

    user: Observable<User>;
    ngOnInit() {
        this.user = this.srv.get(1);
    }
}
```