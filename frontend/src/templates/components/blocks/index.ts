
// Export all block components
import { HeaderBlock } from './HeaderBlock';
import { ContactBlock } from './ContactBlock';
import { SummaryBlock } from './SummaryBlock';
import { ExperienceBlock } from './ExperienceBlock';
import { EducationBlock } from './EducationBlock';
import { SkillsBlock } from './SkillsBlock';
import { LanguagesBlock } from './LanguagesBlock';
import { FooterBlock } from './FooterBlock';

// Block Registry Mapping
export const blockComponents: Record<string, React.FC<any>> = {
    header: HeaderBlock,
    contact: ContactBlock,
    summary: SummaryBlock,
    experience: ExperienceBlock,
    education: EducationBlock,
    skills: SkillsBlock,
    languages: LanguagesBlock,
    footer: FooterBlock,
};

export {
    HeaderBlock,
    ContactBlock,
    SummaryBlock,
    ExperienceBlock,
    EducationBlock,
    SkillsBlock,
    LanguagesBlock,
    FooterBlock,
};
