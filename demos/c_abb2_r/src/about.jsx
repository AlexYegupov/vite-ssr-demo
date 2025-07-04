import myimage from './assets/myimage.png'
import myjson from './myjson.json'
import { useLoaderData } from 'react-router'

export async function aboutLoader() {
  return {
    image: myimage,
    json: myjson
  };
}

export function About() {
  const { image, json } = useLoaderData()
  console.log(`About`)
  return (
    <div>
      <h2>About</h2>
      <img src={image} alt="My Image" />
      <pre>
        JSON Data: {JSON.stringify(json, null, 2)}
      </pre>
    </div>
  );
}
