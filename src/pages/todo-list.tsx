import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

interface ITodoList {
  _id: string,
  content: string,
  startTime: string,
  doneTime?: string,
}

export default function TodoList() {
  
  const [todoList,setTodoList] = useState([] as ITodoList[]);
  const [showDialog,setShowDialog] = useState(false);

  useEffect(() => {
    handleFindAll();
  }, []);

  const onAdd = () => {
    setShowDialog(true);
  }
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
      setTodoList(todoList => [...todoList,res.data]);
      setShowDialog(false);
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
      setTodoList(todoList => [...todoList,res.data]);
    } catch (error) {
      console.log('Request Failed', error);
    }
  }

  return (
    <Layout>
      <div className='tailwind'>
        <div className='mt-5 flex flex-col items-center'>
          <div onClick={onAdd} className='cursor-pointer border-solid rounded-3xl w-16 bg-[#4ADE80] text-white flex justify-center items-center'>+新建</div>
          <div className='hidden' onClick={handleUpdate}>更新</div>
          <div className='hidden' onClick={handleDelete}>删除</div>
          <div className='hidden' onClick={handleFindAll}>查询</div>
          {
            todoList.map((item,index) => <div key={item._id}>
              <input type="checkbox" />
              <span>{item.content}</span>
              <span className='ml-3'>创建于{item.startTime}</span>
            </div>)
          }
        </div>
        <dialog open={showDialog} className='w-80 bg-[#FED7AA] rounded h-3/6'>
          <div className='flex justify-center text-xl'>新增事项</div>
          <textarea className='mt-5 w-full h-3/5'></textarea>
          <div className='flex justify-between mt-5'>
            <div onClick={() => setShowDialog(false)} className='cursor-pointer border-solid rounded w-16 bg-[#64748B] text-white flex justify-center items-center'>取消</div>
            <div onClick={handleCreate} className='cursor-pointer border-solid rounded w-16 bg-[#15803D] text-white flex justify-center items-center'>确定</div>
          </div>
        </dialog>
      </div>
    </Layout>
  )
}