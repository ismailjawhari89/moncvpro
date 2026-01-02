# 🔧 دليل إصلاح المشاكل - MonCVPro

## 📋 فهرس المشاكل الشائعة

### 1. مشاكل تصدير السيرة الذاتية (PDF Export)
### 2. أخطاء التصميم (UI/UX Issues)
### 3. مشاكل قاعدة البيانات
### 4. مشاكل الأداء
### 5. مشاكل الترجمة (i18n)

---

## 🔴 المشكلة 1: فشل تصدير PDF

### الأعراض
- زر التصدير لا يعمل
- رسالة خطأ "Element not found"
- PDF فارغ أو مشوه
- PDF لا يحتوي على الخطوط العربية

### الأسباب المحتملة

#### 1.1 عنصر المعاينة غير موجود
```tsx
// ❌ خطأ - ID خاطئ
<div id="wrong-id">CV Content</div>
await generatePDF('cv-preview'); // لا يجد العنصر

// ✅ صحيح
<div id="cv-preview">CV Content</div>
await generatePDF('cv-preview');
```

**الحل:**
```tsx
// تأكد من ID العنصر صحيح
const previewElement = document.getElementById('cv-preview');
if (!previewElement) {
  console.error('Preview element not found!');
  throw new Error('لم يتم العثور على عنصر المعاينة');
}
```

#### 1.2 مشكلة في حجم الصفحة
```tsx
// ❌ خطأ - محتوى أطول من الصفحة ولا يتم التقسيم
const pdf = new jsPDF();
pdf.addImage(imgData, 'JPEG', 0, 0, 210, 500); // أطول من A4

// ✅ صحيح - تقسيم متعدد الصفحات
if (contentHeight > pageHeight) {
  let position = 0;
  while (position < contentHeight) {
    if (position > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', margin, -position, width, contentHeight);
    position += pageHeight;
  }
}
```

#### 1.3 الخطوط العربية لا تظهر

**المشكلة:** jsPDF لا يدعم العربية افتراضياً

**الحل 1 - استخدام @react-pdf/renderer:**
```tsx
import { pdf, Document, Page, Text, Font, StyleSheet } from '@react-pdf/renderer';

// تسجيل الخطوط العربية
Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf' },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  arabicText: {
    fontFamily: 'Cairo',
    textAlign: 'right',
    direction: 'rtl'
  }
});

// استخدام في المستند
<Text style={styles.arabicText}>النص العربي هنا</Text>
```

**الحل 2 - استخدام Cloudflare Worker (Puppeteer):**
```tsx
// هذا الحل أفضل للعربية
export async function generateTextPDF(html: string, css: string): Promise<Blob> {
  const response = await fetch('/api/pdf/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, css })
  });
  
  if (!response.ok) {
    throw new Error('فشل توليد PDF');
  }
  
  return await response.blob();
}
```

#### 1.4 صور لا تظهر في PDF

**المشكلة:** CORS أو صور لم يتم تحميلها

**الحل:**
```tsx
// تأكد من useCORS: true
const canvas = await html2canvas(element, {
  scale: 2,
  useCORS: true,  // ✅ مهم للصور من نطاقات أخرى
  allowTaint: false,
  logging: false,
  backgroundColor: '#ffffff'
});

// أو استخدم data URLs للصور
<img src="data:image/png;base64,..." />
```

---

## 🔴 المشكلة 2: أخطاء التصميم (UI Issues)

### 2.1 النص العربي يظهر من اليسار

**المشكلة:**
```tsx
// ❌ خطأ - لا يوجد dir="rtl"
<div className="text-right">
  النص العربي
</div>
```

**الحل:**
```tsx
// ✅ صحيح
<div dir="rtl" className="text-right">
  النص العربي
</div>

// أو استخدم RTL Provider
import { useLocale } from 'next-intl';

function Component() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
      {/* المحتوى */}
    </div>
  );
}
```

### 2.2 الأيقونات في الجهة الخاطئة

**الحل:**
```tsx
// استخدم rtl: prefix من Tailwind
<div className="flex items-center gap-2 rtl:flex-row-reverse">
  <Icon />
  <span>نص</span>
</div>
```

### 2.3 النماذج (Forms) غير محاذاة

**الحل:**
```tsx
<input
  type="text"
  dir={isRTL ? 'rtl' : 'ltr'}
  className={cn(
    "w-full px-4 py-2",
    isRTL ? "text-right" : "text-left"
  )}
  placeholder={isRTL ? "النص هنا" : "Text here"}
/>
```

### 2.4 القوائم المنسدلة (Dropdowns) في المكان الخطأ

**الحل:**
```tsx
// استخدم placement conditional
<Dropdown
  placement={isRTL ? 'bottom-start' : 'bottom-end'}
  className="rtl:left-0 ltr:right-0"
>
  {/* المحتوى */}
</Dropdown>
```

### 2.5 الخطوط العربية غير واضحة

**الحل:**
```tsx
// في tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'], // ✅ أضف خطوط عربية
      }
    }
  }
}

// في layout.tsx
import { Cairo } from 'next/font/google';

const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo'
});

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={locale === 'ar' ? cairo.className : inter.className}>
        {children}
      </body>
    </html>
  );
}
```

---

## 🔴 المشكلة 3: قاعدة البيانات

### 3.1 Prisma Client لا يعمل

**الأعراض:**
```
Error: Cannot find module '@prisma/client'
```

**الحل:**
```bash
# في مجلد backend/
npm install
npm run prisma:generate
```

### 3.2 Migration فشلت

**الأعراض:**
```
Error: P3005 - The database schema is not in sync
```

**الحل:**
```bash
# Development - إعادة تعيين قاعدة البيانات (⚠️ يحذف البيانات!)
npm run prisma:migrate reset

# أو تطبيق migrations فقط
npm run prisma:migrate

# Production
npm run prisma:deploy
```

### 3.3 Templates لا تظهر

**السبب:** لم يتم seed قاعدة البيانات

**الحل:**
```bash
npm run prisma:seed
```

### 3.4 خطأ DATABASE_URL

**الأعراض:**
```
Error: Environment variable not found: DATABASE_URL
```

**الحل:**
```bash
# تأكد من وجود ملف .env
cp .env.example .env

# أضف DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/cvmaster"
```

---

## 🔴 المشكلة 4: الأداء

### 4.1 التطبيق بطيء

**الأسباب المحتملة:**

#### استعلامات قاعدة بيانات غير محسّنة
```tsx
// ❌ خطأ - N+1 Problem
const users = await prisma.user.findMany();
for (const user of users) {
  const cvs = await prisma.cv.findMany({ where: { userId: user.id } });
}

// ✅ صحيح - استخدم include
const users = await prisma.user.findMany({
  include: {
    cvs: true,
    subscription: true
  }
});
```

#### صور كبيرة الحجم
```tsx
// ✅ استخدم Next.js Image optimization
import Image from 'next/image';

<Image
  src="/cv-template.png"
  width={800}
  height={1000}
  quality={75}
  loading="lazy"
  alt="CV Template"
/>
```

#### عدم استخدام React.memo
```tsx
// ❌ خطأ - يعيد الرسم كل مرة
function CVPreview({ data }) {
  return <div>{/* محتوى معقد */}</div>;
}

// ✅ صحيح
const CVPreview = React.memo(function CVPreview({ data }) {
  return <div>{/* محتوى معقد */}</div>;
});
```

### 4.2 PDF بطيء جداً

**الحل:**
```tsx
// استخدم Web Worker لـ PDF generation
// أو استخدم @react-pdf/renderer بدلاً من html2canvas

// الخيار 1: @react-pdf/renderer (سريع)
const blob = await pdf(<ModernPDF data={cvData} />).toBlob();
saveAs(blob, 'cv.pdf');

// الخيار 2: Cloudflare Worker (أسرع)
const blob = await generateTextPDF(html, css);
saveAs(blob, 'cv.pdf');
```

---

## 🔴 المشكلة 5: الترجمة (i18n)

### 5.1 الترجمات لا تظهر

**الأعراض:**
```tsx
{t('key')} // يظهر "key" بدلاً من النص المترجم
```

**الحل:**
```tsx
// تأكد من استيراد useTranslations
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('namespace'); // ✅ اسم الـ namespace صحيح
  
  return <p>{t('key')}</p>;
}
```

**تأكد من وجود الملف:**
```
/messages/
  ar.json  ✅
  fr.json  ✅
  en.json  ✅
```

### 5.2 اللغة لا تتغير

**الحل:**
```tsx
// في middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always' // ✅ مهم
});
```

---

## 🔴 المشكلة 6: Build Errors

### 6.1 Type errors في TypeScript

**الحل:**
```bash
# فحص الأخطاء
npm run build

# إصلاح أخطاء شائعة
# 1. أضف types ناقصة
npm install -D @types/node @types/react

# 2. تحديث Prisma client
npm run prisma:generate
```

### 6.2 Module not found

**الحل:**
```bash
# امسح cache
rm -rf .next
rm -rf node_modules

# أعد التثبيت
npm install
npm run build
```

---

## 🔴 المشكلة 7: Deployment Issues

### 7.1 Environment Variables غير محددة

**الحل:**
```bash
# في Vercel/Netlify
# تأكد من إضافة جميع المتغيرات:

NEXT_PUBLIC_API_URL=https://api.moncvpro.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...
JWT_SECRET=...
```

### 7.2 Build timeout

**الحل:**
```json
// في package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

## 📊 أدوات التشخيص

### 1. فحص Console للأخطاء
```tsx
// أضف logging في نقاط حرجة
console.log('🔍 Export started:', { format, filename });

try {
  await generatePDF('cv-preview');
  console.log('✅ Export success');
} catch (error) {
  console.error('❌ Export failed:', error);
  // أرسل إلى Sentry
}
```

### 2. React Developer Tools
- افحص Props و State
- تتبع Re-renders
- فحص Component tree

### 3. Network Tab
- تحقق من API calls
- تحقق من Response times
- ابحث عن 404 أو 500 errors

### 4. Lighthouse Audit
```bash
# فحص الأداء
npm run build
npm start
# افتح Chrome DevTools > Lighthouse > Run audit
```

---

## 🆘 الإصلاحات السريعة (Quick Fixes)

### إصلاح 1: إعادة تشغيل Development Server
```bash
# أوقف Server
Ctrl + C

# امسح cache
rm -rf .next

# شغّل مرة أخرى
npm run dev
```

### إصلاح 2: إعادة توليد Prisma Client
```bash
cd backend
npm run prisma:generate
```

### إصلاح 3: إعادة تثبيت Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### إصلاح 4: فحص Port مشغول
```bash
# إذا Port 3000 مشغول
lsof -ti:3000 | xargs kill -9

# أو استخدم port آخر
npm run dev -- -p 3001
```

---

## 📞 المساعدة الإضافية

### تفعيل Debug Mode
```tsx
// في .env.local
NEXT_PUBLIC_DEBUG=true

// في الكود
if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
  console.log('Debug info:', data);
}
```

### إرسال Logs إلى Sentry
```tsx
import * as Sentry from '@sentry/nextjs';

try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

---

## ✅ Checklist للتأكد من عدم وجود مشاكل

**قبل Deploy:**

- [ ] `npm run build` ينجح بدون أخطاء
- [ ] `npm run lint` لا يظهر أخطاء
- [ ] جميع tests تمر
- [ ] PDF export يعمل (عربي + فرنسي + إنجليزي)
- [ ] RTL يعمل بشكل صحيح
- [ ] الصور تحمّل
- [ ] Database seeded with templates
- [ ] Environment variables محددة
- [ ] HTTPS يعمل
- [ ] Mobile responsive

---

**💡 نصيحة:** احتفظ بهذا الملف مفتوحاً أثناء التطوير!
