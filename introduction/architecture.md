
```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

# 架构概况

Angular是一个框架！它包含很多东西，诸如：数据绑定、路由、动画、表单等，所有这些东西很多不是必选的，你可以**按需索取**。

一个Angular应用是由一个复杂的组件树组成，组件管理HTML模板渲染、HTML事件与组件类互动，而Service服务处理业务逻辑，最后组件与服务都由DI（依赖注入）负责管理，最后由模块来引导应用启动。

以下是一个概况图。

![overview](../_images/overview.png)


```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

这张图包含下列概念：


```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

* Moduel
* Component
* Template
* Data binding
* Metadata
* Directive
* Service
* Dependency injection


```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

以下会对每一个概念进行简单的介绍。

```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

## Module

一个应用会有成百上千组件，这么多组件，不可能是一下子全部用得到的呀，那要怎么维护呢。


```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

比如一个登录功能，可能只需要登录组件、注册组件、忘记密码组件、登录API接口服务、登录状态存储而已呀，我们把这些组件汇聚在一起，然后叫它为模块（Module）。


```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

Angular框架使用 `NgModule` 来表述，大概长这样：

```typescript
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports:      [ BrowserModule ],
  providers:    [ UserService ],
  declarations: [ Login, Register, Froget ],
  exports:      [ UserService ]
})
export class UserModule { }
```


```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

这里有几个属性：

+ `imports` 导入别人的组件，比如可能需要一个发送短信获取验证码的功能。
+ `declarations` 注册登录、注册、忘记密码组件
+ `providers` 注册API接口服务
+ `exports` 如果觉得某个组件或服务要给另一个模块用的，那就导出它

你是不是和我一样觉得，模块可以让一个业务的功能块更**内聚**；没错，这就是模块的作用。

## Component

组件，我觉得应该叫**视图组件**更合理一点，因为一个组件必须对应一个模板，使用 `@Component` 装饰器。

```twig
{{ foo.bar }}
{{ foo["bar"] }}
```

```typescript

{{ foo.bar }}
{{ foo["bar"] }}

@Component({
    template: `
    <p>当前用户：{{ name }}</p>
    <button (click)="login()">登录</button>
    `
})
export class UserLoginComponent {
    name: string = 'cipchk';

    login() {
        // 登录动作
    }
}
```

示例中模板（template）需要组件类（UserLoginComponent）提供数据（name），而登录动作（login）需要模板（button.click）的触发。彼此之间就是相互作用的。

组件的创建、销毁都是由Angular来管理，当然了，Angular提供一系列生命周期钩子让我们在某个阶段有机会做点处理。

## Template

模板就是视图，几乎所有HTML语法都是有效的模板语法，这一点归于Angular模板引擎。

> 注：Angular与AngularJS的模板引擎有很大的区别，我相信有一些人却步AngularJS就是因为需要你了解一大堆 `ng-` 开头的指令。然，Angular做了极大的改进，你再也看不到 `ng-style` 之类的，换之尽可能保留HTML5标签。比如：`[style]` 直接表示样式属性。

## Data binding

数据绑定，Angular提供了非常丰富的模板语法，诸如：`*ngFor`、`{{ name }}`、`(click)`、`[(ngModel)]` 等。

## Metadata

Angular冲刺大量元数据，不管是组件、指令、模块等等都离不开它。

元数据的目的是**为目标添加特定约束**——目标可能是组件、指令、模块等。

比如限定组件只能使用 `<login></login>` 调用。

```typescript
@Component({
    selector: 'login'
})
```

## Directive

指令就是一个**无模板**组件，使用 `@Directive` 装饰器。

Angular提供丰富的内置指令，但分成结构型和属性型两类。

**结构型**

会改变 DOM 结构的指令，例如：`*ngFor`、`*ngIf`、`*ngSwitch`。

**属性型**

会改变 DOM 元素的外观或行为，例如：`[ngClass]`、`[ngStyle]` 及 HTML5 标签属性（`[src]`、`[href]`、`(click)`）。

## Service

服务类就是一个简单的 Class 类；主要作用是用于业务逻辑、HTTP通信、数据存储等，从而可以隔离组件的业务逻辑。

那为什么要这么做，因为好像很麻烦呀。

1. 从测试角度出发呢？测试一个 Class 比测试一个组件简单得多了，那为何不这么做？
2. 组件会在需要的时候才被实例，销毁后数据会丢失。
3. 服务是单例对象，仅会实例一次，在整个应用有效。

## Dependency injection

依赖注入，这是整个Angular框架的核心，同软件工程的DI一样，DI最大的目的是**减少依赖关系**、**易测试**。

```typescript
class UserService {
    constructor(private service: ApiService) {}
}
```

如果某个组件需要 `UserService` 的话，并不需要再构建一个 `ApiService`。

```typescript
class LoginComponent {
    constructor(private userService: UserService) {}
}
```

而对于测试，可以直接模拟一个 `ApiService`，这样的测试代码更有效，也不会因为其依赖导致我们测试代码更为复杂。