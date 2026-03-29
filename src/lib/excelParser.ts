import Papa from "papaparse";

export const parseExcelPrice = (priceStr: string | number): number => {
  const num = parseFloat(priceStr.toString().replace(/,/g, "."));
  return num < 1000 ? num * 1000000 : num;
};


export const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    // Treat as CSV/TSV if extension is .csv or .tsv
    if (file.name.endsWith(".csv") || file.name.endsWith(".tsv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Detect if it uses Tabs (common in copy-pasted excel data)
        const firstLine = text.split("\n")[0];
        const isTSV = firstLine.includes("\t");

        Papa.parse(text, {
          header: true,
          delimiter: isTSV ? "\t" : "", // Force Tab if detected
          skipEmptyLines: "greedy",
          transformHeader: (h) => h.trim(),
          complete: (results) => {
            console.log("[ExcelParser] Raw Parsed Data Row 0:", results.data[0]);
            resolve(results.data);
          },
          error: (err: any) => {
            reject(err);
          }
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
      return;
    }

    // fallback to XLSX for Excel files
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const mod = await import("xlsx");
        // Turbopack might wrap the module differently
        const XLSX = (mod as any).read ? mod : (mod as any).default;
        
        if (!XLSX || !XLSX.read) {
          throw new Error("Không thể tải thư viện xử lý file (xlsx)");
        }

        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { 
          type: "array",
          cellDates: true,
        });
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const json = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          raw: false
        });
        console.log("[ExcelParser] Raw XLSX Data Row 0:", json[0]);
        resolve(json);
      } catch (err) {
        console.error("XSLX process error:", err);
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

// Helper to find key in row object regardless of casing/spacing
const findValue = (row: any, ...keys: string[]) => {
  const rowKeys = Object.keys(row);
  for (const requestedKey of keys) {
    const normalizedRequested = requestedKey.toLowerCase().replace(/\s/g, "");
    const matchingKey = rowKeys.find(rk => 
      rk.toLowerCase().replace(/\s/g, "").includes(normalizedRequested)
    );
    if (matchingKey && row[matchingKey] !== undefined) return row[matchingKey];
  }
  return undefined;
};

// Map Excel columns to Post Schema
export const mapExcelToPosts = (data: any[]): any[] => {
  const posts = data.map((rawRow: any) => {
    // Normalize keys (trim and handle BOM)
    const row: any = {};
    Object.keys(rawRow).forEach(key => {
      const cleanKey = key.trim().replace(/^\ufeff/, "");
      row[cleanKey] = rawRow[key];
    });

    const rawTitle = findValue(row, "Tên") || "";
    const address = findValue(row, "Địa chỉ") || "Địa chỉ chưa rõ";
    const coordsStr = findValue(row, "Tọa độ", "Vị trí", "Coordinates", "Vị trí trên bản đồ") || "";
    const description = (findValue(row, "Thông tin mô tả") || "").toString().replace(/(\/n|\\n)/g, "\n");
    const imagesStr = findValue(row, "Ảnh minh họa") || "";
    const amenitiesStr = findValue(row, "Tiện ích") || "";
    const priceStr = findValue(row, "Giá") || "0";
    const areaSizeStr = findValue(row, "Diện tích") || "0";
    const phoneStr = findValue(row, "SĐT") || "";
    const bedroomsStr = findValue(row, "Phòng ngủ", "PN") || "1";

    // Phân tách địa chỉ để lấy Khu vực (2 phần cuối)
    const addrParts = address.split(",").map((p: string) => p.trim());
    const displayAddr = addrParts[0] || "";
    const areaParts = addrParts.slice(1).filter((p: string) => !(/^\d+$/.test(p)) && p.toLowerCase() !== "việt nam" && p.toLowerCase() !== "vietnam");
    
    let district = "";
    if (areaParts.length >= 2) {
      district = areaParts.slice(-2).join(" - ");
    } else if (areaParts.length === 1) {
      district = areaParts[0];
    }

    // Tự động gán tiêu đề nếu tiêu đề từ Excel trống: [Địa chỉ] - [Khu vực]
    const finalTitle = rawTitle || (district ? `${displayAddr} - ${district}` : displayAddr);

    // Xử lý tọa độ
    let lat = 10.762622;
    let lng = 106.660172;
    if (coordsStr && coordsStr.includes(",")) {
      const [rawLat, rawLng] = coordsStr.split(",").map((s: string) => s.trim());
      lat = parseFloat(rawLat) || lat;
      lng = parseFloat(rawLng) || lng;
    }

    return {
      title: finalTitle,
      address: address,
      displayAddress: displayAddr,
      phone: phoneStr.toString().replace(/[^0-9]/g, ""),
      price: parseFloat(priceStr.toString()) * (priceStr.toString().includes("triệu") || priceStr.toString().length < 4 ? 1000000 : 1),
      areaSize: parseFloat(areaSizeStr.toString()) || 0,
      bedrooms: parseInt(bedroomsStr.toString()) || 1,
      amenities: amenitiesStr.toString().split("|").map((s: string) => s.trim()).filter(Boolean),
      images: imagesStr.toString().split("|").map((s: string) => s.trim()).filter((s: string) => s.startsWith("http")),
      areaInfo: description,
      note: description,
      location: { lat, lng },
      category: "Thuê trọ",
      status: "approved",
      postedByAdmin: true
    };
  });

  console.log("[ExcelParser] Total Mapped Posts:", posts.length);
  return posts;
};
