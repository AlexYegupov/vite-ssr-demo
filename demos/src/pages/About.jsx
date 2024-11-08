import React, { useState } from 'react';


export default function About() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>About5</h1>

      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </>
  )
}
