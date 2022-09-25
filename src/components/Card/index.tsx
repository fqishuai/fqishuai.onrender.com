import React from 'react';

interface ICardProp {
  title: string;
  bgColor: string;
  children: JSX.Element | string;
  linkValue?: string;
  titleBgColor?: string;
}

export default function Card(props: ICardProp): JSX.Element {
  const handleClick = () => {
    window.open(props.linkValue);
  }
  return <div className='card-container tailwind'>
    <div
      className={`rounded-lg w-96 h-30 cursor-pointer p-2.5 box-border ${props.bgColor}`}
      onClick={handleClick}
    >
      <div className={`${props.titleBgColor} text-white text-2xl text-center pb-2`}>{props.title}</div>
      <div>{props.children}</div>
    </div>
  </div>
}