// Suppress React defaultProps warnings from third-party libraries in development
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;

  console.warn = (...args) => {
    // Handle React's warning format with string interpolation
    const message = args[0];
    const additionalArgs = args.slice(1);

    // Check if this is a React defaultProps warning
    if (
      typeof message === 'string' &&
      (message.includes('Support for defaultProps will be removed from function components') ||
       message.includes('%s: Support for defaultProps will be removed'))
    ) {
      return;
    }

    // Also check additional arguments for component names like XAxis, YAxis
    const fullMessage = typeof message === 'string' ? message : '';
    const hasRechartsComponent = additionalArgs.some(arg =>
      typeof arg === 'string' && (arg === 'XAxis' || arg === 'YAxis' || arg.includes('Chart'))
    );

    if (fullMessage.includes('defaultProps') && hasRechartsComponent) {
      return;
    }

    // Allow all other warnings through
    originalWarn.apply(console, args);
  };
}
