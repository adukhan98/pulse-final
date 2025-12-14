/**
 * Simple obfuscation utility to prevent casual reading of local storage data.
 * NOT TRUE ENCRYPTION - Do not use for highly sensitive PII like passwords or health records
 * if strict HIPAA/GDPR compliance is required against determined attackers.
 * 
 * Purpose: Privacy from casual snooping (e.g. shared family computer).
 */

const PREFIX = 'enc_v1_';

export const encryptData = (data: any): string => {
    try {
        const jsonString = JSON.stringify(data);
        // Base64 encode
        const base64 = btoa(jsonString); // Standard browser API
        // Reverse string for extra obfuscation
        const reversed = base64.split('').reverse().join('');
        return PREFIX + reversed;
    } catch (e) {
        console.error("Encryption failed", e);
        return "";
    }
};

export const decryptData = (encryptedData: string): any => {
    try {
        if (!encryptedData) return null;

        // If data isn't encrypted (legacy support), try parsing directly
        if (!encryptedData.startsWith(PREFIX)) {
            try {
                return JSON.parse(encryptedData);
            } catch {
                return null;
            }
        }

        const stripped = encryptedData.replace(PREFIX, '');
        const unReversed = stripped.split('').reverse().join('');
        const jsonString = atob(unReversed);
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Decryption failed", e);
        return null;
    }
};
