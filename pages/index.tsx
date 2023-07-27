import Head from "next/head";
import styles from "../styles/Home.module.css";
import { get } from "lodash";
import { useState } from "react";

function getRequest(network: string, type: "api" | "lcd" | "rpc" | "rpc-post") {
  switch (type) {
    case "rpc":
      return {
        url: `/numia/${network}-rpc/block`,
        propertyPath: "result.block.header.height",
      };

    case "rpc-post":
      return {
        url: `/numia/${network}-rpc`,
        propertyPath: "result.block.header.height",
        init: {
          method: "POST",
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 337952253654,
            method: "block",
            params: {},
          }),
        },
      };
    case "lcd":
      return {
        url: `/numia/${network}-lcd/cosmos/base/tendermint/v1beta1/blocks/latest`,
        propertyPath: "block.header.height",
      };
    case "api":
      return {
        url: `/numia/${network}/height`,
        propertyPath: "latestBlockHeight",
      };
  }
}

export default function Home() {
  const [state, setState] = useState<Record<string, string>>({});

  async function getUrl(
    network: string,
    type: "api" | "lcd" | "rpc" | "rpc-post"
  ) {
    const { url, propertyPath, init } = getRequest(network, type);
    const path = type === "rpc" ? "/blocks/latest" : type === "lcd";
    const res = await fetch(url, init);
    const data = await res.json();

    const height = get(data, propertyPath);
    console.log(network, height);
    setState((c) => ({ ...c, [network]: height }));
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Numia Vercel Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Welcome to <a href="https://numia.xyz">Numia</a> Demo
        </h1>

        <p className={styles.description}>
          Check out the middleware in <code>middleware.ts</code>
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Cosmos Hub RPC</h3>
            <button onClick={() => getUrl("cosmos", "rpc")}>Load Block</button>
            {state.cosmos ? <p>Latest Block: {state.cosmos}</p> : null}
          </div>

          <div className={styles.card}>
            <h3>Stride RPC</h3>
            <button onClick={() => getUrl("stride", "rpc-post")}>
              Load Block
            </button>
            {state.stride ? <p>Latest Block: {state.stride}</p> : null}
          </div>

          <div className={styles.card}>
            <h3>Osmosis LCD</h3>
            <button onClick={() => getUrl("osmosis", "lcd")}>Load Block</button>
            {state.osmosis ? <p>Latest Block: {state.osmosis}</p> : null}
          </div>

          <div className={styles.card}>
            <h3>Juno API</h3>
            <button onClick={() => getUrl("juno", "api")}>Load Block</button>
            {state.juno ? <p>Latest Block: {state.juno}</p> : null}
          </div>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
