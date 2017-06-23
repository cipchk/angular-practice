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

于是，需要用到 `user-detail` 组件，都可以向它传递一个 `delete` 事件绑定。

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

同 `@Input()` 一样，支持重新指定一个新的属性名。

```typescript
@Output('delete') delete = new EventEmitter<number>();
```

## 什么是`EventEmitter<T>`?

触发**组件或指令**中的自定义事件。意思就是说，它只是用来触发外部定义的函数而已，没有别的意思。

*注：它完全不同于Node的EventEmitter。*

`EventEmitter<T>` 的本质是一个 `Subject`，这是RxJs方面的知识，会在[RxJS](../../rxjs/README.md)章节继续说明。

### 参数

细心你会发现，我一直写的 `EventEmitter<T>`，它是一个泛型类型对象。

看下面一个（~~错误~~）示例：

```typescript
@Output() delete = new EventEmitter<number, string>();
```

当你希望事件允许有多个参数时，以上的定义是错误的，因为**只允许一个参数**，这个细节点一定要记住！因此，如果你希望向外传递多个参数时，只需要将它们组合成一个对象即可。

```typescript
@Output() delete = new EventEmitter<any>();

delete.emit({ id: 1, name: 'cipchk' });
```

### 如何处理dom事件

有时候当我们需要点击事件后并阻止默认行为时（即调用 `event.preventDefault()`），就需要在模板中设置 `$event` 参数。

```html
<user-detail userId="1" (delete)="onDelete($event)">
```

实际上 `$event` 就是指DOM Event 对象。因此，可以组件类这么处理：

```typescript
onDelete(event: Event) {
  event.preventDefault();
}
```

### 处理Event对象与参数并存

前面我说过 `EventEmitter<T>` 只接收一个参数，这意味者，没有必须接收两个参数，即 Event 对象和业务参数，那怎么办呢？

其实我们可以换个角度来想，对于 `user-detail` 组件的 `delete` 自定义事件而言，其触发在其组件内，而非调用方（即：`UserListComponent`）。所以类似这种情况，应该在其组件内进行处理。

```typescript
@Component({
  selector: 'user-detail',
  template: `
  user id: {{userId}}
  <button (click)="onDelete($event)">delete</button>`
})
export class UserDetailComponent {
  @Input() userId: number;
  @Output() delete = new EventEmitter<number>();

  onDelete(event: Event) {
    event.preventDefault();
    this.delete.emit(this.user.id);
  }
}
```

### 不要在Service中使用 `EventEmitter<T>`

前面我说过【触发**组件或指令**中的自定义事件】，虽然其本质是继承RxJs的 `Subject`，但Angular会对其更进一步抽象。

如果你需要在Service中那么请用RxJs相关方法，例如：`Subject`。