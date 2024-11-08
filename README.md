My SSR/SSG vite demo

Sources:


1. _submodules - repos with official demos
   (don't forget to init them: git submodule update --init --recursive)

2. lib_demos
3. lib_demos_local - local copy of lib demos (modified only to make them work)
4.


Content:

 - vite-plugin-react -> ssr-react - the actual copy of https://github.com/vitejs/vite-plugin-react/tree/main/playground/ssr-react this demo is based on

     Major changes:
      - react-router v6.27 approach of routing

     Minor changes:

      - added dependencies as in https://github.com/stormkit-io/monorepo-template-react (just as working example - could be chanbged)
      - set vite-react-plugin version

 - mydemo - my demo based on vite-plugin-react-ssr-demo

     details inside


submodules:
