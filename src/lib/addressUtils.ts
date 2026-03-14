export function cleanAddress(address: string): string {
  if (!address) return "";
  
  const parts = address.split(",").map(p => p.trim());
  if (parts.length <= 1) return address;

  const mainAddress = parts[0];
  
  // Lọc bỏ mã bưu chính (chỉ chứa số) và "Việt Nam"
  const filteredAreaParts = parts.slice(1).filter(part => {
    const isPostcode = /^\d+$/.test(part);
    const isCountry = part.toLowerCase() === "việt nam" || part.toLowerCase() === "vietnam";
    return !isPostcode && !isCountry;
  });

  if (filteredAreaParts.length === 0) return mainAddress;
  
  return mainAddress + ", " + filteredAreaParts.join(", ");
}
