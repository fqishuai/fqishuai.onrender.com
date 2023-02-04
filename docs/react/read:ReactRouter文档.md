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

### 1. `createBrowserRouter()`
- path
- element
- errorElement
- loader
  - 与useLoaderData结合使用；
  - URL Params会传递给loader, For example, our segment is named `:contactId` so the value will be passed as `params.contactId`.
  - loader可以共享，但尽量每个route有自己的loader
- action  loader和action都能接收request
- children  与`<Outlet>`结合使用
- index  为true时，默认匹配的路由

### 2. `<RouterProvider>`

### 3. `useRouteError()`
provides the error that was thrown

### 4. `<Form>`
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

### 5. `<Outlet>`

### 6. `<Link>`
allows our app to update the URL without requesting another document from the server. 通过查看the network tab in the browser devtools可以看到`<Link to>`与`<a href>`的区别，`<Link to>`不需要requesting documents

### 7. `useLoaderData()`
接收loader指定的函数返回的值

### 8. `redirect()`

### 9. `<NavLink>`
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

### 10. `useNavigation()`
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

### 11. `useNavigate()`
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

### 12. `useSubmit()`
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

### 13. `useFetcher()`
> It allows us to communicate with loaders and actions without causing a navigation. 允许我们在 不引起导航的情况下(URL 不会改变，历史堆栈不受影响) 与loaders 和 actions 进行通信。

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

### 14. createRoutesFromElements
用于构造JSX风格的路由

```jsx
import {
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      loader={rootLoader}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route
          path="contacts/:contactId"
          element={<Contact />}
          loader={contactLoader}
          action={contactAction}
        />
        <Route
          path="contacts/:contactId/edit"
          element={<EditContact />}
          loader={contactLoader}
          action={editAction}
        />
        <Route
          path="contacts/:contactId/destroy"
          action={destroyAction}
        />
      </Route>
    </Route>
  )
);
```