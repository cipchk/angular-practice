# @Output

组件或指令需要发出变化通知，这是理所当然的。

## 长什么样？

通过 `@Output()` 装饰器，告知这个属性允许发出变化通知。

{% raw %}
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
{% endraw %}

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

**$event**

`$event`