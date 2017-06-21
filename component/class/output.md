# @Output

组件或指令需要发出变化通知，这是理所当然的。

## 长什么样？

通过 `@Output()` 装饰器，告知这个属性允许发出变化通知。

```typescript
@Component({
  selector: 'user-detail',
  template: `
  user id: {{userId}}
  <button (click)="onDelete()">delete</button>`
})
export class UserDetailComponent {
  @Input() userId: number;
  @Output() delete = new EventEmitter<number>();

  onDelete() {
    this.delete.emit(this.user.id);
  }
}
```

于是，需要用到 `user-detail` 组件，都可以向它传递一个 `userId` 值。

```typescript
@Component({
  selector: 'user-list',
  template: `<user-detail userId="1" (delete)="onDelete($event)">`
})
export class UserListComponent {
  @Output() delete = new EventEmitter<number>();

  onDelete(uid: number) {
      console.log(uid);
  }
}

```

## 属性太难看了

是的，和我一样有洁癖的，是不会允许 `[userId]` 的写法和 `user-detail` 这种写法不搭。

我认知的写法应该是这样：

```html
<user-detail [user-id]="uid">
```

这样看起来才爽。但，等等，`user-detail` 也应该换一下。

```typescript
@Input('user-id') userId: number;
```