// Suppress React defaultProps warnings from third-party libraries in development
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  const originalError = console.error;

  // Suppression function for both warn and error
  const suppressDefaultPropsWarnings = (originalFn: any) => (...args: any[]) => {
    // Convert all arguments to strings for analysis
    const allArgsAsString = args.map(arg => String(arg)).join(' ');

    // Comprehensive patterns to catch all defaultProps warnings
    const isDefaultPropsWarning =
      allArgsAsString.includes('Support for defaultProps will be removed from function components') ||
      allArgsAsString.includes('defaultProps will be removed') ||
      (allArgsAsString.includes('defaultProps') &&
       (allArgsAsString.includes('XAxis') ||
        allArgsAsString.includes('YAxis') ||
        allArgsAsString.includes('Chart') ||
        allArgsAsString.includes('recharts'))) ||
      // Catch React's interpolated format
      (typeof args[0] === 'string' &&
       args[0].includes('%s') &&
       args[0].includes('defaultProps') &&
       args.some((arg: any) => typeof arg === 'string' &&
         (arg === 'XAxis' || arg === 'YAxis' || arg.includes('Axis'))));

    if (isDefaultPropsWarning) {
      return; // Suppress the warning
    }

    // Allow all other warnings/errors through
    originalFn.apply(console, args);
  };

  console.warn = suppressDefaultPropsWarnings(originalWarn);
  console.error = suppressDefaultPropsWarnings(originalError);
}
