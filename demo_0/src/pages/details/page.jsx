import React, { useState } from 'react';


export default function Details() {
  const [count, setCount] = useState(0);


  return (
    <>
      <h1>Details</h1>

      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>x
    </>
  )
}
