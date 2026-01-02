#!/bin/bash

# 🔧 Script لتطبيق الإصلاحات السريعة
# Usage: ./scripts/apply-fixes.sh

set -e

echo "🚀 بدء تطبيق الإصلاحات..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
  echo -e "ℹ️  $1"
}

# Check if we're in the project root
if [ ! -f "package.json" ]; then
  print_error "الرجاء تشغيل هذا السكريبت من مجلد المشروع الرئيسي"
  exit 1
fi

print_info "التحقق من البيئة..."

# 1. Check if frontend exists
if [ ! -d "frontend" ]; then
  print_error "مجلد frontend غير موجود"
  exit 1
fi

# 2. Check if backend exists
if [ ! -d "backend" ]; then
  print_error "مجلد backend غير موجود"
  exit 1
fi

print_success "البيئة جاهزة"
echo ""

# ==========================================
# Fix 1: Install missing dependencies
# ==========================================
print_info "الخطوة 1: التحقق من Dependencies..."

cd frontend

if [ ! -d "node_modules" ]; then
  print_warning "node_modules غير موجود. تثبيت dependencies..."
  npm install
  print_success "تم تثبيت dependencies"
else
  print_success "Dependencies موجودة"
fi

cd ..

# ==========================================
# Fix 2: Generate Prisma Client
# ==========================================
print_info "الخطوة 2: توليد Prisma Client..."

cd backend

if [ ! -f "prisma/schema.prisma" ]; then
  print_error "Prisma schema غير موجود"
  cd ..
  exit 1
fi

npm run prisma:generate > /dev/null 2>&1
print_success "تم توليد Prisma Client"

cd ..

# ==========================================
# Fix 3: Check environment variables
# ==========================================
print_info "الخطوة 3: التحقق من Environment Variables..."

# Frontend .env
if [ ! -f "frontend/.env.local" ]; then
  print_warning "frontend/.env.local غير موجود"
  if [ -f "frontend/.env.example" ]; then
    cp frontend/.env.example frontend/.env.local
    print_success "تم إنشاء frontend/.env.local من .env.example"
  else
    print_warning "يرجى إنشاء frontend/.env.local يدوياً"
  fi
else
  print_success "frontend/.env.local موجود"
fi

# Backend .env
if [ ! -f "backend/.env" ]; then
  print_warning "backend/.env غير موجود"
  if [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    print_success "تم إنشاء backend/.env من .env.example"
  else
    print_warning "يرجى إنشاء backend/.env يدوياً"
  fi
else
  print_success "backend/.env موجود"
fi

echo ""

# ==========================================
# Fix 4: Clear Next.js cache
# ==========================================
print_info "الخطوة 4: مسح Cache..."

if [ -d "frontend/.next" ]; then
  rm -rf frontend/.next
  print_success "تم مسح Next.js cache"
else
  print_success "لا يوجد cache لمسحه"
fi

# ==========================================
# Fix 5: Create fix summary
# ==========================================
print_info "الخطوة 5: إنشاء تقرير الإصلاحات..."

cat > FIXES_APPLIED.txt << EOF
📋 تقرير الإصلاحات المطبقة
التاريخ: $(date)

✅ الإصلاحات المطبقة:
1. ✅ تم التحقق من Dependencies
2. ✅ تم توليد Prisma Client
3. ✅ تم التحقق من Environment Variables
4. ✅ تم مسح Cache

⚠️  الخطوات التالية المطلوبة يدوياً:

1. تحديث ExportPanel.tsx
   - الملف: frontend/src/components/cv/ExportPanel.tsx
   - الإصلاح: أضف التحقق من وجود العنصر
   - المرجع: EXPORT_FIX_GUIDE.md

2. إضافة خط Cairo للعربية
   - الملف: frontend/src/app/[locale]/layout.tsx
   - الإصلاح: أضف Cairo font import
   - المرجع: UI_DESIGN_FIXES.md

3. إصلاح RTL
   - الملفات: جميع Components التي تحتاج RTL
   - الإصلاح: أضف dir="rtl" و isRTL logic
   - المرجع: UI_DESIGN_FIXES.md

📚 المراجع:
- TROUBLESHOOTING.md - دليل المشاكل الشائعة
- EXPORT_FIX_GUIDE.md - إصلاح التصدير
- UI_DESIGN_FIXES.md - إصلاح التصميم
- QUICK_FIX_SUMMARY.md - ملخص سريع

🚀 لبدء التطوير:
cd frontend && npm run dev

🧪 للاختبار:
1. افتح http://localhost:3000
2. جرب تصدير CV
3. جرب تغيير اللغة إلى العربية
4. تحقق من RTL

EOF

print_success "تم إنشاء FIXES_APPLIED.txt"

echo ""
echo "========================================"
echo ""
print_success "تم تطبيق الإصلاحات الأساسية!"
echo ""
print_warning "الخطوات التالية:"
echo "  1. راجع ملف FIXES_APPLIED.txt"
echo "  2. راجع QUICK_FIX_SUMMARY.md للإصلاحات اليدوية"
echo "  3. شغّل: cd frontend && npm run dev"
echo "  4. اختبر التطبيق"
echo ""
print_info "للمساعدة، راجع:"
echo "  📖 TROUBLESHOOTING.md"
echo "  📖 EXPORT_FIX_GUIDE.md"
echo "  📖 UI_DESIGN_FIXES.md"
echo ""
echo "========================================"
echo ""
print_success "حظ سعيد! 🎉"
