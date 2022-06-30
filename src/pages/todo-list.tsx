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
  const [todoContent,setTodoContent] = useState('');

  useEffect(() => {
    handleFindAll();
  }, []);

  const TARGET_DOMIN = 'https://nest-serverless.vercel.app/'
  const onAdd = () => {
    setTodoContent('');
    setShowDialog(true);
  }
  const handleCreate = async () => {
    try {
      let response = await fetch(`${TARGET_DOMIN}todo-list/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8' // 注意：不加这个，nestjs的接口@Body拿不到请求数据
        },
        body: JSON.stringify({
          content: todoContent,
          startTime: new Date().toLocaleString(),
        })
      });
      const res = await response.json();
      setTodoList(todoList => [...todoList,res.data]);
      setShowDialog(false);
    } catch (error) {
      console.log('Request Failed', error);
    }
  }
  const handleUpdate = async (id: string) => {
    try {
      let response = await fetch(`${TARGET_DOMIN}todo-list/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8' // 注意：不加这个，nestjs的接口@Body拿不到请求数据
        },
        body: JSON.stringify({
          doneTime: new Date().toLocaleString(),
        })
      });
      const res = await response.json();
      console.log('update::', res)
    } catch (error) {
      console.log('Request Failed', error);
    }
  }
  const handleDelete = async (id: string) => {
    try {
      let response = await fetch(`${TARGET_DOMIN}todo-list/delete/${id}`);
      const res = await response.json();
      console.log('delete::', res)
      await handleFindAll();
    } catch (error) {
      console.log('Request Failed', error);
    }
  }
  const handleFindAll = async () => {
    try {
      let response = await fetch(`${TARGET_DOMIN}todo-list/findAll`);
      const res = await response.json();
      setTodoList(res.data);
    } catch (error) {
      console.log('Request Failed', error);
    }
  }
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodoContent(event.target.value);
  }
  const handleCheckChange = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (!event.target.checked) return;
    await handleUpdate(id);
    await handleFindAll();
  }

  return (
    <Layout>
      <div className='tailwind'>
        <div className='mt-5 mb-5 flex flex-col items-center'>
          <div onClick={onAdd} className='cursor-pointer border-solid rounded-3xl w-16 bg-[#4ADE80] text-white flex justify-center items-center'>+新建</div>
          {
            todoList.map((item,index) => (
              <div key={item._id} className={`mt-5 w-3/4 flex justify-between ${item.doneTime && 'line-through'}`}>
                <div>
                  <input type="checkbox" checked={item.doneTime&&true} disabled={item.doneTime&&true} onChange={(event) => handleCheckChange(event,item._id)} />
                  <span className='ml-4 w-3/4'>{item.content}</span>
                </div>
                <div className='ml-3 w-80'>创建于{item.startTime}</div>
                <div className={`ml-3 ${!item.doneTime && 'hidden'}`}>完成于{item.doneTime}</div>
                <div className='cursor-pointer w-14 hidden' onClick={() => handleDelete(item._id)}>删除</div>
              </div>
            ))
          }
        </div>
        <dialog open={showDialog} className='w-80 bg-[#FED7AA] rounded h-3/6'>
          <div className='flex justify-center text-xl'>新增事项</div>
          <textarea className='mt-5 w-full h-3/5' value={todoContent} onChange={(event)=>handleInput(event)}></textarea>
          <div className='flex justify-between mt-5'>
            <div onClick={() => setShowDialog(false)} className='cursor-pointer border-solid rounded w-16 bg-[#64748B] text-white flex justify-center items-center'>取消</div>
            <div onClick={handleCreate} className='cursor-pointer border-solid rounded w-16 bg-[#15803D] text-white flex justify-center items-center'>确定</div>
          </div>
        </dialog>
      </div>
    </Layout>
  )
}