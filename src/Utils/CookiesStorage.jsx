import CryptoJS from "crypto-js";

const SECRET_KEY = "A@3#33626362%@^%!%sfags@%^!zetuqqy%FSAHA^&!&!@&"; // Keep this key secure

class CookieStorage {
  static encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  }

  static decryptData(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Error decrypting data:", error);
      return null;
    }
  }

  static getItem(key) {
    return new Promise((resolve) => {
      const cookieValue = document.cookie
        .split("; ")
        .find(row => row.startsWith(key))
        ?.split("=")[1];

      resolve(cookieValue ? this.decryptData(decodeURIComponent(cookieValue)) : null);
    });
  }

  static setItem(key, value) {
    return new Promise((resolve) => {
      const encryptedValue = this.encryptData(value);
      const expires = new Date(Date.now() + 3600000).toUTCString(); // 1 hour expiration
      document.cookie = `${key}=${encodeURIComponent(encryptedValue)}; path=/; expires=${expires}; Secure`;
      resolve();
    });
  }

  static removeItem(key) {
    return new Promise((resolve) => {
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      resolve();
    });
  }
}

export default CookieStorage;
