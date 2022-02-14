import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

/** @type {import("rollup").RollupOptions} */
const options = {
    input: "./src/index.js",
    output: {
        file: "./SEmbeds/index.js"
        //globals: path => (console.log("Path", path), `await require(${JSON.stringify(path)})`)
    },
    plugins: [
        resolve({
            browser: true
            //resolveOnly: ["guilded"]
        }),
        commonjs()
    ]
};
export default options;
