# Modern Pro Template - Visual Layout Guide

## 📐 Template Layout Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER SECTION                          │
│  ┌────────┐                                                     │
│  │        │  Ahmed Hassan                                       │
│  │ Photo  │  Senior Software Engineer                           │
│  │ 100px  │  Experienced software engineer with 8+ years...     │
│  │ Circle │  (Summary max 2 lines)                              │
│  └────────┘                                                     │
│                                                                 │
├──────────────────────┬──────────────────────────────────────────┤
│   LEFT COLUMN (30%)  │      RIGHT COLUMN (70%)                  │
│                      │                                          │
│  ┌─────────────────┐ │  ┌──────────────────────────────────┐   │
│  │ CONTACT         │ │  │ PROFESSIONAL SUMMARY             │   │
│  ├─────────────────┤ │  ├──────────────────────────────────┤   │
│  │ ahmed@email.com │ │  │ Full paragraph format            │   │
│  │ +212 6 12 34 56 │ │  │ Multiple lines allowed           │   │
│  │ Casablanca, MA  │ │  │ 11px, line height 1.6            │   │
│  └─────────────────┘ │  └──────────────────────────────────┘   │
│                      │                                          │
│  ┌─────────────────┐ │  ┌──────────────────────────────────┐   │
│  │ SKILLS          │ │  │ EXPERIENCE                       │   │
│  ├─────────────────┤ │  ├──────────────────────────────────┤   │
│  │ Frontend        │ │  │ Senior Software Engineer         │   │
│  │ • React         │ │  │ Tech Solutions Inc.              │   │
│  │ • TypeScript    │ │  │ 2020 - Present                   │   │
│  │ • Next.js       │ │  │ • Achievement 1                  │   │
│  │                 │ │  │ • Achievement 2                  │   │
│  │ Backend         │ │  │                                  │   │
│  │ • Node.js       │ │  │ Full Stack Developer             │   │
│  │ • Express       │ │  │ Digital Agency                   │   │
│  │                 │ │  │ 2017 - 2019                      │   │
│  │ Database        │ │  │ • Achievement 1                  │   │
│  │ • PostgreSQL    │ │  │ • Achievement 2                  │   │
│  │ • MongoDB       │ │  └──────────────────────────────────┘   │
│  └─────────────────┘ │                                          │
│                      │  ┌──────────────────────────────────┐   │
│  ┌─────────────────┐ │  │ EDUCATION                        │   │
│  │ LANGUAGES       │ │  ├──────────────────────────────────┤   │
│  ├─────────────────┤ │  │ Master of Computer Science       │   │
│  │ Arabic          │ │  │ Mohammed V University            │   │
│  │ Native          │ │  │ 2013 - 2015                      │   │
│  │                 │ │  │                                  │   │
│  │ French          │ │  │ Bachelor of Software Engineering │   │
│  │ Fluent          │ │  │ Hassan II University             │   │
│  │                 │ │  │ 2009 - 2013                      │   │
│  │ English         │ │  └──────────────────────────────────┘   │
│  │ Fluent          │ │                                          │
│  └─────────────────┘ │                                          │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘
│                         FOOTER SECTION                          │
│  ───────────────────────────────────────────────────────────   │
│                    Optional certificate info                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Color Coding

```
┌─────────────────────────────────────────────────────────────────┐
│  #1e40af (Primary Blue)                                         │
│  ├── Name                                                       │
│  ├── Job Title                                                  │
│  ├── Section Headers (UPPERCASE)                                │
│  ├── Company Names                                              │
│  └── Bullet Points                                              │
│                                                                 │
│  #111827 (Near Black)                                           │
│  ├── Job Titles                                                 │
│  ├── Degree Names                                               │
│  └── Category Titles                                            │
│                                                                 │
│  #374151 (Dark Gray)                                            │
│  ├── Summary Text                                               │
│  ├── Descriptions                                               │
│  └── Skill Names                                                │
│                                                                 │
│  #6b7280 (Muted Gray)                                           │
│  ├── Contact Info                                               │
│  ├── Dates                                                      │
│  └── Proficiency Levels                                         │
│                                                                 │
│  #e5e7eb (Light Gray)                                           │
│  ├── Photo Border                                               │
│  ├── Section Borders                                            │
│  └── Footer Separator                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 📏 Spacing Guide

```
┌─────────────────────────────────────────────────────────────────┐
│  32px margin all sides                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Header Section                                           │ │
│  │  ↓ 16px gap                                               │ │
│  │                                                           │ │
│  │  ┌──────────┐ 24px gap ┌────────────────────────────┐    │ │
│  │  │          │           │                            │    │ │
│  │  │  Left    │           │         Right              │    │ │
│  │  │  30%     │           │         70%                │    │ │
│  │  │          │           │                            │    │ │
│  │  │  Section │           │  Section                   │    │ │
│  │  │  ↓ 16px  │           │  ↓ 16px                    │    │ │
│  │  │  Section │           │  Section                   │    │ │
│  │  │  ↓ 16px  │           │  ↓ 16px                    │    │ │
│  │  │  Section │           │  Section                   │    │ │
│  │  │          │           │                            │    │ │
│  │  │  Items:  │           │  Items:                    │    │ │
│  │  │  ↓ 8px   │           │  ↓ 8px                     │    │ │
│  │  │  Item    │           │  Item                      │    │ │
│  │  │  ↓ 8px   │           │  ↓ 8px                     │    │ │
│  │  │  Item    │           │  Item                      │    │ │
│  │  │          │           │                            │    │ │
│  │  └──────────┘           └────────────────────────────┘    │ │
│  │                                                           │ │
│  │  ↓ 24px gap                                               │ │
│  │  Footer Section                                           │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│  32px margin                                                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🔤 Typography Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Ahmed Hassan                    ← 28px, Bold, #1e40af         │
│  Senior Software Engineer        ← 14px, Medium, #1e40af       │
│  Summary text here...            ← 11px, Regular, #374151      │
│                                                                 │
│  ───────────────────────────────────────────────────────────   │
│                                                                 │
│  CONTACT                         ← 12px, Bold, Uppercase       │
│  ────────                           #1e40af, 2px border        │
│  ahmed@email.com                 ← 10px, Regular, #6b7280      │
│                                                                 │
│  EXPERIENCE                      ← 12px, Bold, Uppercase       │
│  ──────────                         #1e40af, 2px border        │
│  Senior Software Engineer        ← 12px, Bold, #111827         │
│  Tech Solutions Inc.             ← 11px, Medium, #1e40af       │
│  2020 - Present                  ← 10px, Regular, #6b7280      │
│  • Achievement description       ← 11px, Regular, #374151      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📱 RTL Layout (Arabic)

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER SECTION                          │
│                                                     ┌────────┐  │
│                                       أحمد حسن      │        │  │
│                           مهندس برمجيات أول        │ Photo  │  │
│     ...مهندس برمجيات ذو خبرة تزيد عن 8 سنوات      │ 100px  │  │
│                            (Summary max 2 lines)    │ Circle │  │
│                                                     └────────┘  │
│                                                                 │
├──────────────────────────────────────────┬──────────────────────┤
│      RIGHT COLUMN (70%)                  │   LEFT COLUMN (30%)  │
│                                          │                      │
│  ┌──────────────────────────────────┐   │  ┌─────────────────┐ │
│  │             SUMMARY              │   │  │ CONTACT         │ │
│  ├──────────────────────────────────┤   │  ├─────────────────┤ │
│  │            Full paragraph        │   │  │ ahmed@email.com │ │
│  │           Multiple lines         │   │  │ +212 6 12 34 56 │ │
│  │            11px, 1.6             │   │  │ الدار البيضاء   │ │
│  └──────────────────────────────────┘   │  └─────────────────┘ │
│                                          │                      │
│  [Experience and Education sections]    │  [Skills & Languages]│
│                                          │                      │
└──────────────────────────────────────────┴──────────────────────┘
```

## 🖼️ Photo Specifications

```
┌─────────────────────────────────────────┐
│                                         │
│     ┌───────────────────────┐           │
│     │  ╭─────────────────╮  │           │
│     │  │                 │  │ ← 2px     │
│     │  │                 │  │   border  │
│     │  │                 │  │   #e5e7eb │
│     │  │     Photo       │  │           │
│     │  │    100×100      │  │           │
│     │  │    Circle       │  │           │
│     │  │                 │  │           │
│     │  │                 │  │           │
│     │  ╰─────────────────╯  │           │
│     └───────────────────────┘           │
│                                         │
│     ← 16px spacing to text →            │
│                                         │
└─────────────────────────────────────────┘
```

## 📊 Section Breakdown

### Header (Full Width)
- Photo: 100px circle, left-aligned
- Name: 28px bold
- Job Title: 14px medium
- Summary: 11px, max 2 lines

### Left Column (30%)
1. **Contact** (10px)
   - Email
   - Phone
   - Location

2. **Skills** (10px)
   - Grouped by category
   - Vertical list

3. **Languages** (10px)
   - Name + Proficiency
   - Vertical list

### Right Column (70%)
1. **Summary** (11px)
   - Full paragraph
   - Line height 1.6

2. **Experience** (11-12px)
   - Job title (12px bold)
   - Company (11px, primary)
   - Dates (10px, muted)
   - Bullets (11px)

3. **Education** (11-12px)
   - Degree (12px bold)
   - Institution (11px, primary)
   - Dates (10px, muted)

### Footer (Full Width)
- Separator line (1px, #e5e7eb)
- Certificate info (9px, muted)

---

**Template**: Modern Pro v1.0.0  
**Created**: 2026-01-01  
**Page Size**: A4 (210mm × 297mm)  
**Margins**: 32px all sides
