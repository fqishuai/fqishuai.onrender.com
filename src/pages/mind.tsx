import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function Mind() {
  const [minder, setMinder] = useState(null)

  useEffect(() => {
    console.log("minder => ", minder)
  }, [minder])
  
  return (
    <Layout>
      
    </Layout>
  )
}