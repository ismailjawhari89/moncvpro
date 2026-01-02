# 🔧 دليل إصلاح مشاكل تصدير السيرة الذاتية

## 🎯 الهدف
إصلاح جميع مشاكل تصدير PDF/DOCX/TXT للسير الذاتية

---

## 🔴 المشكلة الرئيسية: PDF لا يُصدّر

### التشخيص السريع

**اختبار 1: هل العنصر موجود؟**
```javascript
// افتح Console في المتصفح واكتب:
document.getElementById('cv-preview')
// إذا null = العنصر غير موجود ❌
// إذا HTMLElement = العنصر موجود ✅
```

**اختبار 2: هل html2canvas يعمل؟**
```javascript
// في Console:
import('html2canvas').then(html2canvas => {
  html2canvas.default(document.getElementById('cv-preview'))
    .then(canvas => console.log('Success!', canvas))
    .catch(err => console.error('Failed:', err));
});
```

---

## ✅ الحل الشامل

### الخطوة 1: تحديث ExportPanel.tsx

**المشكلة:** الكود الحالي لا يتعامل مع جميع الحالات

**الحل:** استبدل دالة `handleExport` بهذا:

```tsx
const handleExport = async (format: ExportFormat) => {
  setIsExporting(format);
  setExportProgress(0);
  setExportError(null);
  setExportSuccess(null);

  try {
    // 1. التحقق من وجود العنصر
    if (['pdf', 'pdf-ats'].includes(format)) {
      const element = document.getElementById(previewElementId);
      if (!element) {
        throw new Error('عنصر المعاينة غير موجود. الرجاء الانتظار حتى يتم تحميل السيرة الذاتية.');
      }
    }

    const exportData = getTemplateData();

    switch (format) {
      case 'pdf':
        setExportProgress(10);
        
        // استخدم المكتبة الأكثر موثوقية
        await generatePDFWithProgress(
          previewElementId,
          (progress) => {
            setExportProgress(progress);
            console.log('📊 Export progress:', progress);
          },
          { 
            filename: `${filename}.pdf`,
            scale: 2,
            quality: 0.95
          }
        );
        break;

      case 'pdf-hq':
        setExportProgress(20);
        console.log('🚀 Generating HQ PDF...');
        
        try {
          const blob = await pdf(<ModernPDF data={cvData} />).toBlob();
          setExportProgress(80);
          saveAs(blob, `${filename}-hq.pdf`);
          setExportProgress(100);
        } catch (err) {
          console.error('HQ PDF Error:', err);
          throw new Error('فشل توليد PDF عالي الجودة. جرب التصدير العادي.');
        }
        break;

      case 'pdf-ats':
        setExportProgress(10);
        const element = document.getElementById(previewElementId);
        if (!element) throw new Error('عنصر المعاينة غير موجود');

        setExportProgress(30);
        
        // Capture HTML
        const html = element.outerHTML;

        // Capture ALL CSS (including Tailwind)
        const styles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              console.warn('Cannot access stylesheet:', sheet.href);
              return '';
            }
          })
          .join('\n');

        setExportProgress(60);

        await generateTextPDF(html, styles, `${filename}-ats.pdf`);
        setExportProgress(100);
        break;

      case 'docx':
        setExportProgress(20);
        await exportDOCX(exportData, { filename: `${filename}.docx` });
        setExportProgress(100);
        break;

      case 'txt':
        setExportProgress(50);
        exportTXT(exportData, { filename: `${filename}.txt` });
        setExportProgress(100);
        break;

      case 'json':
        setExportProgress(50);
        exportJSON(exportData, { filename: `${filename}.json` });
        setExportProgress(100);
        break;

      default:
        throw new Error(`صيغة غير مدعومة: ${format}`);
    }

    console.log('✅ Export successful:', format);
    setExportSuccess(format);
    setTimeout(() => setExportSuccess(null), 3000);
    
  } catch (error: any) {
    console.error('❌ Export failed:', error);
    
    // رسائل خطأ واضحة
    let errorMessage = 'فشل التصدير. ';
    
    if (error.message.includes('not found')) {
      errorMessage += 'الرجاء الانتظار حتى يتم تحميل السيرة الذاتية.';
    } else if (error.message.includes('network')) {
      errorMessage += 'تحقق من اتصالك بالإنترنت.';
    } else if (error.message.includes('CORS')) {
      errorMessage += 'مشكلة في تحميل الصور. جرب مرة أخرى.';
    } else {
      errorMessage += error.message || 'حدث خطأ غير متوقع.';
    }
    
    setExportError(errorMessage);
    setTimeout(() => setExportError(null), 5000);
  } finally {
    setIsExporting(null);
    setTimeout(() => setExportProgress(0), 500);
  }
};
```

---

### الخطوة 2: تحسين pdfGenerator.ts

**إضافة معالجة أفضل للأخطاء:**

```typescript
export async function generatePDF(
  elementId: string,
  options: PDFOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error('❌ Element not found:', elementId);
    console.log('Available elements:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
    throw new Error(`Element with id "${elementId}" not found`);
  }

  console.log('✅ Element found:', element);
  console.log('📐 Element dimensions:', {
    width: element.offsetWidth,
    height: element.offsetHeight,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight
  });

  // حفظ الأنماط الأصلية
  const originalOverflow = element.style.overflow;
  const originalHeight = element.style.maxHeight;
  const originalPosition = element.style.position;

  // إزالة القيود المؤقتة
  element.style.overflow = 'visible';
  element.style.maxHeight = 'none';
  element.style.position = 'relative';

  try {
    console.log('📸 Starting html2canvas...');
    
    // انتظر حتى تحمّل جميع الصور
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => {
          console.warn('⚠️ Image failed to load:', img.src);
          resolve(); // استمر حتى لو فشلت صورة
        };
        setTimeout(() => resolve(), 5000); // timeout بعد 5 ثواني
      });
    });

    await Promise.all(imagePromises);
    console.log('✅ All images loaded');

    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      imageTimeout: 15000,
      removeContainer: true
    });

    console.log('✅ Canvas created:', {
      width: canvas.width,
      height: canvas.height
    });

    const imgData = canvas.toDataURL('image/jpeg', options.quality || 0.95);
    
    console.log('📄 Creating PDF...');
    
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = options.margin || 10;

    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    console.log('📐 PDF dimensions:', {
      pageWidth,
      pageHeight,
      contentWidth,
      contentHeight,
      needsMultiplePages: contentHeight > (pageHeight - margin * 2)
    });

    // معالجة متعددة الصفحات
    if (contentHeight <= pageHeight - (margin * 2)) {
      // صفحة واحدة
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
    } else {
      // صفحات متعددة
      let heightLeft = contentHeight;
      let position = 0;

      while (heightLeft > 0) {
        if (position > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          position === 0 ? margin : -(position * (pageHeight - margin * 2)),
          contentWidth,
          contentHeight
        );

        heightLeft -= (pageHeight - margin * 2);
        position++;
      }
    }

    console.log('💾 Saving PDF...');
    pdf.save(options.filename || 'cv.pdf');
    console.log('✅ PDF saved successfully!');

  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  } finally {
    // استعادة الأنماط
    element.style.overflow = originalOverflow;
    element.style.maxHeight = originalHeight;
    element.style.position = originalPosition;
  }
}
```

---

### الخطوة 3: إصلاح مشكلة الخطوط العربية

**في ModernPDF.tsx (أو أي PDF template):**

```tsx
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// تسجيل الخطوط العربية
Font.register({
  family: 'Cairo',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvalIhTpumxdt0UX8.ttf',
      fontWeight: 'normal'
    },
    {
      src: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvalIkTp2mxdt0UX8.ttf',
      fontWeight: 'bold'
    }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Cairo', // استخدم الخط العربي
    fontSize: 12
  },
  arabicText: {
    fontFamily: 'Cairo',
    textAlign: 'right',
    direction: 'rtl'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Cairo'
  }
});

export function ModernPDF({ data }: { data: CVData }) {
  // كشف اللغة العربية
  const isArabic = /[\u0600-\u06FF]/.test(data.personalInfo.fullName || '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={[styles.heading, isArabic && styles.arabicText]}>
            {data.personalInfo.fullName}
          </Text>
          
          {/* باقي المحتوى */}
        </View>
      </Page>
    </Document>
  );
}
```

---

### الخطوة 4: التأكد من Element ID صحيح

**في CVBuilder.tsx أو CV Preview Component:**

```tsx
export function CVBuilder() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Form */}
      <div className="space-y-4">
        <PersonalInfoForm />
        <ExperienceForm />
        {/* ... */}
      </div>

      {/* Preview */}
      <div className="sticky top-4">
        <div 
          id="cv-preview"  {/* ✅ تأكد من هذا ID */}
          className="bg-white shadow-lg rounded-lg p-8 overflow-auto max-h-[80vh]"
        >
          <CVPreview data={cvData} />
        </div>

        {/* Export Panel */}
        <ExportPanel 
          cvData={cvData}
          previewElementId="cv-preview"  {/* ✅ نفس ID */}
          filename={`cv-${cvData.personalInfo.fullName || 'untitled'}`}
        />
      </div>
    </div>
  );
}
```

---

### الخطوة 5: إضافة Error Boundary

**إنشاء ExportErrorBoundary.tsx:**

```tsx
'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ExportErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('❌ Export Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle size={20} />
            <h3 className="font-semibold">فشل التصدير</h3>
          </div>
          <p className="text-sm text-red-700 mb-3">
            {this.state.error?.message || 'حدث خطأ أثناء تصدير السيرة الذاتية'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            حاول مرة أخرى
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// الاستخدام:
<ExportErrorBoundary>
  <ExportPanel cvData={cvData} previewElementId="cv-preview" />
</ExportErrorBoundary>
```

---

## 🧪 اختبار الإصلاحات

### اختبار 1: PDF عادي
```bash
1. افتح /cv-builder
2. املأ معلومات السيرة الذاتية
3. اضغط "تصدير" > "PDF"
4. يجب أن يتم التنزيل فوراً
```

### اختبار 2: PDF مع نص عربي
```bash
1. غيّر اللغة إلى العربية
2. املأ اسمك بالعربية
3. اضغط "تصدير" > "PDF"
4. افتح PDF - يجب أن يظهر النص العربي بشكل صحيح
```

### اختبار 3: DOCX
```bash
1. اضغط "تصدير" > "DOCX"
2. افتح الملف في Word
3. تأكد من ظهور المحتوى بشكل صحيح
```

### اختبار 4: معالجة الأخطاء
```bash
1. افتح Console
2. احذف عنصر المعاينة: document.getElementById('cv-preview').remove()
3. حاول التصدير
4. يجب أن تظهر رسالة خطأ واضحة
```

---

## 📊 Debugging Checklist

عند حدوث مشكلة، افحص:

- [ ] Console - هل هناك أخطاء؟
- [ ] Network tab - هل API calls تعمل؟
- [ ] Element inspector - هل `id="cv-preview"` موجود؟
- [ ] Images - هل جميع الصور تحمّلت؟
- [ ] Fonts - هل الخطوط العربية محمّلة؟
- [ ] Browser - هل المتصفح يدعم المكتبات المستخدمة؟

---

## 🚀 Next Steps

بعد تطبيق الإصلاحات:

1. ✅ اختبر جميع صيغ التصدير
2. ✅ اختبر مع اللغات الثلاث (en, fr, ar)
3. ✅ اختبر على متصفحات مختلفة
4. ✅ اختبر على mobile
5. ✅ أضف tests تلقائية

---

## 💡 Best Practices

1. **دائماً تحقق من وجود Element قبل التصدير**
2. **استخدم Error Boundaries**
3. **أضف Progress indicators**
4. **اختبر مع محتوى حقيقي طويل**
5. **تعامل مع CORS للصور الخارجية**
6. **استخدم Logging واضح**

---

**✅ إذا اتبعت هذه الخطوات، يجب أن تعمل جميع صيغ التصدير بشكل صحيح!**
