---
slug: redux
tags: [react]
---

:::tip
- [Redux Toolkit文档](https://redux-toolkit.js.org/)
- Redux Toolkit 和 Redux 的关系：Redux Toolkit 包含 Redux核心，并引入了一系列工具（比如[RTK Query](https://redux-toolkit.js.org/introduction/getting-started#rtk-query)），简化了Redux的使用。
- Redux 和 React-Redux 的关系：React Redux 是 官方的 对于 Redux 的 React UI 绑定层。
- React-Redux v8 is written in TypeScript, so all types are automatically included.
- Redux Toolkit is already written in TypeScript, so its TS type definitions are built in.
:::

## [Redux](https://redux.js.org/introduction/getting-started)

## [Redux Toolkit](https://redux-toolkit.js.org/)
### 1. 安装
- 新建项目可以使用create-react-app安装：
```bash
# Redux + Plain JS template
npx create-react-app my-app --template redux

# Redux + TypeScript template
npx create-react-app my-app --template redux-typescript
```

- 已存在的项目中安装
```bash
npm install @reduxjs/toolkit
```

- 如果需要React bindings，还需安装react-redux
```bash
npm install react-redux
```

### 2. APIs
Redux Toolkit 包括以下 API：

- `configureStore()`：包装 `createStore` 以提供简化的配置选项和良好的默认值。它可以自动组合你的 slice reducer，添加你提供的任何 Redux 中间件，默认包括 `redux-thunk`，并启用 Redux DevTools Extension。

- `createReducer()`：它允许您为 case reducer 函数提供一个 action types 的查找表，而不是编写 switch 语句。此外，它自动使用 immer 库让您使用普通的可变代码编写更简单的不可变更新，如 `state.todos[3].completed = true`。

- `createAction()`：为给定的 action type 字符串生成一个 action creator function。函数本身定义了 toString() ，因此它可以用来代替类型常量。

- `createSlice()`：接受一个reducer函数对象，一个slice名称，一个初始状态值，自动生成一个slice reducer，对应action creators和action types。

- `createAsyncThunk`：接受一个 action type 字符串和一个返回promise的函数，并生成一个基于该 promise 的 thunk 用于分派pending/fulfilled/rejected（待处理/已完成/拒绝）的action types
![动图演示](img/ReduxAsyncDataFlowDiagram.gif)

- `createEntityAdapter`：生成一组可重用的reducer和selector来管理store中的规范化数据

- The [createSelector utility](https://redux-toolkit.js.org/api/createSelector) from the [Reselect library](https://github.com/reduxjs/reselect), re-exported for ease of use.

### 3. Redux Toolkit TypeScript Quick Start
:::tip
参考:
- [Taro中学习使用react-redux+Toolkit+TypeScript构建小程序自定义tabbar](https://juejin.cn/post/7057206674204917767)
- [在 TypeScript 的项目中使用 Redux Toolkit](https://juejin.cn/post/7034789403709046820)
- [react-redux 搭配 @reduxjs/toolkit 处理异步请求](https://juejin.cn/post/7190642427026210876)
:::

#### 3.1 configureStore
```ts title="src/store/index.ts"
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import tokenSlice from './slices/tokenSlice';
import chosenChildReducer from './slices/chosenChildSlice';

const store = configureStore({
  reducer: {
    chosenChildReducer,
    tokenReducer: tokenSlice.reducer,
  },
});

// 定义type Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define Typed Hooks. 虽然可以将 RootState 和 AppDispatch 类型导入到每个组件中，但最好定义 typed versions of the useDispatch and useSelector hooks 以便于在组件中使用
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
```
- 定义 `useAppDispatch` 和 `useAppSelector` 的方便之处在于：
  - 对于`useSelector`，它使您无需每次都键入`(state：RootState)`。
  - 对于`useDispatch`，默认的 Dispatch 类型不知道 thunk。为了正确调度 thunk，您需要使用store中包含 thunk 中间件类型的特定自定义 AppDispatch 类型，并将其与 useDispatch 一起使用。添加pre-typed的 useDispatch hook可防止您忘记在需要的地方导入 AppDispatch。
  
#### 3.2 createSlice
> 所有生成的 actions 都应使用 Redux Toolkit 中的 `PayloadAction<T>` 类型进行定义，该类型将 action.payload 字段的类型作为其通用参数。

```ts title="src/store/slices/chosenChildSlice.ts"
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";

const initialState: User.IChildInfo = {
  studentNo: '',
  schoolName: '',
  studentName: '',
  isFace: 0,
}

export const chosenChildSlice = createSlice({
  name: 'chosenChild',
  initialState,
  reducers: {
    chosen: (state, action: PayloadAction<User.IChildInfo>) => {
      const { studentNo,studentName,schoolName,isFace } = action.payload;
      state.studentNo = studentNo;
      state.studentName = studentName;
      state.schoolName = schoolName;
      state.isFace = isFace;
    }
  },
});

export const { chosen } = chosenChildSlice.actions;

export const chosenChildState = (state: RootState) => state.chosenChildReducer;

export default chosenChildSlice.reducer;
```

#### 3.3 createAsyncThunk
```ts title="src/store/slices/tokenSlice.ts"
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authUserApi } from '@/requests/index'
import type { RootState } from '..';

// 获取token
export const getAuthToken = createAsyncThunk('getToken', async (param: any) => {
  const result = await authUserApi(param)();
  return result.data;
})

const initialState = {
  token: '',
};
const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAuthToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
  },
});

export const tokenState = (state: RootState) => state.tokenReducer.token;

export default tokenSlice;
```

#### 3.4 在组件中使用`useAppDispatch`和`useAppSelector`
```tsx title="src/pages/home/guide.tsx"
import { useAppDispatch } from "@/store/index";
import { getAuthToken } from '@/store/slices/tokenSlice';
import { chosen } from "@/store/slices/chosenChildSlice";

export default function Guide() {
  const dispath = useAppDispatch();

  function handleChosen(childrenInfo) {
    // 缓存选择的学生
    dispath(chosen(childrenInfo));
  }
  function handleAuth() {
    // @ts-ignore
    my.getPhoneNumber({
      success: res => {
        const encrypt = res.response;
        // @ts-ignore
        my.getAuthCode({
          scopes: 'auth_base',
          success: async (res) => {
            try {
              // token缓存
              await dispath(
                getAuthToken({ authCode: res.authCode, encryptedResponse: encrypt })
              )
              await getParentChildrenInfo();
            } catch (error) {
              Taro.showToast({
                title: error,
                icon: 'error',
                duration: 1500,
              });
            }

          },
          fail: res => {
            console.log('fail::', res)
          },
        });
      },
      fail: res => {
        console.log('fail::', res)
      },
    });
  }
}
```

```tsx title="src/pages/home/index.tsx"
import { useAppSelector } from '@/store/index';
import { chosenChildState } from '@/store/slices/chosenChildSlice';

export default function Home() {
  const chosenChildInfo = useAppSelector(chosenChildState);

  return <ChildInfo
    avatar={chosenChildInfo.avatar}
    studentName={chosenChildInfo.studentName}
    schoolName={chosenChildInfo.schoolName}
    isFace={chosenChildInfo.isFace}
    showServiceTag={false}
  ></ChildInfo>
}
```

#### 3.5 在ts文件中获取state
> 单纯的ts文件中不能使用react-redux的hooks

```ts title="src/requests/index.ts"
import store from "../store";

const {tokenReducer} = store.getState();

console.log('token::', tokenReducer.token)
```

### 4. RTK Query
> RTK Query is a powerful data fetching and caching tool.
