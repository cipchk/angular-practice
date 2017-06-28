# Angular模块

我们一直在说Angular应用是由组件树组成，但是随着项目越来越大，组件也会成百上千，如何更好管理这些组件，那就是 Angular 模块的职责。

将某个业务相关的组件放在一起，允许限定某些组件给别的业务用，让整体业务显得更加**内聚**。

Angular只有一个 `@NgModule()` 装饰器来描述，所以你非常容易学习它。

## 一、什么是 `@NgModule()`

```typescript
interface NgModule {
    imports: [],
    declarations: [],
    providers: [],
    exports: [],
    entryComponents: [],
    bootstrap: [],
    schemas: [],
    id: string;
}
```

**imports**

导入别人的组件，比如Angular提供的 `Http` 网络请求相关的，那么就需要导入：`HttpModule`，或者可能是当前应用的某个模块。

**declarations**

所有组件都必须先定义后使用，这是因为依赖注入的关系。

**providers**

与 `declarations` 很像，但它是定义带有 `@Injectable()` 装假器的服务类，并且它是**单例模式**（即始终只会被实例一次）。

**exports**

如果觉得当前模块的某个组件或服务要给另一个模块用的，那就导出它。

**entryComponents**

当某个组件未在某处模板中调用到时，AOT 会抛弃它。但，有时候某些组件是由动态创建的，比如模态框。所以，为了告诉 AOT 说，这个组件也会用到。

**bootstrap**

设定根组件。

**schemas**

声明非Angular的组件或者指令的元素或属性时如何处理，有两种情况：

+ `NO_ERRORS_SCHEMA` 允许任意元素或属性（例如：`<a-asdf></a-asdf>` 有效、`<aasdf></aasdf>` 有效），这个设置给组件写单元测试时还蛮有用的。
+ `CUSTOM_ELEMENTS_SCHEMA` 允许任何带有 **-** （例如：`<a-asdf></a-asdf>` 有效、`<aasdf></aasdf>` 无效） 的元素或属性。

**id**

用来区分模块唯一值，如果指定 `undefined` 时模块将不会被注册。默认无须指定，Angular Cli会统一帮我们处理。

## 二、启动根模块

从树的概念来讲，需要指定一个根模块。所有的一切都由这个根模块逐一向下伸展。

你可以 `src/main.ts` 看到这一句启用根模块的代码：

```typescript
platformBrowserDynamic().bootstrapModule(AppModule);
```