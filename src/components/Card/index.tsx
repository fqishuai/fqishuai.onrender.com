import React from 'react';

export default function Card(props): JSX.Element {
  const handleClick = (linkVal: string) => {
    location.href = linkVal;
  }
  return <div className='card-container tailwind'>
    <div className={`rounded-lg w-1/3 h-30 cursor-pointer p-2.5 ${props.bgColor}`} onClick={() => handleClick(props.linkVal)}>
      <div className={`${props.titleBgColor} text-white text-2xl`}>{props.title}</div>
      <div>{props.children}</div>
    </div>
  </div>
}