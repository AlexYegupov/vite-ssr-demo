import { j as jsxRuntimeExports, u as useLoaderData } from "./index-Bv7jzeLR.js";
const loader = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    name: "test value"
  };
};
function LazyPage() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Lazy Route!1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Date from loader: ",
      data.name
    ] })
  ] });
}
const element = /* @__PURE__ */ jsxRuntimeExports.jsx(LazyPage, {});
export {
  element,
  loader
};
