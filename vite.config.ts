import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
    build: {
      base: './', // ensures relative asset paths for WebView
      outDir: "dist/spa",
    },
  plugins: [suppressRechartsPlugin(), react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function suppressRechartsPlugin(): Plugin {
  return {
    name: "suppress-recharts-warnings",
    apply: () => true,
    transform(code, id) {
      try {
        if (
          !/node_modules.*recharts/.test(id) &&
          !/recharts(\.js|\.mjs|\/index\.js)/.test(id)
        )
          return null;
        // Prepend a light-weight suppression wrapper to module so console methods are guarded
        const patch = `// Injected by suppress-recharts-warnings plugin
(function(){
  try{
    var R_SUPPRESS_RE = /defaultProps|Support for defaultProps will be removed|createRoot|already been passed to createRoot|root\\.render|ReactDOMClient\\.createRoot/i;
    var origWarn = console.warn && console.warn.bind(console);
    var origError = console.error && console.error.bind(console);
    if(origWarn) console.warn = function(){ try{ var args = Array.prototype.slice.call(arguments); var joined = args.map(function(a){ return typeof a === 'string' ? a : JSON.stringify(a); }).join(' '); if(R_SUPPRESS_RE.test(joined)) return; }catch(e){} return origWarn.apply(console, arguments); };
    if(origError) console.error = function(){ try{ var args = Array.prototype.slice.call(arguments); var joined = args.map(function(a){ return typeof a === 'string' ? a : JSON.stringify(a); }).join(' '); if(R_SUPPRESS_RE.test(joined)) return; }catch(e){} return origError.apply(console, arguments); };
  }catch(e){}
})();
`;
        return patch + code;
      } catch (e) {
        return null;
      }
    },
  };
}

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
