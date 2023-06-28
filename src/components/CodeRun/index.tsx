import React from 'react';
import RunKit from 'react-runkit-embed/RunKit';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function CodeRun({ children }) {
  return (
    <BrowserOnly>
    {
      () => <RunKit>
        {
          children
        }
      </RunKit>
    }
    </BrowserOnly>
  )
}