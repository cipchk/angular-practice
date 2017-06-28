# 共享模块

## 一、为什么需要？

假定有个用户服务用来获取用户信息，这类服务不光只有在登录时才会用到，可能我们在用户管理模块、甚至交易模块中都可能需要用到它。

当然这类服务或者一些通用性组件、指令会很多，但我们不可能在每一个模块中都去独立导入。一方面但有变动时会牵连很多，另一方面会有很多重复代码。

因此，将这类组件、指令、服务等放在一个独立的模块中再适合不过了，一般我们取名为 `SharedModule`。

## 二、创建

一般我们会在 `src/app/shared/shared.module.ts` 文件，其内容跟我们前一章介绍一样去创建它：

```typescript
@NgModule({
    imports: [ CommonModule ],
    providers: [ UserService ],
    declarations: [  ], // etc: component, pipe
    export: [
        CommonModule,
        UserService
    ]
})
export class SharedModule {}
```

重点是 `export`，因为这是一个共享模块，它会被不同需要它的模块被导入，因此在共享模块里也就需要做导出。

假如 `src/app/user/user.module.ts` 需要使用到 `UserService` 我们只需要将 `SharedModule` 导入即可。

```typescript
@NgModule({
    imports: [ SharedModule ]
})
```

### 共享依赖注入

再回过头来看 `UserService` 服务，我们知道DI对于服务而言是单例。而对于共享模块会在不同模块中被导入，那么为了避免在不同模块中引起多次被实例。

需要在模块内定义一个静态方法 `forRoot()`，并将 `providers` 的内容单独处理，这样就表示服务会直接注入到根模块当中，这样对于后续的其他多次导入时，直接从根模块中查找。

```typescript
@NgModule({
})
export class SharedModule {
     static forRoot(): ModuleWithProviders { 
        return {
            ngModule: SharedModule,
            providers: [ UserService ]
        }
     }
}
```