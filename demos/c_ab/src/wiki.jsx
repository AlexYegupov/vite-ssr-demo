import { useParams } from "react-router";

export function Wiki() {
  let { "*": splat } = useParams();
  console.log(`Wiki params:`, splat)

  const breadcrumbs = splat.split('/').filter(Boolean).join(' :: ')
  return (
    <div>

      <h2>Wiki</h2>
      { breadcrumbs }
      <p>text</p>
    </div>
  );
}
