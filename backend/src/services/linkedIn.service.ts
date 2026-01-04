
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { analytics } from '../utils/analytics';
import { datasources } from '../../prisma/prisma.config';

const db = new PrismaClient({ datasources });

/**
 * Service to handle LinkedIn Integration features
 */
export const linkedInService = {
    /**
     * Import profile data from LinkedIn and create a new CV
     */
    async importLinkedInProfile(userId: string) {
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { linkedIn: true }
        });

        if (!user?.linkedIn?.accessToken) {
            throw new Error('LinkedIn not connected');
        }

        try {
            // Get LinkedIn profile data
            const response = await axios.get(
                'https://api.linkedin.com/v2/me',
                {
                    headers: {
                        Authorization: `Bearer ${user.linkedIn.accessToken}`,
                        'Accept-Language': 'en_US'
                    }
                }
            );

            const profileData = response.data;

            // Get work experience
            const experienceResponse = await axios.get(
                'https://api.linkedin.com/v2/me?projection=(id,positions)',
                {
                    headers: {
                        Authorization: `Bearer ${user.linkedIn.accessToken}`
                    }
                }
            );

            // Get education
            const educationResponse = await axios.get(
                'https://api.linkedin.com/v2/me?projection=(id,educations)',
                {
                    headers: {
                        Authorization: `Bearer ${user.linkedIn.accessToken}`
                    }
                }
            );

            // Get skills
            const skillsResponse = await axios.get(
                'https://api.linkedin.com/v2/me?projection=(id,skills)',
                {
                    headers: {
                        Authorization: `Bearer ${user.linkedIn.accessToken}`
                    }
                }
            );

            // Transform to CV format
            const cvData = {
                personalInfo: {
                    fullName: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
                    email: user.email,
                    photoUrl: profileData.profilePicture?.displayImage || '',
                    linkedin: `linkedin.com/in/${profileData.vanityName || ''}`,
                    profession: profileData.headline || '',
                    address: profileData.location?.city || ''
                },
                summary: profileData.summary || '',

                experiences: experienceResponse.data.positions?.map((exp: any) => ({
                    company: exp.company?.localizedName || '',
                    position: exp.title || '',
                    startDate: this.formatLinkedInDate(exp.startDate),
                    endDate: exp.endDate ? this.formatLinkedInDate(exp.endDate) : null,
                    current: !exp.endDate,
                    description: exp.description || ''
                })) || [],

                education: educationResponse.data.educations?.map((edu: any) => ({
                    institution: edu.schoolName || '',
                    degree: edu.degreeName || '',
                    field: edu.fieldOfStudy || '',
                    graduationYear: edu.endDate?.year?.toString() || ''
                })) || [],

                skills: skillsResponse.data.skills?.map((skill: any) => ({
                    name: skill.name || '',
                    level: 3,
                    category: 'technical'
                })) || [],

                languages: []
            };

            // Create CV from imported data
            const cv = await db.cV.create({
                data: {
                    userId,
                    title: 'LinkedIn Import',
                    template: 'modern-pro',
                    content: {}, // Placeholder for legacy JSON
                    personalInfo: cvData.personalInfo as any,
                    summary: cvData.summary,
                    experiences: {
                        createMany: {
                            data: cvData.experiences
                        }
                    },
                    education: {
                        createMany: {
                            data: cvData.education
                        }
                    },
                    skills: {
                        createMany: {
                            data: cvData.skills
                        }
                    }
                }
            });

            // Log the import
            await analytics.track('LinkedIn Profile Imported', {
                userId,
                cvId: cv.id,
                experienceCount: cvData.experiences.length,
                educationCount: cvData.education.length,
                skillsCount: cvData.skills.length
            });

            return {
                success: true,
                cvId: cv.id,
                message: 'Profile imported successfully'
            };

        } catch (error: any) {
            console.error('LinkedIn import failed:', error);
            throw new Error(`Failed to import LinkedIn profile: ${error.message}`);
        }
    },

    /**
     * Export CV data back to LinkedIn profile
     */
    async exportToLinkedInProfile(cvId: string, userId: string) {
        const cv = await db.cV.findUnique({
            where: { id: cvId },
            include: {
                experiences: true,
                education: true,
                skills: true,
                user: { include: { linkedIn: true } }
            }
        });

        if (!cv?.user?.linkedIn?.accessToken) {
            throw new Error('LinkedIn not connected');
        }

        const accessToken = cv.user.linkedIn.accessToken;

        try {
            // Update LinkedIn headline with profession (optional example from prompt)
            const personaInfo: any = cv.personalInfo;
            if (personaInfo?.profession) {
                await axios.patch(
                    'https://api.linkedin.com/v2/me',
                    { headline: personaInfo.profession },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
            }

            // Update summary
            if (cv.summary) {
                await axios.patch(
                    'https://api.linkedin.com/v2/me',
                    { summary: cv.summary },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
            }

            // Update skills (add missing ones)
            for (const skill of cv.skills) {
                try {
                    await axios.post(
                        'https://api.linkedin.com/v2/skills',
                        { name: skill.name },
                        { headers: { Authorization: `Bearer ${accessToken}` } }
                    );
                } catch (e) {
                    console.warn(`Failed to sync skill ${skill.name} to LinkedIn`);
                }
            }

            await analytics.track('CV Exported to LinkedIn', { cvId, userId });

            return { success: true, message: 'CV exported to LinkedIn' };
        } catch (error: any) {
            throw new Error(`Failed to export to LinkedIn: ${error.message}`);
        }
    },

    /**
     * Match CV with LinkedIn jobs
     */
    async getJobMatches(cvId: string, userId: string) {
        const cv = await db.cV.findUnique({
            where: { id: cvId },
            include: { skills: true }
        });

        const user = await db.user.findUnique({
            where: { id: userId },
            include: { linkedIn: true }
        });

        if (!user?.linkedIn?.accessToken) {
            throw new Error('LinkedIn not connected');
        }

        if (!cv) throw new Error('CV not found');

        const personaInfo: any = cv.personalInfo;
        const skills = cv.skills.map(s => s.name);
        const keywords = [
            personaInfo?.profession || '',
            ...skills
        ].filter(Boolean).join(', ');

        // Store the matching request/results
        const jobMatch = await db.jobMatch.create({
            data: {
                cvId,
                userId,
                keywords,
                source: 'linkedin',
                matchedAt: new Date()
            }
        });

        return {
            success: true,
            jobMatch,
            message: 'Job matches queued for processing'
        };
    },

    /**
     * Helper to format LinkedIn date object to YYYY-MM
     */
    formatLinkedInDate(dateObj: any): string {
        if (!dateObj) return '';
        const { year, month } = dateObj;
        if (!year) return '';
        const monthStr = month ? String(month).padStart(2, '0') : '01';
        return `${year}-${monthStr}`;
    }
};
