import { createServer } from 'vite';
import React from 'react';
import ReactDOMServer from 'react-dom/server';



(async () => {
  const server = await createServer();

  const { default: Test } = await server.ssrLoadModule('./test.jsx');

  //const html = ReactDOMServer.renderToString(React.createElement(Test));
  //console.log(html);

  server.close();
})();
