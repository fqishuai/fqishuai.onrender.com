import React, { useState } from 'react'
import { Editor, Viewer } from '@bytemd/react'
import 'bytemd/dist/index.css'
// import gfm from '@bytemd/plugin-gfm'

// const plugins = [
//   gfm(),
//   // Add more plugins here
// ]

export default function Markdown() {
  const [value, setValue] = useState('')

  return (
    <Editor
      value={value}
      // plugins={plugins}
      onChange={(v) => {
        setValue(v)
      }}
    />
  )
}