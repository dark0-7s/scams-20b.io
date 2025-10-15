export async function isNativeApp() {
  return typeof (window as any).Capacitor !== 'undefined';
}

export async function markAttendanceNative(payload: any) {
  if (await isNativeApp()) {
    return (window as any).Capacitor.Plugins.Attendance?.mark(payload);
  } else {
    return { success: true, simulated: true };
  }
}

export async function doBiometric() {
  if (await isNativeApp() && (window as any).Capacitor.Plugins.Biometric) {
    return (window as any).Capacitor.Plugins.Biometric.authenticate();
  }
  return confirm('Simulate biometric verification?');
}
