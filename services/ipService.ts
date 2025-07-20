
import type { IpInfo } from '../types.ts';

// Helper function to convert an IP string to a 32-bit integer
const ipToInt = (ip: string): number => {
  return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
};

// Helper function to convert a 32-bit integer back to an IP string
const intToIp = (int: number): string => {
  return `${(int >>> 24)}.${(int >> 16) & 255}.${(int >> 8) & 255}.${int & 255}`;
};

// Generates a random IP from a given CIDR block
const generateRandomIpFromCidr = (cidr: string): string => {
  const [range, maskStr] = cidr.split('/');
  const mask = parseInt(maskStr, 10);
  
  const networkAddrInt = ipToInt(range);
  const hostBits = 32 - mask;
  
  // Avoid using network and broadcast addresses
  const numHosts = Math.pow(2, hostBits);
  if (numHosts <= 2) {
    return range; // For /31 or /32, not enough hosts to randomize
  }
  
  const startIp = networkAddrInt + 1;
  const endIp = networkAddrInt + numHosts - 2;
  
  const randomHostOffset = Math.floor(Math.random() * (endIp - startIp + 1));
  
  return intToIp(startIp + randomHostOffset);
};

// Fetches geolocation info for a single IP address with robust error handling
const fetchIpInfo = async (ip: string): Promise<IpInfo> => {
    try {
        const response = await fetch(`https://api.iplocation.net/?ip=${ip}`);
        if (!response.ok) {
            console.error(`API returned HTTP error for ${ip}: ${response.status}`);
            return {
                ip,
                countryName: 'Service Unavailable',
                countryNameKey: 'status.serviceUnavailable',
                isp: 'Failed to connect to API',
                ispKey: 'status.apiConnectFail',
                countryCode: 'ER',
            };
        }

        const textData = await response.text();

        // Attempt to parse as JSON first
        try {
            const jsonData = JSON.parse(textData);
            if (jsonData && jsonData.response_code === '200' && jsonData.ip) {
                const countryName = jsonData.country_name || '';
                const countryCode = jsonData.country_code2 || 'XX';
                const isp = jsonData.isp || '';
                
                const isCountryMissing = !countryName || countryName.trim() === '' || countryName === '-' || !countryCode || countryCode === 'XX' || countryCode === '-';
                const isIspMissing = !isp || isp.trim() === '-' || isp.trim() === '';

                return {
                    ip,
                    countryName: isCountryMissing ? 'Data Not Available' : countryName,
                    ...(isCountryMissing && { countryNameKey: 'status.dataNotAvailable' }),
                    isp: isIspMissing ? 'Data Not Available' : isp,
                    ...(isIspMissing && { ispKey: 'status.dataNotAvailable' }),
                    countryCode: isCountryMissing ? 'XX' : countryCode,
                };
            }
        } catch (e) {
            // Not a valid JSON response, fall through to attempt semicolon parsing.
        }

        // Fallback to parsing as semicolon-delimited string
        const parts = textData.split(';');
        if (parts.length >= 4) {
            const [_responseIp, countryCode, countryName, ...ispParts] = parts;
            const isp = ispParts.join(';'); // Rejoin to handle ISPs with semicolons
            
            const isCountryMissing = !countryName || countryName.trim() === '' || countryName === '-' || !countryCode || countryCode === 'XX' || countryCode === '-';
            const isIspMissing = !isp || isp.trim() === '-' || isp.trim() === '';
    
            return {
                ip,
                countryName: isCountryMissing ? 'Data Not Available' : countryName,
                ...(isCountryMissing && { countryNameKey: 'status.dataNotAvailable' }),
                isp: isIspMissing ? 'Data Not Available' : isp,
                ...(isIspMissing && { ispKey: 'status.dataNotAvailable' }),
                countryCode: isCountryMissing ? 'XX' : countryCode,
            };
        }
        
        // If neither format works, the response is malformed.
        console.warn(`Malformed or unhandled response format for ${ip}: "${textData}"`);
        return {
            ip,
            countryName: 'Data Not Available',
            countryNameKey: 'status.dataNotAvailable',
            isp: 'Invalid API Response',
            ispKey: 'status.malformedResponse',
            countryCode: '??',
        };

    } catch (error) {
        console.error(`Network error or fetch failed for IP ${ip}:`, error);
        return {
            ip,
            countryName: 'Network Error',
            countryNameKey: 'status.networkError',
            isp: 'Could not reach API service',
            ispKey: 'status.apiServiceFail',
            countryCode: 'ER',
        };
    }
};

// Fetches the CIDR ranges from the JSON file
const getCidrRanges = async (): Promise<string[]> => {
    const response = await fetch('./data/cidrs.json');
    if (!response.ok) {
        throw new Error('Failed to load CIDR ranges data file.');
    }
    const data: { ranges: string[] } = await response.json();
    return data.ranges;
}

// Generates a specified number of unique random IPs and fetches their info
export const generateAndFetchIpInfos = async (count: number): Promise<IpInfo[]> => {
  const ranges = await getCidrRanges();
  const generatedIps = new Set<string>();

  if (!ranges || ranges.length === 0) {
      throw new Error("No CIDR ranges found. Cannot generate IPs.");
  }

  while (generatedIps.size < count) {
    const randomCidr = ranges[Math.floor(Math.random() * ranges.length)];
    const newIp = generateRandomIpFromCidr(randomCidr);
    generatedIps.add(newIp);
  }

  const ipPromises = Array.from(generatedIps).map(ip => fetchIpInfo(ip));

  try {
    const results = await Promise.all(ipPromises);
    return results;
  } catch (error) {
    console.error("Error fetching IP information:", error);
    throw new Error("Could not retrieve geolocation data.");
  }
};
