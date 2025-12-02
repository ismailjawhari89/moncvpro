# 🗺️ CV Builder SaaS - Complete Site Map & Architecture

## 📋 **SITE STRUCTURE OVERVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│                     CV Builder Pro SaaS                      │
├─────────────────────────────────────────────────────────────┤
│  1. Landing Page (/)                                        │
│  2. Dashboard (/dashboard)                                  │
│  3. CV Builder (/cv-builder)                                │
│  4. Templates Gallery (/templates)                          │
│  5. CV History (/my-cvs)                                    │
│  6. Profile (/profile)                                      │
│  7. Settings (/settings)                                    │
│  8. Help & Support (/help)                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ **LANDING PAGE** (`/`)

### **Goal**: جذب المستخدم وشرح الخدمة

### **Components**:

#### **A. Hero Section**
```typescript
<HeroSection>
  - Headline: "Create Professional CVs in Minutes with AI"
  - Subheadline: "ATS-friendly templates + AI assistance"
  - CTA Buttons:
    * "Start Building Free" → /dashboard
    * "View Templates" → /templates
  - Hero Image/Animation: CV preview mockup
</HeroSection>
```

#### **B. Features Section**
```typescript
<FeaturesGrid>
  Feature 1: 🤖 AI-Powered Content
    - Auto-generate professional summaries
    - ATS optimization suggestions
    
  Feature 2: 🎨 Beautiful Templates
    - Modern, Classic, Creative designs
    - One-click template switching
    
  Feature 3: 📥 Export Options
    - PDF, DOCX formats
    - Print-ready quality
    
  Feature 4: ☁️ Cloud Storage
    - Save unlimited CVs
    - Version history tracking
    
  Feature 5: 👁️ Live Preview
    - Real-time updates
    - What you see is what you get
    
  Feature 6: 📊 Analytics
    - Track your progress
    - Optimize for success
</FeaturesGrid>
```

#### **C. How It Works Section**
```typescript
<StepsSection>
  Step 1: Choose a Template
  Step 2: Fill Your Information
  Step 3: Let AI Enhance
  Step 4: Export & Apply
</StepsSection>
```

#### **D. Templates Showcase**
```typescript
<TemplatesShowcase>
  - Grid of 3 template previews
  - "View All Templates" button → /templates
</TemplatesShowcase>
```

#### **E. Testimonials Section**
```typescript
<TestimonialsCarousel>
  - User reviews with ratings
  - Success stories
  - Before/After examples
</TestimonialsCarousel>
```

#### **F. Pricing Section** (Optional)
```typescript
<PricingCards>
  Free Plan:
    - 3 CVs
    - Basic templates
    - PDF export
    
  Pro Plan:
    - Unlimited CVs
    - Premium templates
    - AI assistance
    - Priority support
</PricingCards>
```

#### **G. Footer**
```typescript
<Footer>
  Column 1: Product
    - Features
    - Templates
    - Pricing
    
  Column 2: Resources
    - Help Center
    - Blog
    - FAQ
    
  Column 3: Legal
    - Terms of Service
    - Privacy Policy
    - Cookie Policy
    
  Column 4: Social
    - Twitter, LinkedIn, Facebook
    - Newsletter signup
</Footer>
```

### **Navigation Flow**:
```
Landing → [Start Building] → Sign Up/Login → Dashboard
Landing → [View Templates] → Templates Gallery
Landing → [Pricing] → Pricing Page → Sign Up
```

---

## 2️⃣ **DASHBOARD** (`/dashboard`)

### **Goal**: نظرة عامة على CVs + Quick Actions

### **Components**:

#### **A. Header**
```typescript
<DashboardHeader>
  - Logo (clickable → /dashboard)
  - Navigation Menu:
    * Dashboard
    * My CVs
    * Templates
    * Profile
  - Right Side:
    * Dark Mode Toggle
    * Notifications Bell
    * User Avatar Dropdown:
      - Profile
      - Settings
      - Logout
</DashboardHeader>
```

#### **B. Analytics Cards**
```typescript
<AnalyticsGrid>
  Card 1: CVs Created (count)
  Card 2: AI Assists Used (count)
  Card 3: Total Exports (count)
  Card 4: Most Used Template (name)
</AnalyticsGrid>
```

#### **C. Quick Actions**
```typescript
<QuickActions>
  - "Create New CV" Button → /cv-builder
  - "Browse Templates" Button → /templates
  - "Import CV" Button (future feature)
</QuickActions>
```

#### **D. Recent CVs**
```typescript
<RecentCVsList>
  - Last 3-5 CVs
  - Each CV Card:
    * Title
    * Template name
    * Last updated date
    * Quick actions: Edit, Export, Delete
  - "View All CVs" link → /my-cvs
</RecentCVsList>
```

#### **E. Tips & Recommendations**
```typescript
<TipsCard>
  - AI-generated tips based on usage
  - "Complete your profile" reminder
  - "Try premium templates" suggestion
</TipsCard>
```

### **Navigation Flow**:
```
Dashboard → [Create New CV] → CV Builder
Dashboard → [Recent CV] → CV Builder (edit mode)
Dashboard → [View All] → My CVs
Dashboard → [User Menu] → Profile/Settings
```

---

## 3️⃣ **CV BUILDER** (`/cv-builder` or `/cv-builder?id=xxx`)

### **Goal**: بناء CV مباشر + Live Preview + AI Assistant

### **Layout**: 2-Column (Left: Form, Right: Sidebar)

### **Components**:

#### **A. Header**
```typescript
<BuilderHeader>
  - Logo + "CV Builder"
  - Center: CV Title (editable)
  - Right Side:
    * Dark Mode Toggle
    * Save Button (with auto-save indicator)
    * Export Dropdown:
      - Export PDF
      - Export DOCX
    * User Avatar
</BuilderHeader>
```

#### **B. Left Column - Form Sections**
```typescript
<FormTabs>
  Tab 1: Personal Info
    - Full Name
    - Email, Phone
    - Location
    - Professional Summary
    
  Tab 2: Work Experience
    - Add/Remove positions
    - Company, Position, Dates
    - Current role checkbox
    - Achievements (bullet points)
    
  Tab 3: Education
    - Add/Remove entries
    - Institution, Degree, Field
    - Graduation year
    
  Tab 4: Skills
    - Add/Remove skills
    - Category: Technical/Soft
    - Proficiency level (optional)
    
  Tab 5: Languages
    - Add/Remove languages
    - Proficiency: Basic/Conversational/Fluent/Native
    
  Tab 6: Additional (Optional)
    - Certifications
    - Projects
    - Volunteer work
</FormTabs>

<FormActions>
  - "Previous" / "Next" buttons
  - Progress indicator
  - "Save Draft" button
</FormActions>
```

#### **C. Right Column - Sidebar**
```typescript
<Sidebar>
  Section 1: Live Preview Toggle
    - Show/Hide preview
    - Zoom controls
    - Full-screen preview button
    
  Section 2: Templates Gallery
    - Grid of 3 templates
    - Click to apply
    - "View All" → /templates
    
  Section 3: AI Assistant Card
    - "Activate AI" button
    - "View Demo" button
    - AI suggestions display
    - Copy recommendations
    
  Section 4: Export Actions
    - Export PDF button
    - Export DOCX button
    - Export history (last 3)
    
  Section 5: Version History
    - List of previous versions
    - Restore version button
    - Compare versions
</Sidebar>
```

#### **D. Live Preview Panel**
```typescript
<LivePreview>
  - Real-time CV preview
  - Scaled to fit sidebar
  - Highlight modified sections
  - Click to full-screen
</LivePreview>
```

#### **E. AI Analysis Modal**
```typescript
<AIAnalysisModal>
  - ATS Compatibility Score (0-100%)
  - Progress bar (color-coded)
  - Suggestions list:
    * Grammar improvements
    * Keyword optimization
    * Missing sections
  - Detected keywords (tags)
  - "Copy Recommendations" button
  - "Apply Suggestions" button
</AIAnalysisModal>
```

#### **F. Toast Notifications**
```typescript
<ToastContainer>
  - Success: "CV saved successfully"
  - Error: "Failed to save CV"
  - Info: "AI analysis complete"
  - Auto-dismiss after 5 seconds
</ToastContainer>
```

### **Navigation Flow**:
```
CV Builder → [Tab Navigation] → Fill sections
CV Builder → [Template Click] → Apply template → Preview updates
CV Builder → [AI Activate] → Analysis modal → Apply suggestions
CV Builder → [Export PDF] → Download → Success toast
CV Builder → [Save] → Dashboard or My CVs
```

---

## 4️⃣ **TEMPLATES GALLERY** (`/templates`)

### **Goal**: اختيار قالب جاهز

### **Components**:

#### **A. Header**
```typescript
<TemplatesHeader>
  - Title: "Choose Your Perfect Template"
  - Subtitle: "Professional designs for every industry"
  - Filter Buttons:
    * All
    * Modern
    * Classic
    * Creative
    * Premium
</TemplatesHeader>
```

#### **B. Templates Grid**
```typescript
<TemplatesGrid>
  - Responsive grid (1-3 columns)
  - Each Template Card:
    * Preview image (lazy-loaded)
    * Template name
    * Description
    * Premium badge (if applicable)
    * Hover overlay:
      - "Preview" button
      - "Use Template" button
    * Selected indicator (checkmark)
</TemplatesGrid>
```

#### **C. Template Preview Modal**
```typescript
<TemplatePreviewModal>
  - Full-size template preview
  - Template details:
    * Name, description
    * Best for: (industry)
    * Features
  - Actions:
    * "Use This Template" → CV Builder
    * "Close" button
  - Navigation arrows (prev/next template)
</TemplatePreviewModal>
```

#### **D. Sidebar Filters** (Desktop)
```typescript
<TemplateFilters>
  - Category filter
  - Industry filter
  - Color scheme filter
  - Premium/Free toggle
</TemplateFilters>
```

### **Navigation Flow**:
```
Templates → [Filter] → Filtered results
Templates → [Preview] → Modal → [Use Template] → CV Builder
Templates → [Use Template] → CV Builder (template applied)
```

---

## 5️⃣ **MY CVS / CV HISTORY** (`/my-cvs`)

### **Goal**: إدارة CVs المخزنة

### **Components**:

#### **A. Header**
```typescript
<CVHistoryHeader>
  - Title: "My CVs"
  - Right Side:
    * Search bar
    * Sort dropdown:
      - Last modified
      - Name (A-Z)
      - Template
    * View toggle: Grid / List
    * "Create New CV" button
</CVHistoryHeader>
```

#### **B. CVs Grid/List**
```typescript
<CVsGrid>
  - Each CV Card:
    * Thumbnail preview
    * CV title (editable inline)
    * Template name badge
    * Last updated date
    * Version number
    * Actions dropdown:
      - Edit → CV Builder
      - Duplicate
      - Export PDF
      - Export DOCX
      - View versions
      - Delete
    * Favorite star icon
</CVsGrid>
```

#### **C. Empty State**
```typescript
<EmptyState>
  - Icon: Empty folder
  - Message: "No CVs yet"
  - CTA: "Create Your First CV"
</EmptyState>
```

#### **D. Pagination**
```typescript
<Pagination>
  - Page numbers
  - Previous / Next buttons
  - Items per page selector
</Pagination>
```

#### **E. Bulk Actions** (Optional)
```typescript
<BulkActions>
  - Select all checkbox
  - Delete selected
  - Export selected
</BulkActions>
```

### **Navigation Flow**:
```
My CVs → [Search] → Filtered results
My CVs → [Edit] → CV Builder (edit mode)
My CVs → [Duplicate] → CV Builder (new copy)
My CVs → [Delete] → Confirmation modal → Deleted
My CVs → [View Versions] → Version history modal
```

---

## 6️⃣ **PROFILE PAGE** (`/profile`)

### **Goal**: إدارة حساب المستخدم

### **Components**:

#### **A. Profile Header**
```typescript
<ProfileHeader>
  - Avatar upload
  - User name (editable)
  - Email (display only)
  - Member since date
</ProfileHeader>
```

#### **B. Profile Sections**
```typescript
<ProfileTabs>
  Tab 1: Personal Information
    - Full name
    - Email (verified badge)
    - Phone number
    - Location
    - Bio
    
  Tab 2: Account Security
    - Change password
    - Two-factor authentication (future)
    - Active sessions
    - Delete account (danger zone)
    
  Tab 3: Subscription (if applicable)
    - Current plan
    - Usage statistics
    - Upgrade/Downgrade
    - Billing history
    
  Tab 4: Preferences
    - Default template
    - Auto-save interval
    - Email notifications
    - Language preference
</ProfileTabs>
```

#### **C. Save Actions**
```typescript
<ProfileActions>
  - "Save Changes" button
  - "Cancel" button
  - Success/Error messages
</ProfileActions>
```

### **Navigation Flow**:
```
Profile → [Edit Info] → Save → Success message
Profile → [Change Password] → Verify → Updated
Profile → [Delete Account] → Confirmation → Deleted
```

---

## 7️⃣ **SETTINGS PAGE** (`/settings`)

### **Goal**: تخصيص تجربة المستخدم

### **Components**:

#### **A. Settings Sections**
```typescript
<SettingsSections>
  Section 1: Appearance
    - Dark mode toggle
    - Theme color picker
    - Font size preference
    
  Section 2: Notifications
    - Email notifications:
      * CV saved
      * Export complete
      * AI suggestions ready
    - Browser notifications
    - Notification frequency
    
  Section 3: AI Preferences
    - AI suggestions level:
      * Minimal
      * Balanced
      * Aggressive
    - Auto-apply AI suggestions
    - AI language preference
    
  Section 4: Export Settings
    - Default export format (PDF/DOCX)
    - Paper size (A4/Letter)
    - Include metadata
    
  Section 5: Privacy
    - Data sharing preferences
    - Analytics opt-out
    - Cookie preferences
    
  Section 6: Advanced
    - Auto-save interval
    - Version history limit
    - Cache settings
</SettingsSections>
```

#### **B. Save Actions**
```typescript
<SettingsActions>
  - "Save All Settings" button
  - "Reset to Defaults" button
  - Auto-save indicator
</SettingsActions>
```

### **Navigation Flow**:
```
Settings → [Toggle Dark Mode] → Instant apply
Settings → [Change Preferences] → Save → Updated
Settings → [Reset] → Confirmation → Defaults restored
```

---

## 8️⃣ **HELP & SUPPORT PAGE** (`/help`)

### **Goal**: مساعدة المستخدم

### **Components**:

#### **A. Help Header**
```typescript
<HelpHeader>
  - Search bar: "How can we help?"
  - Popular topics chips
</HelpHeader>
```

#### **B. FAQ Accordion**
```typescript
<FAQAccordion>
  Category 1: Getting Started
    - How to create a CV?
    - How to choose a template?
    - How to use AI assistant?
    
  Category 2: Features
    - How to export CV?
    - How to save versions?
    - How to share CV?
    
  Category 3: Account
    - How to change password?
    - How to delete account?
    - How to upgrade plan?
    
  Category 4: Troubleshooting
    - CV not saving?
    - Export not working?
    - AI not responding?
</FAQAccordion>
```

#### **C. Video Tutorials**
```typescript
<VideoTutorials>
  - Embedded videos
  - Step-by-step guides
  - Tips & tricks
</VideoTutorials>
```

#### **D. Contact Support**
```typescript
<ContactForm>
  - Name, Email
  - Subject dropdown
  - Message textarea
  - Attachment upload
  - "Submit" button
</ContactForm>
```

#### **E. Live Chat** (Optional)
```typescript
<LiveChatWidget>
  - Chat bubble icon
  - Real-time support
  - Bot + Human agents
</LiveChatWidget>
```

### **Navigation Flow**:
```
Help → [Search] → Results
Help → [FAQ Click] → Expanded answer
Help → [Contact Form] → Submit → Success message
Help → [Live Chat] → Chat window → Conversation
```

---

## 🗺️ **COMPLETE NAVIGATION FLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                      MAIN NAVIGATION                         │
├─────────────────────────────────────────────────────────────┤
│  Landing (/)                                                │
│     ↓                                                       │
│  Sign Up/Login → Dashboard (/dashboard)                    │
│     ↓                                                       │
│  ┌──────────────────────────────────────────────┐          │
│  │  Dashboard Menu:                              │          │
│  │  - Create New CV → CV Builder                │          │
│  │  - My CVs → CV History                       │          │
│  │  - Templates → Templates Gallery             │          │
│  │  - Profile → Profile Page                    │          │
│  │  - Settings → Settings Page                  │          │
│  │  - Help → Help & Support                     │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
│  CV Builder (/cv-builder)                                  │
│     ↓                                                       │
│  - Fill Form → Live Preview Updates                        │
│  - Apply Template → Preview Changes                        │
│  - Use AI → Analysis Modal → Apply Suggestions             │
│  - Export → Download PDF/DOCX                              │
│  - Save → Back to Dashboard or My CVs                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 **RESPONSIVE BREAKPOINTS**

### **Mobile (<768px)**:
- Single column layout
- Collapsible sidebar
- Bottom navigation
- Stacked cards
- Hamburger menu

### **Tablet (768-1024px)**:
- 2-column layout
- Condensed sidebar
- Grid layout (2 columns)
- Visible navigation

### **Desktop (>1024px)**:
- 3-column layout (where applicable)
- Full sidebar
- Grid layout (3-4 columns)
- Expanded navigation

---

## 🎨 **GLOBAL COMPONENTS**

### **Reusable Across All Pages**:

```typescript
1. Header/Navigation
   - Logo
   - Menu items
   - User dropdown
   - Dark mode toggle

2. Footer
   - Links
   - Social media
   - Copyright

3. AuthModal
   - Sign up
   - Login
   - Password reset

4. Toast Notifications
   - Success
   - Error
   - Info
   - Warning

5. Loading States
   - Skeleton screens
   - Spinners
   - Progress bars

6. Empty States
   - No data messages
   - CTAs

7. Confirmation Modals
   - Delete confirmations
   - Unsaved changes warnings

8. Error Boundaries
   - Fallback UI
   - Error reporting
```

---

## 🚀 **MVP PAGES (PRIORITY)**

### **Phase 1 - Essential** (Launch):
1. ✅ Landing Page
2. ✅ Dashboard
3. ✅ CV Builder
4. ✅ My CVs
5. ✅ Auth (Sign up/Login)

### **Phase 2 - Important** (Week 2):
6. ✅ Templates Gallery
7. ✅ Profile Page
8. ✅ Settings Page

### **Phase 3 - Nice to Have** (Month 2):
9. ⏳ Help & Support
10. ⏳ Pricing Page
11. ⏳ Blog (future)

---

## 📊 **COMPONENT HIERARCHY**

```
App
├── AuthProvider
│   ├── Layout
│   │   ├── Header
│   │   ├── Main Content
│   │   │   ├── Landing Page
│   │   │   ├── Dashboard
│   │   │   ├── CV Builder
│   │   │   │   ├── FormTabs
│   │   │   │   ├── Sidebar
│   │   │   │   │   ├── LivePreview
│   │   │   │   │   ├── TemplatesGallery
│   │   │   │   │   ├── AIAssistant
│   │   │   │   │   └── ExportActions
│   │   │   │   └── AIAnalysisModal
│   │   │   ├── Templates Gallery
│   │   │   ├── My CVs
│   │   │   ├── Profile
│   │   │   ├── Settings
│   │   │   └── Help
│   │   └── Footer
│   ├── AuthModal
│   └── ToastContainer
```

---

## 🎯 **USER JOURNEY MAP**

### **First-Time User**:
```
1. Land on homepage
2. Click "Start Building Free"
3. Sign up with email
4. Redirected to Dashboard
5. Click "Create New CV"
6. Choose template
7. Fill personal info
8. See live preview update
9. Use AI for suggestions
10. Export PDF
11. Success! 🎉
```

### **Returning User**:
```
1. Login
2. Dashboard shows recent CVs
3. Click "Edit" on existing CV
4. Make changes
5. Auto-save kicks in
6. Export updated version
7. Done! ✅
```

---

## 💡 **BEST PRACTICES**

### **Navigation**:
- ✅ Max 3 clicks to any feature
- ✅ Breadcrumbs for deep pages
- ✅ Back button always works
- ✅ Clear active state indicators

### **Loading**:
- ✅ Skeleton screens for content
- ✅ Spinners for actions
- ✅ Progress bars for uploads
- ✅ Optimistic UI updates

### **Feedback**:
- ✅ Toast for quick actions
- ✅ Modals for important decisions
- ✅ Inline validation for forms
- ✅ Success animations

### **Accessibility**:
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ ARIA labels

---

**Generated**: December 3, 2025  
**Version**: Complete Site Map v1.0  
**Status**: 📋 **READY FOR IMPLEMENTATION**
