import { HeaderBlock } from './HeaderBlock';
import { SummaryBlock } from './SummaryBlock';
import { ExperienceBlock } from './ExperienceBlock';
import { EducationBlock } from './EducationBlock';
import { SkillsBlock } from './SkillsBlock';
import { ContactBlock } from './ContactBlock';
import { LanguagesBlock } from './LanguagesBlock';

export const BlockMap: Record<string, React.FC<any>> = {
    Header: HeaderBlock,
    Summary: SummaryBlock,
    Experience: ExperienceBlock,
    Education: EducationBlock,
    Skills: SkillsBlock,
    Contact: ContactBlock,
    Languages: LanguagesBlock
};
