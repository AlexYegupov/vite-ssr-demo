import React, { useState } from 'react';


export default function Test() {
  const [count, setCount] = useState(0);


  return (
    <>
      <h1>Test</h1>

      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>x
    </>
  )
}
