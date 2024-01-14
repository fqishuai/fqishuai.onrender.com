---
slug: router
tags: [react]
---

:::tip
- [reactrouter文档](https://reactrouter.com/en/main)
- [examples](https://github.com/remix-run/react-router/tree/dev/examples)
路由可以在没有path的情况下使用，这让它们可以参与 UI 布局。
:::

首先，使用vite创建一个react工程：`npm create vite@latest name-of-your-project -- --template react`
然后，安装依赖包`react-router-dom`及其他所需的依赖包：`npm install react-router-dom localforage match-sorter sort-by`
> 使用ts的话需要安装类型声明：`npm install --save-dev @types/sort-by`
> localForage 在不支持 IndexedDB 或 WebSQL 的浏览器中使用 localStorage，在支持 IndexedDB 的浏览器中使用IndexedDB。


Anytime your app throws an error while rendering, loading data, or performing data mutations, React Router will catch it and render an error screen. 任何时候您的应用程序在渲染、加载数据或执行数据突变时抛出错误，React Router 都会捕获它并渲染错误屏幕。

## 选择使用哪个路由
> [Picking a Router](https://reactrouter.com/en/main/routers/picking-a-router)

6.4版本引入了以下路由以支持data APIs:
- `createBrowserRouter` 建议所有 Web 项目都使用 `createBrowserRouter`
- `createMemoryRouter`
- `createHashRouter`
- `createStaticRouter`

以下路由不支持data APIs:
- `<BrowserRouter>`
- `<MemoryRouter>`
- `<HashRouter>`
- `<NativeRouter>`
- `<StaticRouter>`

## Data APIs
以下 API 是在 React Router 6.4 中引入的，并且仅在使用数据路由器时才有效:
- `route.action`
- `route.errorElement`
- `route.lazy`
- `route.loader`
- `route.shouldRevalidate`
- `route.handle`
- `<Await>`
- `<Form>`
- `<ScrollRestoration>`
- `useActionData`
- `useAsyncError`
- `useAsyncValue`
- `useFetcher`
- `useFetchers`
- `useLoaderData`
- `useMatches`
- `useNavigation`
- `useRevalidator`
- `useRouteError`
- `useRouteLoaderData`
- `useSubmit`
- `startViewTransition` support on `Link` and `useNavigate`

## `createBrowserRouter()`
这是所有 React Router Web 项目的推荐路由器。 它使用 DOM History API 来更新 URL 并管理历史堆栈。
```tsx
const routes = [
  {
    path: "/",
    element: <Login />,
  },
];
createBrowserRouter(routes, {
  basename: "/app",
});
```
basename适用于无法部署到域根目录而是子目录的情况:
```tsx
createBrowserRouter(routes, {
  basename: "/app",
});
<Link to="/" />; // results in <a href="/app" />

createBrowserRouter(routes, {
  basename: "/app/",
});
<Link to="/" />; // results in <a href="/app/" />
```

### Route
```tsx
const router = createBrowserRouter([
  {
    // it renders this element
    element: <Team />,

    // when the URL matches this segment
    path: "teams/:teamId",

    // with this data loaded before rendering
    loader: async ({ request, params }) => {
      return fetch(
        `/fake/api/teams/${params.teamId}.json`,
        { signal: request.signal }
      );
    },

    // performing this mutation when data is submitted to it
    action: async ({ request }) => {
      return updateFakeTeam(await request.formData());
    },

    // and renders this element in case something went wrong
    errorElement: <ErrorBoundary />,
  },
]);
```
使用 `createRoutesFromElements`(用于构造JSX风格的路由) 的话，上面例子可以写成：
```tsx
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<Team />}
      path="teams/:teamId"
      loader={async ({ params }) => {
        return fetch(
          `/fake/api/teams/${params.teamId}.json`
        );
      }}
      action={async ({ request }) => {
        return updateFakeTeam(await request.formData());
      }}
      errorElement={<ErrorBoundary />}
    />
  )
);
```

#### `path`
#### `element`
#### `errorElement`
#### `loader`
`loader`会在路由渲染之前被调用
```tsx
<Route
  path="/teams/:teamId"
  loader={({ params }) => {
    return fetchTeam(params.teamId);
  }}
/>;

function Team() {
  let team = useLoaderData();
  // ...
}
```

- 与`useLoaderData`结合使用，`useLoaderData`获取`loader`返回的数据；
- URL Params会传递给`loader`, For example, our segment is named `:contactId` so the value will be passed as `params.contactId`.
- `loader`可以共享，但尽量每个`route`有自己的`loader`

#### `action`
当 `<Form>`, `useFetcher`, 或 `useSubmit` 发送一个提交到该路由时，`action`被调用
```tsx
<Route
  path="/teams/:teamId"
  action={({ request }) => {
    const formData = await request.formData();
    return updateTeam(formData);
  }}
/>
```

- `loader` 和 `action` 都能接收`request`
#### `children`
与`<Outlet>`结合使用

#### `index`
为`true`时，默认匹配的路由

## `<Form>`
- `<Form>`与`<form>`的区别是，`<Form>` 阻止浏览器将请求发送到服务器，而是将其发送到您的route action(包括FormData)
```jsx
<Form method="post">
  <button type="submit">New</button>
</Form>

// 如下指定route action
// React Router automatically revalidate the data on the page after the action finishes. React Router在该action完成后会自动重新验证页面上的数据，即会触发loader。
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
      },
      {
        path: 'contacts/:contactId/edit',
        element: <EditContact />,
        loader: contactLoader, // loader可以共享，但尽量每个route有自己的loader
        action: editAction,
      },
      {
        path: 'contacts/:contactId/destroy',
        action: destroyAction,
      },
    ],
  },
])

// 或者使用 Form 的 property---action 指定action
<Form action="edit">
  <button type="submit">Edit</button>
</Form>

// 定义action
export async function action({ request, params }: { request: any, params: any }) {
  const formData = await request.formData();
  const firstName = formData.get("first");
  const lastName = formData.get("last");
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
```

- 和`<Link to>`一样，`<Form action>`可以取一个相对值。由于表单是在 `contacts/:contactId` 中呈现的，因此`action="edit"`将在单击时将表单提交给 `contacts/:contactId/edit`。

- `<Form>` 的method为 GET 而不是 POST 时，React Router 不会调用action。提交 GET 表单与单击链接相同：只是 URL 发生了变化。

## `useFetcher()`
> It allows us to communicate with loaders and actions without causing a navigation. 允许我们在 不引起导航的情况下(URL 不会改变，历史堆栈不受影响) 与`loaders` 和 `actions` 进行通信。

```jsx
import { Form, useLoaderData, useFetcher } from "react-router-dom";

function Favorite({ contact }: { contact: IContact }) {
  const fetcher = useFetcher();

  let favorite = contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite" // 浏览器可以通过name属性来序列化表单
        value={favorite ? "false" : "true"} // This form will send formData with a favorite key that's either "true" | "false".
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
```

## `useSubmit()`
```jsx
import { useSubmit } from 'react-router-dom'

export default function Root() {
  const submit = useSubmit();

  return (
    <Form id="search-form" role="search">
      <input
        id="q"
        aria-label="Search contacts"
        placeholder="Search"
        type="search"
        name="q"
        defaultValue={q}
        onChange={(event) => {
          console.log('input change::', event.currentTarget.form)
          submit(event.currentTarget.form);
        }}
      />
    </Form>
  );
}
```

## `<RouterProvider>`

## `useRouteError()`
provides the error that was thrown

## `<Outlet>`

## `<Link>`
allows our app to update the URL without requesting another document from the server. 通过查看the network tab in the browser devtools可以看到`<Link to>`与`<a href>`的区别，`<Link to>`不需要requesting documents

## `useLoaderData()`
接收loader指定的函数返回的值

## `redirect()`

## `<NavLink>`
当用户位于 NavLink 中的 URL 时，isActive 将为真。当它即将激活（数据仍在加载）时，isPending 将为真。这使我们能够轻松地指示用户所在的位置，并对已单击但我们仍在等待数据加载的链接提供即时反馈。
```jsx
<NavLink
  to={`contacts/${contact.id}`}
  className={({ isActive, isPending }) =>
    isActive
      ? "active"
      : isPending
      ? "pending"
      : ""
  }
></NavLink>
```

## `useNavigation()`
add global pending UI, `useNavigation` returns the current navigation state: it can be one of "idle" | "submitting" | "loading".

- navigation state
```jsx
import { useNavigation } from 'react-router-dom'

export default function Root() {
  const navigation = useNavigation();
  return (
    <div
      id="detail"
      className={navigation.state === 'loading' ? 'loading' : ''}
    >
      <Outlet />
    </div>
  );
}
```

- navigation location
> `navigation.location` 将在应用导航到新 URL 并为其加载数据时显示。当不再有挂起的导航(pending navigation)时，它就会消失。
```jsx
import { useNavigation } from 'react-router-dom'

export default function Root() {
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  return (
    <Form id="search-form" role="search">
      <input
        id="q"
        className={searching ? 'loading' : ''}
        aria-label="Search contacts"
        placeholder="Search"
        type="search"
        name="q"
        defaultValue={q}
        onChange={(event) => {
          console.log('input change::', event.currentTarget.form)
          submit(event.currentTarget.form);
        }}
      />
      <div
        id="search-spinner"
        aria-hidden
        hidden={!searching}
      />
    </Form>
  );
}
```

## `useNavigate()`
```jsx
import { useNavigate } from "react-router-dom";

export default function EditContact() {
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <button type="submit">Save</button>
        <button
          type="button" // <button type="button"> 虽然看似多余，但它是防止按钮提交其表单的 HTML 方式。
          onClick={() => {
            navigate(-1);
          }}
        >Cancel</button>
      </p>
    </Form>
  );
}
```

## 传参接参
> [react-router 路由传参的三种方式](https://segmentfault.com/a/1190000041136562)

### 1. 使用`<Link>`或`<NavLink>`
> `useParams`、`useLocation`、`useSearchParams`

1. params参数
```jsx
//路由链接(携带参数)：
<Link to={{ pathname:`/b/child1/${id}/${title}` }}>Child1</Link>
//或 <Link  to={`/b/child1/${id}/${title}`}>Child1</Link> 

//注册路由(声明接收)：
<Route path="/b/child1/:id/:title" component={Test}/>
    
//接收参数：
import { useParams } from "react-router-dom";
const params = useParams();
//params参数 => {id: "01", title: "消息1"}
```

2. search参数
```jsx
//路由链接(携带参数)：
<Link className="nav" to={`/b/child2?age=20&name=zhangsan`}>Child2</Link>

//注册路由(无需声明，正常注册即可)：
<Route path="/b/child2" component={Test}/>
        
//接收参数方法1：
import { useLocation } from "react-router-dom";
import qs from "query-string";
const { search } = useLocation();
//备注：获取到的search是urlencoded编码字符串(例如: ?age=20&name=zhangsan)，需要借助query-string解析参数成对象，转换后 => {age: "20", name: "zhangsan"}

//接收参数方法2：
import { useSearchParams } from "react-router-dom";
const [searchParams, setSearchParams] = useSearchParams();
// console.log( searchParams.get("id")); // 12
```

3. state参数
```jsx
//通过Link的state属性传递参数
 <Link
  className="nav"
  to={`/b/child2`}
  state={{ id: 999, name: "i love merlin" }} 
 >
  Child2
</Link>

//注册路由(无需声明，正常注册即可)：
<Route path="/b/child2" component={Test}/>
    
//接收参数：
import { useLocation } from "react-router-dom";
const { state } = useLocation();
//state参数 => {id: 999, name: "我是梅琳"}

//备注：刷新也可以保留住参数
```

### 2. 手动跳转(`useNavigate`)
```jsx
import { useNavigate } from "react-router-dom";

function useLogoutTimer() {
  const userIsInactive = useFakeInactiveUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (userIsInactive) {
      fake.logout();
      navigate("/session-timed-out");
    }
  }, [userIsInactive]);
}
```
- navigate函数接收两个参数，第一个参数是一个路径字符串，第二个参数是options(`options.replace`,`options.state`,`options.preventScrollReset`,`options.relative`)
- navigate函数也可以传递想要进入历史堆栈的增量。例如，`navigate(-1)` 相当于点击后退按钮