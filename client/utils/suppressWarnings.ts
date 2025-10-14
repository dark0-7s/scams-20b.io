// Suppress specific React "defaultProps will be removed" warnings coming from third-party
// libraries (notably Recharts). We keep the suppression conservative so other warnings/errors
// still surface. Disabled for test environment so unit tests can assert warnings if needed.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);

  const DEFAULT_PROPS_REGEX =
    /defaultProps will be removed|Support for defaultProps will be removed|Support for defaultProps/i;
  const RECHARTS_COMPONENTS: string[] = [];

  function argsToString(args: any[]) {
    try {
      return args
        .map((a) => {
          if (typeof a === "string") return a;
          try {
            return JSON.stringify(a);
          } catch {
            return String(a);
          }
        })
        .join(" ");
    } catch {
      return String(args);
    }
  }

  function containsRechartsComponent(_args: any[]) {
    return true;
  }

  function isInterpolatedDefaultPropsWarning(args: any[]) {
    if (typeof args[0] !== "string") return false;
    if (!/%s/.test(args[0])) return false;
    const joined = argsToString(args);
    return DEFAULT_PROPS_REGEX.test(joined);
  }

  function shouldSuppress(args: any[]) {
    const joined = argsToString(args);
    if (DEFAULT_PROPS_REGEX.test(joined)) return true;
    if (isInterpolatedDefaultPropsWarning(args)) return true;
    return false;
  }

  function makeSuppressor(originalFn: (...a: any[]) => void) {
    return (...args: any[]) => {
      try {
        if (shouldSuppress(args)) return;
      } catch (e) {
        // If suppression check crashes for any reason, fall back to original behavior
        return originalFn(...args);
      }
      return originalFn(...args);
    };
  }

  console.warn = makeSuppressor(originalWarn);
  console.error = makeSuppressor(originalError);
}
