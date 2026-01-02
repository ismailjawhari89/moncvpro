'use client';

import { useParams } from 'next/navigation';
import { useCVStore } from '@/stores/useCVStore';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const params = useParams();
  const cvData = useCVStore(state => state.cvData);
  const [mounted, setMounted] = useState(false);
  const [elementCheck, setElementCheck] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check for cv-preview-content element
    const checkElement = () => {
      const el = document.getElementById('cv-preview-content');
      setElementCheck({
        found: !!el,
        id: el?.id,
        tagName: el?.tagName,
        offsetWidth: el?.offsetWidth,
        offsetHeight: el?.offsetHeight,
      });
    };
    
    checkElement();
    const interval = setInterval(checkElement, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto p-8 max-w-4xl" dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">🔍 صفحة التشخيص - Debug Page</h1>

      {/* URL & Locale Info */}
      <section className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📍 معلومات الموقع - URL Info</h2>
        <div className="space-y-2 font-mono text-sm">
          <p><strong>params.locale:</strong> {params.locale as string}</p>
          <p><strong>window.location.href:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
          <p><strong>document.documentElement.lang:</strong> {typeof document !== 'undefined' ? document.documentElement.lang : 'N/A'}</p>
          <p><strong>document.documentElement.dir:</strong> {typeof document !== 'undefined' ? document.documentElement.dir : 'N/A'}</p>
        </div>
      </section>

      {/* CV Store Data */}
      <section className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">💾 بيانات Store - Store Data</h2>
        <div className="space-y-2 font-mono text-sm">
          <p><strong>cvData.template:</strong> {cvData.template || 'N/A'}</p>
          <p><strong>cvData.contentLanguage:</strong> {cvData.contentLanguage || 'NOT SET ⚠️'}</p>
          <p><strong>cvData.personalInfo.fullName:</strong> {cvData.personalInfo.fullName || 'Empty'}</p>
          <p><strong>cvData.experiences.length:</strong> {cvData.experiences?.length || 0}</p>
          <p><strong>cvData.education.length:</strong> {cvData.education?.length || 0}</p>
        </div>
      </section>

      {/* Element Check */}
      <section className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🎯 فحص العنصر - Element Check</h2>
        <div className="space-y-2 font-mono text-sm">
          <p><strong>cv-preview-content found:</strong> {elementCheck?.found ? '✅ YES' : '❌ NO'}</p>
          {elementCheck?.found && (
            <>
              <p><strong>tagName:</strong> {elementCheck.tagName}</p>
              <p><strong>offsetWidth:</strong> {elementCheck.offsetWidth}px</p>
              <p><strong>offsetHeight:</strong> {elementCheck.offsetHeight}px</p>
            </>
          )}
        </div>
      </section>

      {/* Browser Info */}
      <section className="mb-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🌐 معلومات المتصفح - Browser Info</h2>
        <div className="space-y-2 font-mono text-sm">
          <p><strong>userAgent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
          <p><strong>language:</strong> {typeof navigator !== 'undefined' ? navigator.language : 'N/A'}</p>
          <p><strong>languages:</strong> {typeof navigator !== 'undefined' ? navigator.languages.join(', ') : 'N/A'}</p>
        </div>
      </section>

      {/* LocalStorage */}
      <section className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">💿 التخزين المحلي - LocalStorage</h2>
        <div className="space-y-2 font-mono text-sm">
          <p><strong>cv-storage exists:</strong> {typeof localStorage !== 'undefined' && localStorage.getItem('cv-storage') ? '✅ YES' : '❌ NO'}</p>
          {typeof localStorage !== 'undefined' && localStorage.getItem('cv-storage') && (
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">عرض البيانات - Show Data</summary>
              <pre className="mt-2 p-4 bg-white dark:bg-gray-800 rounded overflow-auto max-h-96 text-xs">
                {JSON.stringify(JSON.parse(localStorage.getItem('cv-storage') || '{}'), null, 2)}
              </pre>
            </details>
          )}
        </div>
      </section>

      {/* Console Tests */}
      <section className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🧪 اختبارات Console - Console Tests</h2>
        <div className="space-y-3">
          <button
            onClick={() => {
              const el = document.getElementById('cv-preview-content');
              console.log('Element:', el);
              alert(el ? 'Element found! ✅' : 'Element not found! ❌');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Test Element
          </button>

          <button
            onClick={async () => {
              try {
                const html2canvas = (await import('html2canvas')).default;
                const el = document.getElementById('cv-preview-content') || document.body;
                const canvas = await html2canvas(el, { scale: 1 });
                console.log('Canvas:', canvas);
                alert('html2canvas works! ✅');
              } catch (err: any) {
                console.error('html2canvas failed:', err);
                alert('html2canvas failed! ❌\n' + err.message);
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
          >
            Test html2canvas
          </button>

          <button
            onClick={() => {
              console.log('All IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
              alert('Check console for all IDs');
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Show All IDs
          </button>
        </div>
      </section>

      {/* Instructions */}
      <section className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📝 التعليمات - Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>تحقق من جميع القيم أعلاه - Check all values above</li>
          <li>افتح Console (F12) وابحث عن أخطاء - Open Console and look for errors</li>
          <li>جرب الأزرار أعلاه - Try the buttons above</li>
          <li>إذا وجدت مشكلة، أرسل لقطة شاشة - If you find an issue, send a screenshot</li>
        </ol>
      </section>
    </div>
  );
}
