import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...\n');

    console.log('1️⃣ Creating test users...');
    const password = await bcrypt.hash('Password123!', 10);

    const testUser = await prisma.user.upsert({
        where: { email: 'test@moncvpro.com' },
        update: {},
        create: {
            email: 'test@moncvpro.com',
            password,
            firstName: 'Test',
            lastName: 'User',
            isVerified: true,
            verifiedAt: new Date(),
        },
    });
    console.log('   ✓ Test user created:', testUser.email);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@moncvpro.com' },
        update: {},
        create: {
            email: 'admin@moncvpro.com',
            password,
            firstName: 'Admin',
            lastName: 'User',
            isVerified: true,
            verifiedAt: new Date(),
        },
    });
    console.log('   ✓ Admin user created:', adminUser.email);

    console.log('\n2️⃣ Creating CV templates...');
    
    const templates = [
        {
            name: 'Modern Professional',
            slug: 'modern-professional',
            description: 'Clean and modern design perfect for tech professionals',
            category: 'modern',
            config: {
                layout: 'single-column',
                sections: ['header', 'summary', 'experience', 'education', 'skills'],
                colors: { primary: '#2563eb', secondary: '#64748b' },
            },
            isPremium: false,
            isActive: true,
        },
        {
            name: 'Classic Elegance',
            slug: 'classic-elegance',
            description: 'Traditional and elegant design for corporate roles',
            category: 'classic',
            config: {
                layout: 'two-column',
                sections: ['header', 'summary', 'experience', 'education', 'skills', 'certifications'],
                colors: { primary: '#1e293b', secondary: '#475569' },
            },
            isPremium: false,
            isActive: true,
        },
        {
            name: 'Creative Bold',
            slug: 'creative-bold',
            description: 'Stand out with this creative and colorful design',
            category: 'creative',
            config: {
                layout: 'sidebar',
                sections: ['header', 'summary', 'experience', 'skills', 'portfolio', 'education'],
                colors: { primary: '#7c3aed', secondary: '#c084fc' },
            },
            isPremium: true,
            isActive: true,
        },
        {
            name: 'Minimalist Clean',
            slug: 'minimalist-clean',
            description: 'Simple and clean design focusing on content',
            category: 'minimalist',
            config: {
                layout: 'single-column',
                sections: ['header', 'experience', 'education', 'skills'],
                colors: { primary: '#000000', secondary: '#6b7280' },
            },
            isPremium: false,
            isActive: true,
        },
    ];

    for (const template of templates) {
        const created = await prisma.template.upsert({
            where: { slug: template.slug },
            update: {},
            create: template,
        });
        console.log(`   ✓ Template created: ${created.name}`);
    }

    console.log('\n3️⃣ Creating sample resumes...');
    
    const sampleResume = await prisma.resume.create({
        data: {
            userId: testUser.id,
            title: 'Software Engineer Resume',
            slug: `software-engineer-${Date.now()}`,
            description: 'Full-stack developer with 5 years of experience',
            templateId: 'modern-professional',
            content: {
                personalInfo: {
                    fullName: 'Test User',
                    email: 'test@moncvpro.com',
                    phone: '+1234567890',
                    location: 'San Francisco, CA',
                    linkedin: 'linkedin.com/in/testuser',
                    github: 'github.com/testuser',
                },
                summary: 'Experienced full-stack developer passionate about creating scalable web applications.',
                experience: [
                    {
                        company: 'Tech Corp',
                        position: 'Senior Software Engineer',
                        location: 'San Francisco, CA',
                        startDate: '2020-01',
                        endDate: null,
                        current: true,
                        description: 'Leading development of enterprise web applications',
                        highlights: [
                            'Led team of 5 developers',
                            'Improved performance by 40%',
                            'Implemented CI/CD pipeline',
                        ],
                    },
                    {
                        company: 'Startup Inc',
                        position: 'Software Engineer',
                        location: 'Remote',
                        startDate: '2018-06',
                        endDate: '2019-12',
                        current: false,
                        description: 'Full-stack development on SaaS platform',
                        highlights: [
                            'Built RESTful APIs',
                            'Developed React frontend',
                            'Optimized database queries',
                        ],
                    },
                ],
                education: [
                    {
                        institution: 'University of California',
                        degree: 'Bachelor of Science',
                        field: 'Computer Science',
                        location: 'Berkeley, CA',
                        startDate: '2014-09',
                        endDate: '2018-05',
                        gpa: '3.8',
                    },
                ],
                skills: {
                    technical: [
                        'JavaScript', 'TypeScript', 'React', 'Node.js',
                        'Python', 'PostgreSQL', 'MongoDB', 'AWS',
                    ],
                    soft: [
                        'Leadership', 'Communication', 'Problem Solving',
                        'Team Collaboration', 'Agile Methodologies',
                    ],
                },
            },
            status: 'PUBLISHED',
            publishedAt: new Date(),
            isPublic: true,
            atsScore: 85.5,
        },
    });
    console.log(`   ✓ Sample resume created: ${sampleResume.title}`);

    console.log('\n4️⃣ Creating sample AI cache entries...');
    
    const aiCache = await prisma.aiCache.create({
        data: {
            cacheKey: 'summary_tech_5years',
            type: 'SUMMARY',
            input: {
                experience: '5 years',
                field: 'software engineering',
            },
            output: {
                summary: 'Results-driven Software Engineer with 5 years of experience...',
            },
            hitCount: 0,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
    });
    console.log(`   ✓ AI cache entry created`);

    console.log('\n5️⃣ Creating system configurations...');
    
    const configs = [
        {
            key: 'max_resumes_per_user',
            value: { free: 3, premium: 100 },
            description: 'Maximum number of resumes per user tier',
            isPublic: false,
        },
        {
            key: 'ai_rate_limits',
            value: { free: 10, premium: 100, daily: true },
            description: 'AI generation rate limits per user tier',
            isPublic: false,
        },
        {
            key: 'export_formats',
            value: { free: ['PDF', 'JSON'], premium: ['PDF', 'DOCX', 'PNG', 'JSON'] },
            description: 'Available export formats per tier',
            isPublic: true,
        },
        {
            key: 'maintenance_mode',
            value: { enabled: false, message: '' },
            description: 'System maintenance mode settings',
            isPublic: true,
        },
    ];

    for (const config of configs) {
        const created = await prisma.systemConfig.upsert({
            where: { key: config.key },
            update: {},
            create: config,
        });
        console.log(`   ✓ Config created: ${created.key}`);
    }

    console.log('\n6️⃣ Creating activity logs...');
    
    await prisma.activityLog.create({
        data: {
            userId: testUser.id,
            action: 'user.login',
            entity: 'User',
            entityId: testUser.id,
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
            metadata: {
                loginMethod: 'email',
                success: true,
            },
        },
    });
    
    await prisma.activityLog.create({
        data: {
            userId: testUser.id,
            action: 'resume.create',
            entity: 'Resume',
            entityId: sampleResume.id,
            ipAddress: '127.0.0.1',
            metadata: {
                templateId: 'modern-professional',
            },
        },
    });
    console.log('   ✓ Activity logs created');

    console.log('\n7️⃣ Creating analytics entries...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analyticsData = [
        { metric: 'daily_active_users', value: 42 },
        { metric: 'resumes_created', value: 15 },
        { metric: 'exports_completed', value: 28 },
        { metric: 'ai_generations', value: 67 },
    ];

    for (const data of analyticsData) {
        await prisma.analytics.upsert({
            where: {
                date_metric: {
                    date: today,
                    metric: data.metric,
                },
            },
            update: {},
            create: {
                date: today,
                metric: data.metric,
                value: data.value,
            },
        });
        console.log(`   ✓ Analytics: ${data.metric} = ${data.value}`);
    }

    console.log('\n✅ Database seeding completed successfully!\n');
    
    console.log('📊 Summary:');
    console.log(`   - Users: 2`);
    console.log(`   - Templates: ${templates.length}`);
    console.log(`   - Resumes: 1`);
    console.log(`   - System Configs: ${configs.length}`);
    console.log(`   - Activity Logs: 2`);
    console.log(`   - Analytics: ${analyticsData.length}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('   Email: test@moncvpro.com');
    console.log('   Password: Password123!');
    console.log('\n   Email: admin@moncvpro.com');
    console.log('   Password: Password123!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
