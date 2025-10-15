import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'dart:typed_data';

import 'package:crypto/crypto.dart' as crypto;
import 'package:flutter_ble_peripheral/flutter_ble_peripheral.dart';

/// SCAMS BLE Advertiser
/// Broadcasts a compact packet: [sess4][stud4][ts4][nonce3][mac8]
/// where:
/// - sess4: first 4 bytes of sha256(sessionId)
/// - stud4: first 4 bytes of sha256(studentId)
/// - ts4: UNIX time seconds, big-endian u32
/// - nonce3: 3 bytes random, rotated periodically
/// - mac8: first 8 bytes of HMAC-SHA256(key, sess4|stud4|ts4|nonce3)
/// Total: 23 bytes (fits BLE advertisement payload limits)
class ScamsBleAdvertiser {
  static const int _manufacturerId = 0x1337; // Example manufacturer ID
  static const String serviceUuid = '0000FF01-0000-1000-8000-00805F9B34FB';
  static const Duration nonceRotate = Duration(seconds: 5);

  final FlutterBlePeripheral _ble = FlutterBlePeripheral();
  final Random _rng = Random.secure();

  Timer? _timer;
  Uint8List _currentPacket = Uint8List(0);
  bool _running = false;

  bool get isRunning => _running;
  Uint8List get currentPacket => _currentPacket;

  Future<void> startAdvertising({
    required String sessionId,
    required String studentId,
    required Uint8List sessionKey,
  }) async {
    if (_running) {
      await stopAdvertising();
    }

    await _ensurePermissions();

    // Prepare first packet and start
    _currentPacket = _buildPacket(sessionId: sessionId, studentId: studentId, key: sessionKey);

    final settings = AdvertiseSettings(
      advertiseMode: AdvertiseMode.advertiseModeBalanced,
      txPowerLevel: AdvertiseTxPower.advertiseTxPowerMedium,
      timeout: 0, // 0 = no timeout
      connectable: false,
    );

    final data = AdvertiseData(
      includeDeviceName: false,
      uuid: serviceUuid, // helpful marker
      manufacturerId: _manufacturerId,
      manufacturerData: _currentPacket,
    );

    await _ble.start(settings: settings, data: data);
    _running = true;

    // Rotate nonce and update packet periodically
    _timer = Timer.periodic(nonceRotate, (_) async {
      if (!_running) return;
      _currentPacket = _buildPacket(sessionId: sessionId, studentId: studentId, key: sessionKey);
      // Some platforms/plugins apply new payload on restart; do a seamless refresh
      try {
        await _ble.stop();
      } catch (_) {}
      try {
        await _ble.start(settings: settings, data: AdvertiseData(
          includeDeviceName: false,
          uuid: serviceUuid,
          manufacturerId: _manufacturerId,
          manufacturerData: _currentPacket,
        ));
      } catch (_) {}
    });
  }

  Future<void> stopAdvertising() async {
    _timer?.cancel();
    _timer = null;
    try {
      await _ble.stop();
    } finally {
      _running = false;
      _currentPacket = Uint8List(0);
    }
  }

  Future<void> _ensurePermissions() async {
    // flutter_ble_peripheral handles runtime flows on Android; on iOS, ensure Background Modes enabled.
    // You may still need to request location/ble permissions using a separate permissions plugin if required.
    return;
  }

  Uint8List _buildPacket({
    required String sessionId,
    required String studentId,
    required Uint8List key,
  }) {
    final sess4 = _firstN(crypto.sha256.convert(utf8.encode(sessionId)).bytes, 4);
    final stud4 = _firstN(crypto.sha256.convert(utf8.encode(studentId)).bytes, 4);

    final ts = DateTime.now().toUtc().millisecondsSinceEpoch ~/ 1000;
    final tsBuf = Uint8List(4);
    final bbd = ByteData.view(tsBuf.buffer);
    bbd.setUint32(0, ts, Endian.big);

    final nonce3 = Uint8List.fromList(List<int>.generate(3, (_) => _rng.nextInt(256)));

    final msg = Uint8List(sess4.length + stud4.length + tsBuf.length + nonce3.length)
      ..setRange(0, sess4.length, sess4)
      ..setRange(sess4.length, sess4.length + stud4.length, stud4)
      ..setRange(sess4.length + stud4.length, sess4.length + stud4.length + tsBuf.length, tsBuf)
      ..setRange(sess4.length + stud4.length + tsBuf.length, sess4.length + stud4.length + tsBuf.length + nonce3.length, nonce3);

    final macFull = crypto.Hmac(crypto.sha256, key).convert(msg).bytes;
    final mac8 = _firstN(macFull, 8);

    final out = Uint8List(msg.length + mac8.length)
      ..setRange(0, msg.length, msg)
      ..setRange(msg.length, msg.length + mac8.length, mac8);
    return out;
  }

  Uint8List _firstN(List<int> bytes, int n) => Uint8List.fromList(bytes.sublist(0, n));
}

/// Helper to parse a hex string into bytes (e.g., provisioned session key).
Uint8List hexToBytes(String hex) {
  final clean = hex.replaceAll(RegExp(r'[^0-9a-fA-F]'), '');
  final out = Uint8List(clean.length ~/ 2);
  for (int i = 0; i < clean.length; i += 2) {
    out[i ~/ 2] = int.parse(clean.substring(i, i + 2), radix: 16);
  }
  return out;
}
