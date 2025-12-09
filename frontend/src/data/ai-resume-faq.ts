export interface FAQItem {
    question: string;
    answer: string;
}

export const AI_RESUME_FAQ: FAQItem[] = [
    {
        question: "How does the AI Resume Review work?",
        answer: "Our advanced AI analyzes your resume against thousands of successful job applications and industry standards. It checks for ATS compatibility, keyword optimization, formatting issues, and content quality to provide you with actionable feedback."
    },
    {
        question: "Is this service really free?",
        answer: "Yes, our basic AI Resume Review is completely free. You can upload your CV and get an instant analysis score and key recommendations without paying a cent."
    },
    {
        question: "Is my data safe and private?",
        answer: "Absolutely. We prioritize your privacy. Your uploaded CV is processed securely and is not shared with third parties or recruiters without your explicit permission. We use encryption to protect your data."
    },
    {
        question: "What file formats do you support?",
        answer: "We currently support PDF, DOCX (Word), and TXT files. For the best analysis results, we recommend uploading a PDF or DOCX file."
    },
    {
        question: "Can I edit my CV after the analysis?",
        answer: "Yes! After the analysis, you can use our CV Builder to make improvements directly. We'll guide you through fixing the issues identified by the AI."
    },
    {
        question: "How accurate is the ATS score?",
        answer: "Our ATS score is highly accurate and simulates the parsing algorithms used by major Applicant Tracking Systems. A high score (80+) significantly increases your chances of passing the initial screening."
    }
];
