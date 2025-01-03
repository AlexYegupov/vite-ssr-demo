import myimage from './assets/myimage.png'
import myjson from './myjson.json'

export function About() {
  console.log(myimage, myjson)
  return (
    <div>
      <h2>About</h2>
      <img src={myimage} />
    </div>
  );
}
