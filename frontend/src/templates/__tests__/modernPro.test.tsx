
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateRenderer } from '../components/TemplateRenderer';
import { getTemplate } from '../definitions';
import { CVData } from '../types';

// Mock CV Data
const mockCVData: CVData = {
    personalInfo: {
        fullName: 'Test User',
        jobTitle: 'Software Engineer',
        email: 'test@example.com',
        phone: '123-456-7890',
        location: 'Test City',
        photoUrl: 'https://example.com/photo.jpg',
        summary: 'A test summary for the modern pro template.',
    },
    experience: [],
    education: [],
    skills: [],
    languages: []
};

describe('Modern Pro Template', () => {
    const template = getTemplate('modern-pro');

    if (!template) {
        throw new Error('Modern Pro template definition not found');
    }

    test('renders header with photo in Pro mode', () => {
        render(<TemplateRenderer template={template} data={mockCVData} />);
        const photo = screen.getByAltText('Test User');
        expect(photo).toBeInTheDocument();
        expect(photo).toHaveStyle({ borderRadius: '50%' }); // Check circle shape
    });

    test('renders name and job title', () => {
        render(<TemplateRenderer template={template} data={mockCVData} />);
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    test('maintains two-column layout structure', () => {
        const { container } = render(<TemplateRenderer template={template} data={mockCVData} />);
        // Assuming the renderer uses specific classes for columns based on our implementation
        const leftColumn = container.querySelector('.cv-column-left');
        const rightColumn = container.querySelector('.cv-column-right');

        expect(leftColumn).toBeInTheDocument();
        expect(rightColumn).toBeInTheDocument();
    });

    test('handles Arabic content correctly (RTL)', () => {
        const arabicData: CVData = {
            ...mockCVData,
            personalInfo: { ...mockCVData.personalInfo, fullName: 'محمد أحمد' }
        };

        const { container } = render(
            <TemplateRenderer
                template={template}
                data={arabicData}
                locale="ar"
            />
        );

        const cvContainer = container.querySelector('.cv-template');
        expect(cvContainer).toHaveStyle({ direction: 'rtl' });
        expect(screen.getByText('محمد أحمد')).toBeInTheDocument();
    });

    test('renders contact info with correct styling', () => {
        render(<TemplateRenderer template={template} data={mockCVData} />);
        // Check if styled as text-only (no icons check implied by not finding icon/svg)
        const email = screen.getByText('test@example.com');
        expect(email).toBeInTheDocument();
        expect(email).toHaveStyle({ fontSize: '10px' });
    });
});
