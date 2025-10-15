// Aggressive suppression for noisy third-party warnings (Recharts) and duplicate createRoot warnings.
// Disabled in test environment so unit tests can assert warnings if needed.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  const MARKER = "__SUPPRESS_WARNINGS_APPLIED__";
  if (!(window as any)[MARKER]) {
    (window as any)[MARKER] = true;

    const originalWarn = console.warn.bind(console);
    const originalError = console.error.bind(console);
    const originalInfo =
      typeof console.info === "function"
        ? console.info.bind(console)
        : undefined;
    const originalLog = console.log.bind(console);

    const SUPPRESS_RE =
      /defaultProps|Support for defaultProps will be removed|createRoot|already been passed to createRoot|root\.render|ReactDOMClient\.createRoot/i;

    function argsToString(args: any[]) {
      try {
        return args
          .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
          .join(" ");
      } catch {
        try {
          return String(Array.prototype.slice.call(args));
        } catch {
          return "";
        }
      }
    }

    function shouldSuppress(args: any[]) {
      try {
        if (!args || args.length === 0) return false;
        if (typeof args[0] === "string" && SUPPRESS_RE.test(args[0]))
          return true;
        const joined = argsToString(args);
        if (SUPPRESS_RE.test(joined)) return true;
      } catch (e) {
        return false;
      }
      return false;
    }

    function makeSuppressor(originalFn?: (...a: any[]) => void) {
      return (...args: any[]) => {
        try {
          if (shouldSuppress(args)) return;
        } catch (e) {
          // fallthrough
        }
        if (originalFn) return originalFn(...args);
      };
    }

    console.warn = makeSuppressor(originalWarn);
    console.error = makeSuppressor(originalError);
    if (originalInfo) console.info = makeSuppressor(originalInfo);
    console.log = makeSuppressor(originalLog);
  }
}
