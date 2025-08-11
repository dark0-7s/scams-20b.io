// Suppress React defaultProps warnings from third-party libraries in development
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  
  console.warn = (...args) => {
    // Suppress specific React defaultProps warnings
    if (
      typeof args[0] === 'string' && 
      args[0].includes('Support for defaultProps will be removed from function components')
    ) {
      return;
    }
    
    // Allow all other warnings through
    originalWarn.apply(console, args);
  };
}
