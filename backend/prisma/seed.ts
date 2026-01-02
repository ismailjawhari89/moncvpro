import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default templates
  const templates = [
    {
      name: 'Modern Professional',
      description: 'A clean and modern template perfect for tech professionals',
      category: 'modern',
      thumbnail: '/templates/modern-professional-thumb.png',
      preview: '/templates/modern-professional-preview.png',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#3b82f6',
        text: '#1e293b',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        sizes: {
          h1: '28px',
          h2: '20px',
          h3: '16px',
          body: '14px'
        }
      },
      layout: '2col',
      config: {
        showPhoto: true,
        showIcons: true,
        accentColor: true
      },
      isPublic: true,
      isPremium: false
    },
    {
      name: 'Classic Elegant',
      description: 'Traditional and elegant design for formal industries',
      category: 'classic',
      thumbnail: '/templates/classic-elegant-thumb.png',
      preview: '/templates/classic-elegant-preview.png',
      colors: {
        primary: '#1e293b',
        secondary: '#475569',
        accent: '#64748b',
        text: '#0f172a',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Georgia',
        body: 'Georgia',
        sizes: {
          h1: '26px',
          h2: '18px',
          h3: '15px',
          body: '13px'
        }
      },
      layout: '1col',
      config: {
        showPhoto: false,
        showIcons: false,
        accentColor: false
      },
      isPublic: true,
      isPremium: false
    },
    {
      name: 'Creative Bold',
      description: 'Stand out with this bold and creative design',
      category: 'creative',
      thumbnail: '/templates/creative-bold-thumb.png',
      preview: '/templates/creative-bold-preview.png',
      colors: {
        primary: '#7c3aed',
        secondary: '#a78bfa',
        accent: '#c084fc',
        text: '#1e1b4b',
        background: '#faf5ff'
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Open Sans',
        sizes: {
          h1: '32px',
          h2: '22px',
          h3: '17px',
          body: '14px'
        }
      },
      layout: '2col',
      config: {
        showPhoto: true,
        showIcons: true,
        accentColor: true,
        headerStyle: 'bold'
      },
      isPublic: true,
      isPremium: true
    },
    {
      name: 'Minimalist',
      description: 'Less is more - a minimalist design that focuses on content',
      category: 'modern',
      thumbnail: '/templates/minimalist-thumb.png',
      preview: '/templates/minimalist-preview.png',
      colors: {
        primary: '#0f172a',
        secondary: '#334155',
        accent: '#64748b',
        text: '#0f172a',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Helvetica',
        body: 'Helvetica',
        sizes: {
          h1: '24px',
          h2: '18px',
          h3: '14px',
          body: '12px'
        }
      },
      layout: '1col',
      config: {
        showPhoto: false,
        showIcons: false,
        accentColor: false,
        spacing: 'large'
      },
      isPublic: true,
      isPremium: false
    },
    {
      name: 'Executive Pro',
      description: 'Premium design for senior executives and C-level professionals',
      category: 'elegant',
      thumbnail: '/templates/executive-pro-thumb.png',
      preview: '/templates/executive-pro-preview.png',
      colors: {
        primary: '#991b1b',
        secondary: '#7f1d1d',
        accent: '#b91c1c',
        text: '#1c1917',
        background: '#fafaf9'
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Lora',
        sizes: {
          h1: '30px',
          h2: '20px',
          h3: '16px',
          body: '13px'
        }
      },
      layout: '2col',
      config: {
        showPhoto: true,
        showIcons: false,
        accentColor: true,
        headerStyle: 'elegant'
      },
      isPublic: true,
      isPremium: true
    },
    {
      name: 'Tech Startup',
      description: 'Perfect for startup enthusiasts and tech innovators',
      category: 'modern',
      thumbnail: '/templates/tech-startup-thumb.png',
      preview: '/templates/tech-startup-preview.png',
      colors: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        accent: '#22d3ee',
        text: '#164e63',
        background: '#ecfeff'
      },
      fonts: {
        heading: 'Roboto',
        body: 'Roboto',
        sizes: {
          h1: '28px',
          h2: '20px',
          h3: '16px',
          body: '14px'
        }
      },
      layout: '3col',
      config: {
        showPhoto: true,
        showIcons: true,
        accentColor: true,
        headerStyle: 'modern'
      },
      isPublic: true,
      isPremium: true
    }
  ];

  console.log('📝 Creating templates...');
  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template
    });
    console.log(`✅ Created/Updated template: ${template.name}`);
  }

  console.log('\n✨ Seed completed successfully!');
  console.log(`📊 Created ${templates.length} templates`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
