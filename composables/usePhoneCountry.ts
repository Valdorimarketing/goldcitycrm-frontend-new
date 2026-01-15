// composables/usePhoneCountry.ts
// Telefon numarasından ülke kodu ve bayrak tespiti için composable

export const usePhoneCountry = () => {
  /**
   * Ülke bayrakları mapping
   */
  const countryFlags: Record<string, string> = {
    '90': '🇹🇷',   // Turkey
    '1': '🇺🇸',     // USA/Canada
    '44': '🇬🇧',   // UK
    '49': '🇩🇪',   // Germany
    '33': '🇫🇷',   // France
    '39': '🇮🇹',   // Italy
    '34': '🇪🇸',   // Spain
    '86': '🇨🇳',   // China
    '91': '🇮🇳',   // India
    '81': '🇯🇵',   // Japan
    '82': '🇰🇷',   // South Korea
    '7': '🇷🇺',     // Russia
    '966': '🇸🇦',  // Saudi Arabia
    '971': '🇦🇪',  // UAE
    '974': '🇶🇦',  // Qatar
    '965': '🇰🇼',  // Kuwait
    '962': '🇯🇴',  // Jordan
    '963': '🇸🇾',  // Syria
    '961': '🇱🇧',  // Lebanon
    '964': '🇮🇶',  // Iraq
    '20': '🇪🇬',   // Egypt
    '212': '🇲🇦',  // Morocco
    '213': '🇩🇿',  // Algeria
    '216': '🇹🇳',  // Tunisia
    '218': '🇱🇾',  // Libya
    '967': '🇾🇪',  // Yemen
    '968': '🇴🇲',  // Oman
    '973': '🇧🇭',  // Bahrain
    '98': '🇮🇷',   // Iran
    '92': '🇵🇰',   // Pakistan
    '93': '🇦🇫',   // Afghanistan
    '95': '🇲🇲',   // Myanmar
    '60': '🇲🇾',   // Malaysia
    '62': '🇮🇩',   // Indonesia
    '63': '🇵🇭',   // Philippines
    '64': '🇳🇿',   // New Zealand
    '65': '🇸🇬',   // Singapore
    '66': '🇹🇭',   // Thailand
    '84': '🇻🇳',   // Vietnam
    '30': '🇬🇷',   // Greece
    '31': '🇳🇱',   // Netherlands
    '32': '🇧🇪',   // Belgium
    '41': '🇨🇭',   // Switzerland
    '43': '🇦🇹',   // Austria
    '45': '🇩🇰',   // Denmark
    '46': '🇸🇪',   // Sweden
    '47': '🇳🇴',   // Norway
    '48': '🇵🇱',   // Poland
    '51': '🇵🇪',   // Peru
    '52': '🇲🇽',   // Mexico
    '53': '🇨🇺',   // Cuba
    '54': '🇦🇷',   // Argentina
    '55': '🇧🇷',   // Brazil
    '56': '🇨🇱',   // Chile
    '57': '🇨🇴',   // Colombia
    '58': '🇻🇪',   // Venezuela
    '27': '🇿🇦',   // South Africa
  }

  /**
   * Ülke isimleri mapping (Türkçe)
   */
  const countryNames: Record<string, string> = {
    '90': 'Türkiye',
    '1': 'ABD/Kanada',
    '44': 'İngiltere',
    '49': 'Almanya',
    '33': 'Fransa',
    '39': 'İtalya',
    '34': 'İspanya',
    '86': 'Çin',
    '91': 'Hindistan',
    '81': 'Japonya',
    '82': 'Güney Kore',
    '7': 'Rusya',
    '966': 'Suudi Arabistan',
    '971': 'BAE',
    '974': 'Katar',
    '965': 'Kuveyt',
    '962': 'Ürdün',
    '963': 'Suriye',
    '961': 'Lübnan',
    '964': 'Irak',
    '20': 'Mısır',
    '212': 'Fas',
    '213': 'Cezayir',
    '216': 'Tunus',
    '218': 'Libya',
    '967': 'Yemen',
    '968': 'Umman',
    '973': 'Bahreyn',
    '98': 'İran',
    '92': 'Pakistan',
    '93': 'Afganistan',
    '95': 'Myanmar',
    '60': 'Malezya',
    '62': 'Endonezya',
    '63': 'Filipinler',
    '64': 'Yeni Zelanda',
    '65': 'Singapur',
    '66': 'Tayland',
    '84': 'Vietnam',
    '30': 'Yunanistan',
    '31': 'Hollanda',
    '32': 'Belçika',
    '41': 'İsviçre',
    '43': 'Avusturya',
    '45': 'Danimarka',
    '46': 'İsveç',
    '47': 'Norveç',
    '48': 'Polonya',
    '51': 'Peru',
    '52': 'Meksika',
    '53': 'Küba',
    '54': 'Arjantin',
    '55': 'Brezilya',
    '56': 'Şili',
    '57': 'Kolombiya',
    '58': 'Venezuela',
    '27': 'Güney Afrika',
  }

  /**
   * Telefon numarasını normalize eder
   * @param phone - Ham telefon numarası
   * @returns Normalize edilmiş numara (+ ile başlayan)
   */
  const normalizePhone = (phone: string): string => {
    if (!phone) return ''
    
    // Boşluk, tire, parantez gibi karakterleri temizle
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '')
    
    // 00 ile başlıyorsa + ile değiştir
    let normalized = cleaned
    if (cleaned.startsWith('00')) {
      normalized = '+' + cleaned.substring(2)
    }
    
    // + ile başlamıyorsa başına ekle
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized
    }
    
    return normalized
  }

  /**
   * Telefon numarasından ülke kodunu çıkarır
   * @param phone - Telefon numarası
   * @returns Ülke kodu (örn: '90', '971', '1') veya null
   */
  const getCountryCode = (phone: string): string | null => {
    if (!phone) return null
    
    const normalized = normalizePhone(phone)
    
    // 4 haneli kodlar (öncelikli)
    if (normalized.startsWith('+9715')) return '971'
    if (normalized.startsWith('+9665')) return '966'
    if (normalized.startsWith('+9745')) return '974'
    
    // 3 haneli kodlar
    const threeDigitCodes = [
      '971', '966', '974', '965', '962', '963', '961', '964',
      '212', '213', '216', '218', '967', '968', '973'
    ]
    
    for (const code of threeDigitCodes) {
      if (normalized.startsWith(`+${code}`)) return code
    }
    
    // 2 haneli kodlar
    const twoDigitCodes = [
      '90', '44', '49', '33', '39', '34', '86', '91', '81', '82',
      '20', '98', '92', '93', '95', '60', '62', '63', '64', '65',
      '66', '84', '30', '31', '32', '41', '43', '45', '46', '47',
      '48', '51', '52', '53', '54', '55', '56', '57', '58', '27'
    ]
    
    for (const code of twoDigitCodes) {
      if (normalized.startsWith(`+${code}`)) return code
    }
    
    // 1 haneli kodlar
    if (normalized.startsWith('+1')) return '1'
    if (normalized.startsWith('+7')) return '7'
    
    return null
  }

  /**
   * Telefon numarasına göre bayrak emoji döndürür
   * @param phone - Telefon numarası
   * @returns Bayrak emoji (bilinmeyenler için 🌍)
   */
  const getCountryFlag = (phone: string): string => {
    const code = getCountryCode(phone)
    return code ? (countryFlags[code] || '🌍') : '🌍'
  }

  /**
   * Telefon numarasına göre ülke ismini döndürür
   * @param phone - Telefon numarası
   * @returns Ülke ismi (bilinmeyenler için 'Bilinmeyen')
   */
  const getCountryName = (phone: string): string => {
    const code = getCountryCode(phone)
    return code ? (countryNames[code] || 'Bilinmeyen') : 'Bilinmeyen'
  }

  /**
   * Telefon numarasının tam bilgisini döndürür
   * @param phone - Telefon numarası
   * @returns { code, flag, name }
   */
  const getPhoneCountryInfo = (phone: string) => {
    const code = getCountryCode(phone)
    return {
      code,
      flag: getCountryFlag(phone),
      name: getCountryName(phone),
      normalized: normalizePhone(phone)
    }
  }

  /**
   * Birden fazla telefon numarası için toplu işlem
   * @param phones - Telefon numaraları dizisi
   * @returns Ülke bilgileri dizisi
   */
  const getMultiplePhoneCountries = (phones: string[]) => {
    return phones.map(phone => getPhoneCountryInfo(phone))
  }

  return {
    // Ana fonksiyonlar
    getCountryCode,
    getCountryFlag,
    getCountryName,
    getPhoneCountryInfo,
    
    // Yardımcı fonksiyonlar
    normalizePhone,
    getMultiplePhoneCountries,
    
    // Data
    countryFlags,
    countryNames,
  }
}