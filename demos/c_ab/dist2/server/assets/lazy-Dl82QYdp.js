import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useLoaderData } from "react-router-dom";
const loader = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    name: "test value"
  };
};
function LazyPage() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { children: "Lazy Route!1" }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Date from loader: ",
      data.name
    ] })
  ] });
}
const element = /* @__PURE__ */ jsx(LazyPage, {});
export {
  element,
  loader
};
