import React from 'react';

interface ICardProp {
  title: string;
  bgColor: string;
  children: JSX.Element | string;
  linkValue?: string;
  titleColor?: string;
  contntColor?: string;
}

export default function Card(props: ICardProp): JSX.Element {
  const handleClick = () => {
    window.open(props.linkValue);
  }
  return <div className='card-container tailwind'>
    <div
      className={`rounded-lg w-96 h-32 cursor-pointer px-2.5 pt-2.5 mb-2.5 box-border ${props.bgColor}`}
      onClick={handleClick}
    >
      <div className={`${props.titleColor} text-2xl text-center`}>{props.title}</div>
      <div className={`text-center ${props.contntColor}`}>{props.children}</div>
    </div>
  </div>
}