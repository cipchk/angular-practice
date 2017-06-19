```typescript
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

+ Moduel
+ Component
+ Template
+ Data binding
+ Metadata
+ Directive
+ Service
+ Dependency injection

```typescript
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
