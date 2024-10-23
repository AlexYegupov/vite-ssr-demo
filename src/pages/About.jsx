import { addAndMultiply } from '../add'
import { multiplyAndAdd } from '../multiply'
import React, { useState } from 'react';


export default function About() {
  const [count, setCount] = useState(0);


  return (
    <>
      <h1>About5</h1>
      <div>{addAndMultiply(1, 2, 3)}</div>
      <div>{multiplyAndAdd(1, 2, 3)}</div>

      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>x
    </>
  )
}
