import type { GetResult } from '@fingerprintjs/fingerprintjs';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';

declare global {
  interface Navigator {
    userAgentData?: {
      platform: string;
    };
  }
}

interface IDeviceInfo {
  deviceFingerprint: string;
  deviceName: string;
  ipAddress: string;
  location: string;
}

async function getDeviceFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load();
  const result: GetResult = await fp.get();
  return result.visitorId;
}

async function getIPInfo(): Promise<{ ip: string; location: string }> {
  try {
    const response = await axios.get('http://ip-api.com/json/?fields=status,message,country,city,query');
    if (response.data.status === 'success') {
      return {
        ip: response.data.query,
        location: `${response.data.city}, ${response.data.country}`,
      };
    }
    throw new Error('Failed to get IP info');
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return {
      ip: '',
      location: '',
    };
  }
}

export async function getDeviceInfo(): Promise<IDeviceInfo> {
  const [fingerprint, ipInfo] = await Promise.all([
    getDeviceFingerprint(),
    getIPInfo(),
  ]);

  let deviceName = 'Unknown Device';
  try {
    if (navigator.userAgentData?.platform) {
      deviceName = navigator.userAgentData.platform;
    } else {
      const ua = navigator.userAgent;
      if (ua.includes('Windows')) deviceName = 'Windows';
      else if (ua.includes('Mac')) deviceName = 'Mac';
      else if (ua.includes('Linux')) deviceName = 'Linux';
      else if (ua.includes('Android')) deviceName = 'Android';
      else if (ua.includes('iOS')) deviceName = 'iOS';
    }
  } catch {
    deviceName = 'Unknown Device';
  }

  return {
    deviceFingerprint: fingerprint,
    deviceName,
    ipAddress: ipInfo.ip,
    location: ipInfo.location,
  };
}

export type { IDeviceInfo };
