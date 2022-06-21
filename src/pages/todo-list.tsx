import React, { useState } from 'react';

interface ITodoList {
  content: string,
  createTime: string,
  finishTime?: string,
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

  return (
    <div className='tailwind'>
      <button>新建</button>
      {
        todoList.map((item,index) => <div>
          <input type="checkbox" />
          <span>{item.content}</span>
          <span className='ml-3'>创建于{item.createTime}</span>
        </div>)
      }
    </div>
  )
}