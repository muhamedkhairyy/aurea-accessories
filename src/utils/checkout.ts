// Checkout rules shown to the shopper. The dashboard (aurea-dashboard/src/checkout-rules.js) is the source of truth:
// it recomputes shipping, checks the transfer and the screenshot, and rejects an order that doesn't match.
import { DASHBOARD_API_URL } from "@/utils/catalog";

type Lang = "en" | "ar";

export interface Governorate {
  key: string;
  name: { en: string; ar: string };
  fee: number;
}

export interface CheckoutConfig {
  governorates: Governorate[];
  minTransfer: number;
}

export const MIN_TRANSFER_EGP = 100;

const CAIRO_GIZA_FEE = 85;
const OTHER_FEE = 95;

// Same list and fees as the dashboard; replaced by the live config when it loads
const g = (key: string, en: string, ar: string, fee = OTHER_FEE): Governorate => ({ key, name: { en, ar }, fee });
export const DEFAULT_GOVERNORATES: Governorate[] = [
  g("cairo", "Cairo", "القاهرة", CAIRO_GIZA_FEE),
  g("giza", "Giza", "الجيزة", CAIRO_GIZA_FEE),
  g("alexandria", "Alexandria", "الإسكندرية"),
  g("qalyubia", "Qalyubia", "القليوبية"),
  g("sharqia", "Sharqia", "الشرقية"),
  g("dakahlia", "Dakahlia", "الدقهلية"),
  g("gharbia", "Gharbia", "الغربية"),
  g("monufia", "Monufia", "المنوفية"),
  g("beheira", "Beheira", "البحيرة"),
  g("kafr-el-sheikh", "Kafr El Sheikh", "كفر الشيخ"),
  g("damietta", "Damietta", "دمياط"),
  g("port-said", "Port Said", "بورسعيد"),
  g("ismailia", "Ismailia", "الإسماعيلية"),
  g("suez", "Suez", "السويس"),
  g("faiyum", "Faiyum", "الفيوم"),
  g("beni-suef", "Beni Suef", "بني سويف"),
  g("minya", "Minya", "المنيا"),
  g("asyut", "Asyut", "أسيوط"),
  g("sohag", "Sohag", "سوهاج"),
  g("qena", "Qena", "قنا"),
  g("luxor", "Luxor", "الأقصر"),
  g("aswan", "Aswan", "أسوان"),
  g("red-sea", "Red Sea", "البحر الأحمر"),
  g("new-valley", "New Valley", "الوادي الجديد"),
  g("matrouh", "Matrouh", "مطروح"),
  g("north-sinai", "North Sinai", "شمال سيناء"),
  g("south-sinai", "South Sinai", "جنوب سيناء"),
];

export const DEFAULT_CHECKOUT_CONFIG: CheckoutConfig = { governorates: DEFAULT_GOVERNORATES, minTransfer: MIN_TRANSFER_EGP };

export async function fetchCheckoutConfig(): Promise<CheckoutConfig> {
  const res = await fetch(`${DASHBOARD_API_URL}/api/checkout/config`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Checkout config request failed (${res.status})`);
  const data: CheckoutConfig = await res.json();
  if (!Array.isArray(data.governorates) || data.governorates.length === 0) throw new Error("Checkout config has no governorates");
  return data;
}

// null until a governorate is picked
export function shippingFeeFor(config: CheckoutConfig, governorateKey: string): number | null {
  return config.governorates.find((x) => x.key === governorateKey)?.fee ?? null;
}

// Where customers send the transfer. Set these in the storefront's environment before going live.
export const PAYMENT_ACCOUNTS: { label: { en: string; ar: string }; value: string }[] = [
  { label: { en: "InstaPay", ar: "إنستاباي" }, value: process.env.NEXT_PUBLIC_INSTAPAY_ADDRESS ?? "" },
  { label: { en: "Bank account", ar: "الحساب البنكي" }, value: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "" },
].filter((a) => a.value);

// ---------- payment screenshot ----------

// The dashboard accepts up to 3 MB; larger photos are shrunk in the browser first
export const MAX_PROOF_MB = 3;
const MAX_PROOF_BYTES = MAX_PROOF_MB * 1024 * 1024;
// Anything bigger isn't worth trying to shrink
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
export const PROOF_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const PROOF_ACCEPT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
const PROOF_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

export function proofFileError(file: File, lang: Lang): string | null {
  const typeOk = (PROOF_TYPES as readonly string[]).includes(file.type) || (!file.type && PROOF_EXTENSIONS.test(file.name));
  if (!typeOk) return lang === "ar" ? "استخدمي صورة بصيغة JPG أو JPEG أو PNG أو WEBP" : "Use a JPG, JPEG, PNG or WEBP image";
  if (file.size > MAX_SOURCE_BYTES) return lang === "ar" ? "حجم الصورة كبير جداً (الحد الأقصى 15 ميجابايت)" : "This image is too large (max 15 MB)";
  return null;
}

const readAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

// Re-encodes a large image as JPEG, at most 2000px on its longest side
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process image"))), "image/jpeg", 0.85),
  );
}

export interface PaymentProof {
  dataUrl: string; // what's sent to the dashboard
  name: string;
  size: number; // bytes actually sent
}

// Validates a picked file and turns it into the data URL the order carries; throws a shopper-facing message
export async function preparePaymentProof(file: File, lang: Lang): Promise<PaymentProof> {
  const error = proofFileError(file, lang);
  if (error) throw new Error(error);
  const blob = file.size > MAX_PROOF_BYTES ? await shrink(file) : file;
  if (blob.size > MAX_PROOF_BYTES) {
    throw new Error(lang === "ar" ? `يجب ألا يزيد حجم الصورة عن ${MAX_PROOF_MB} ميجابايت` : `Image must be ${MAX_PROOF_MB} MB or smaller`);
  }
  let dataUrl = await readAsDataUrl(blob);
  // Some browsers label files without a type; the dashboard needs a real image type in the data URL
  if (dataUrl.startsWith("data:application/octet-stream")) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    dataUrl = dataUrl.replace("data:application/octet-stream", `data:${mime}`);
  }
  return { dataUrl, name: file.name, size: blob.size };
}

// ---------- form validation ----------

export interface CheckoutForm {
  name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  transferAmount: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm | "paymentProof", string>>;

// Egyptian mobile (01x…) with optional +20 / 0020 prefix; spaces and dashes are ignored
const EG_MOBILE = /^(\+?20|0020)?0?1[0125]\d{8}$/;

// Same rules the dashboard applies; the dashboard re-checks everything
export function validateCheckout(
  form: CheckoutForm,
  { total, proof, config, lang }: { total: number; proof: PaymentProof | null; config: CheckoutConfig; lang: Lang },
): CheckoutErrors {
  const ar = lang === "ar";
  const errors: CheckoutErrors = {};
  if (form.name.trim().length < 2) errors.name = ar ? "اكتبي اسمك بالكامل" : "Enter your full name";
  if (!EG_MOBILE.test(form.phone.replace(/[\s-]/g, ""))) errors.phone = ar ? "اكتبي رقم موبايل مصري صحيح" : "Enter a valid Egyptian mobile number";
  if (shippingFeeFor(config, form.governorate) === null) errors.governorate = ar ? "اختاري المحافظة" : "Select your governorate";
  if (!form.city.trim()) errors.city = ar ? "اكتبي المدينة أو المنطقة" : "Enter your city or area";
  if (form.address.trim().length < 5) errors.address = ar ? "اكتبي العنوان بالتفصيل" : "Enter your full address";

  const amount = Number(form.transferAmount);
  if (!form.transferAmount.trim() || !Number.isFinite(amount)) errors.transferAmount = ar ? "اكتبي المبلغ الذي حوّلتِه" : "Enter the amount you transferred";
  else if (amount < config.minTransfer) errors.transferAmount = ar ? `الحد الأدنى للتحويل ${config.minTransfer} ج.م` : `The transfer must be at least EGP ${config.minTransfer}`;
  else if (amount > total) errors.transferAmount = ar ? "المبلغ أكبر من إجمالي الطلب" : "The transfer can't be more than the order total";

  if (!proof) errors.paymentProof = ar ? "ارفعي صورة إيصال التحويل" : "Upload a screenshot of your transfer";
  return errors;
}

// ---------- server messages ----------

// The dashboard answers in English; these are the messages a shopper can see at checkout.
// Unknown messages fall back to a generic Arabic error rather than showing English.
const SERVER_MESSAGES_AR: [RegExp, (...m: string[]) => string][] = [
  [/^Customer name, phone, address and city are required$/, () => "الاسم ورقم الموبايل والعنوان والمدينة مطلوبة"],
  [/^Enter a valid Egyptian mobile number$/, () => "اكتبي رقم موبايل مصري صحيح"],
  [/^Select your governorate$/, () => "اختاري المحافظة"],
  [/^Order must contain at least one item$/, () => "سلتك فارغة"],
  [/^Upload a screenshot of your payment$/, () => "ارفعي صورة إيصال التحويل"],
  [/^Payment screenshot must be a JPG, PNG or WebP image$/, () => "يجب أن تكون صورة الإيصال بصيغة JPG أو PNG أو WEBP"],
  [/^File content doesn't match its image type$/, () => "الملف المرفوع ليس صورة صالحة"],
  [/^Image must be (\d+) MB or smaller$/, (_, mb) => `يجب ألا يزيد حجم الصورة عن ${mb} ميجابايت`],
  [/^Request is too large$/, () => "صورة الإيصال كبيرة جداً. جرّبي صورة أصغر."],
  [/^Unknown product: /, () => "أحد المنتجات في سلتك لم يعد متاحاً"],
  [/^(.+) is no longer available$/, (_, name) => `${name} لم يعد متاحاً`],
  [/^Quantity must be a positive integer$/, () => "الكمية غير صحيحة"],
  [/^Only (\d+) left of (.+)$/, (_, n, name) => `متبقي ${n} فقط من ${name}`],
  [/^Choose a color for (.+)$/, (_, name) => `اختاري لوناً لـ ${name}`],
  [/^Shipping to (.+) is EGP ([\d.]+)\./, (_, place, fee) => `تكلفة الشحن إلى ${arGovernorate(place)} هي ${fee} ج.م. راجعي طلبك وحاولي مرة أخرى.`],
  [/^Enter the amount you transferred$/, () => "اكتبي المبلغ الذي حوّلتِه"],
  [/^The transfer must be at least EGP ([\d.]+)$/, (_, min) => `الحد الأدنى للتحويل ${min} ج.م`],
  [/^The transfer amount can't be more than the order total$/, () => "المبلغ المحوَّل أكبر من إجمالي الطلب"],
];

const arGovernorate = (en: string) => DEFAULT_GOVERNORATES.find((g) => g.name.en === en)?.name.ar ?? en;

export function localizeServerError(message: string, lang: Lang): string {
  if (lang !== "ar") return message;
  for (const [re, toAr] of SERVER_MESSAGES_AR) {
    const m = message.match(re);
    if (m) return toAr(...m);
  }
  return "تعذّر تسجيل طلبك. حاولي مرة أخرى.";
}
