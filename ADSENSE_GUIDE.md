# Google AdSense Integration Guide

## 🎯 Overview
This guide will help you integrate Google AdSense into your CV Master AI platform for monetization.

---

## 📋 Prerequisites

1. **Google AdSense Account**
   - Sign up at: https://www.google.com/adsense
   - Wait for approval (usually 1-2 weeks)
   - Get your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)

2. **Domain Requirements**
   - Own domain (not localhost)
   - HTTPS enabled
   - Privacy Policy page
   - Terms of Service page
   - Contact page

---

## 🚀 Setup Steps

### Step 1: Get Your AdSense Publisher ID

1. Log in to Google AdSense
2. Go to **Account** → **Account Information**
3. Copy your **Publisher ID** (starts with `ca-pub-`)

### Step 2: Update Environment Variables

Add to `frontend/.env.local`:
```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

Replace `XXXXXXXXXXXXXXXX` with your actual publisher ID.

### Step 3: Update Layout File

The AdSense script is already integrated in `src/app/layout.tsx`. Just replace the placeholder:

```typescript
// Find this line:
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"

// Replace with your actual ID:
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
```

### Step 4: Create Ad Units in AdSense Dashboard

1. Go to **Ads** → **By ad unit**
2. Click **New ad unit**
3. Choose ad type:
   - **Display ads** (recommended for most placements)
   - **In-feed ads** (for CV grid)
   - **In-article ads** (for blog/content)

4. Get the ad slot ID (format: `1234567890`)

---

## 📍 Recommended Ad Placements

### 1. Landing Page (`/`)

**Top Banner (After Hero)**
```tsx
import { AdSense } from '@/components/ads/AdSense';

<AdSense 
  adSlot="1234567890" 
  adFormat="horizontal"
  className="my-8"
/>
```

**Sidebar (Desktop)**
```tsx
<AdSense 
  adSlot="0987654321" 
  adFormat="vertical"
  className="sticky top-4"
/>
```

**Between Sections**
```tsx
{/* After Features section */}
<AdSense 
  adSlot="1122334455" 
  adFormat="auto"
  className="my-12"
/>
```

### 2. Dashboard (`/dashboard`)

**Top Banner**
```tsx
<div className="mb-6">
  <AdSense 
    adSlot="2233445566" 
    adFormat="horizontal"
  />
</div>
```

**Sidebar (Below Navigation)**
```tsx
<div className="mt-6">
  <AdSense 
    adSlot="3344556677" 
    adFormat="rectangle"
  />
</div>
```

### 3. CV Editor (`/editor/[id]`)

**Non-Intrusive Placement**
```tsx
{/* Below toolbar, above editor */}
<AdSense 
  adSlot="4455667788" 
  adFormat="horizontal"
  className="mb-4"
/>
```

**Note**: Avoid placing ads in the editor area itself to maintain user experience.

### 4. Templates Gallery

**Between Template Rows**
```tsx
<AdSense 
  adSlot="5566778899" 
  adFormat="auto"
  className="my-8"
/>
```

---

## 💡 Best Practices

### Do's ✅
- Place ads in natural breaks
- Use responsive ad units
- Test on mobile devices
- Monitor ad performance
- Respect user experience
- Follow AdSense policies

### Don'ts ❌
- Don't place too many ads
- Don't click your own ads
- Don't encourage clicks
- Don't place ads on error pages
- Don't use misleading labels
- Don't modify ad code

---

## 📊 Ad Unit Types

### 1. Display Ads
```tsx
<AdSense 
  adSlot="YOUR_SLOT_ID" 
  adFormat="auto"
  fullWidthResponsive={true}
/>
```
**Best for**: General content areas

### 2. Horizontal Ads
```tsx
<AdSense 
  adSlot="YOUR_SLOT_ID" 
  adFormat="horizontal"
/>
```
**Best for**: Top/bottom banners

### 3. Vertical Ads
```tsx
<AdSense 
  adSlot="YOUR_SLOT_ID" 
  adFormat="vertical"
/>
```
**Best for**: Sidebars

### 4. Rectangle Ads
```tsx
<AdSense 
  adSlot="YOUR_SLOT_ID" 
  adFormat="rectangle"
/>
```
**Best for**: Content breaks

---

## 🔧 Implementation Example

### Landing Page with Ads

```tsx
import { AdSense } from '@/components/ads/AdSense';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';

export default function Home() {
  return (
    <div>
      <Hero />
      
      {/* Ad after hero */}
      <div className="container my-8">
        <AdSense adSlot="1234567890" adFormat="horizontal" />
      </div>
      
      <Features />
      
      {/* Ad between sections */}
      <div className="container my-12">
        <AdSense adSlot="0987654321" adFormat="auto" />
      </div>
      
      {/* Rest of content */}
    </div>
  );
}
```

---

## 📈 Optimization Tips

### 1. Strategic Placement
- Above the fold (visible without scrolling)
- Between content sections
- Sidebar (desktop)
- End of content

### 2. Ad Density
- **Recommended**: 3-4 ads per page
- **Maximum**: Don't exceed 50% ad-to-content ratio

### 3. Responsive Design
- Always use `fullWidthResponsive={true}`
- Test on mobile, tablet, desktop
- Use appropriate ad formats per device

### 4. Performance
- Use `strategy="lazyOnload"` for AdSense script
- Don't block page rendering
- Monitor Core Web Vitals

---

## 🛡️ AdSense Policies Compliance

### Required Pages

1. **Privacy Policy** (`/privacy`)
   - Explain data collection
   - Mention Google AdSense
   - Cookie usage
   - User rights

2. **Terms of Service** (`/terms`)
   - Usage terms
   - Liability disclaimer
   - User responsibilities

3. **Contact Page** (`/contact`)
   - Email address
   - Contact form
   - Response time

### Content Guidelines
- ✅ Original, valuable content
- ✅ User-friendly navigation
- ✅ Fast loading times
- ✅ Mobile-responsive
- ❌ No prohibited content
- ❌ No copyright violations
- ❌ No misleading information

---

## 📊 Monitoring & Analytics

### AdSense Dashboard
- Daily revenue
- RPM (Revenue per 1000 impressions)
- CTR (Click-through rate)
- Top performing ad units

### Google Analytics Integration
```tsx
// Add to layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

---

## 🐛 Troubleshooting

### Ads Not Showing?

1. **Check Publisher ID**
   - Verify in `.env.local`
   - Ensure it starts with `ca-pub-`

2. **Check Ad Slot ID**
   - Verify in AdSense dashboard
   - Ensure it's active

3. **Check Domain**
   - Must be approved in AdSense
   - HTTPS required
   - Not localhost

4. **Check Browser**
   - Disable ad blockers
   - Clear cache
   - Try incognito mode

5. **Check Console**
   - Open browser DevTools
   - Look for AdSense errors
   - Fix any JavaScript errors

### Low Revenue?

1. **Improve Content Quality**
   - Add more valuable content
   - Update regularly
   - Engage users

2. **Optimize Placement**
   - Test different positions
   - Use heatmaps
   - A/B testing

3. **Increase Traffic**
   - SEO optimization
   - Social media marketing
   - Content marketing

---

## 📝 Checklist Before Going Live

- [ ] AdSense account approved
- [ ] Publisher ID added to environment variables
- [ ] Ad units created in AdSense dashboard
- [ ] Ads placed strategically on pages
- [ ] Privacy Policy page created
- [ ] Terms of Service page created
- [ ] Contact page created
- [ ] Tested on mobile/tablet/desktop
- [ ] No ad blocker interference
- [ ] Page load speed optimized
- [ ] Analytics tracking set up
- [ ] Domain verified in AdSense
- [ ] HTTPS enabled

---

## 🎯 Expected Revenue

**Factors Affecting Revenue:**
- Traffic volume
- Geographic location
- Niche/industry
- Ad placement
- User engagement
- Seasonality

**Typical RPM (Revenue per 1000 impressions):**
- **Low**: $0.50 - $2.00
- **Medium**: $2.00 - $5.00
- **High**: $5.00 - $20.00+

**Example Calculation:**
- 10,000 monthly visitors
- 3 page views per visitor = 30,000 page views
- 3 ads per page = 90,000 ad impressions
- RPM of $3.00
- **Monthly Revenue**: $270

---

## 📞 Support

**Google AdSense Help:**
- https://support.google.com/adsense

**AdSense Community:**
- https://support.google.com/adsense/community

**AdSense Policies:**
- https://support.google.com/adsense/answer/48182

---

**Last Updated**: November 2025  
**Status**: ✅ Ready for Integration
