# 模块实践指南

## 一、如何组织模块？

没有一个标准，但建议：

1. 业务模块。
2. 共享模块。

### 业务模块

每一个业务内部其实都是一个整体，这些整体包括：组件、指令、服务、Pipe等等。例如：`UserModule`、`TradeModule`等等。

### 共享模块

见[共享模块](shared.md)章节。

## 二、延迟加载模块

试想，不管多么复杂的应用，这些组件、服务等都不是立刻都需要用到。像浏览器的Angular对组件树的构建是取决于URL的变化，而URL始终都只会有一种状态。

假如用户登录系统后首先见到的【仪表盘】，而对于诸如：用户列表、订单列表，其实是需要用户去触发才会发生URL变动。

因此，如果你按照一种业务模块进行区分的话，然后再将这些模块以延迟加载，那对于**减少应用启动时间**太有帮助了。

那我们是如何延迟加载的呢？自然需要与路由相关，前面说了，模块什么时候加载取决于URL的变化。

```typescript
@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'user', loadChildren: './user/user.module#UserModule' },
        ])
    ]
})
export class AppModule {}
```

在 `loadChildren` 属性值，是由一个模块的文件路径和模块名称并用 **#** 号区隔的组合。

有关路由细节会在相关章节中描述。