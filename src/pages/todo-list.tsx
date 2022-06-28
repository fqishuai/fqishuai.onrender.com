import React, { useState } from 'react';
import Layout from '@theme/Layout';

interface ITodoList {
  _id: string,
  content: string,
  createTime: string,
  finishTime?: string,
  name: string,
  age: number,
}

export default function TodoList() {
  
  const [todoList,setTodoList] = useState([
    {
      content: '开发nav组件用于自定义页面',
      createTime: '2022-06-21 23:00:58'
    },
    {
      content: 'todolist内容存到mongodb',
      createTime: '2022-06-21 23:05:37'
    }
  ] as ITodoList[]);

  const handleCreate = async () => {
    try {
      let response = await fetch('http://localhost:3001/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8' // 注意：不加这个，nestjs的接口@Body拿不到请求数据
        },
        body: JSON.stringify({
          name: 'LeBron',
          age: 37,
        })
      });
      const res = await response.json();
      setTodoList(todoList => [...todoList,res.data])
    } catch (error) {
      console.log('Request Failed', error);
    }
  }
  const handleUpdate = async () => {
    try {
      let response = await fetch('http://localhost:3001/user/update/62b9cebd4af529297c3fc493', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8' // 注意：不加这个，nestjs的接口@Body拿不到请求数据
        },
        body: JSON.stringify({
          name: 'LeBron',
          age: 16,
        })
      });
      const res = await response.json();
      // setTodoList(todoList => [...todoList,res.data])
    } catch (error) {
      console.log('Request Failed', error);
    }
  }
  const handleDelete = async () => {
    try {
      let response = await fetch('http://localhost:3001/user/delete/62b9cebd4af529297c3fc493');
      const res = await response.json();
      // setTodoList(todoList => [...todoList,res.data])
    } catch (error) {
      console.log('Request Failed', error);
    }
  }
  const handleFindAll = async () => {
    try {
      let response = await fetch('http://localhost:3001/user/findAll');
      const res = await response.json();
    } catch (error) {
      console.log('Request Failed', error);
    }
  }

  return (
    <Layout>
      <div className='tailwind'>
        <button onClick={handleCreate}>新建</button>
        <button onClick={handleUpdate}>更新</button>
        <button onClick={handleDelete}>删除</button>
        <button onClick={handleFindAll}>查询</button>
        {
          todoList.map((item,index) => <div key={item._id}>
            <input type="checkbox" />
            <span>{item.content}</span>
            <span className='ml-3'>创建于{item.createTime}</span>
          </div>)
        }
      </div>
    </Layout>
  )
}