import { z } from "zod";
import { TemplateSchema, BlockSchema } from "./schema";
import { CVData } from "@/types/cv";

export type BlockDef = z.infer<typeof BlockSchema>;
export type TemplateDef = z.infer<typeof TemplateSchema>;

export interface TemplateRendererProps {
    template: TemplateDef;
    data: CVData;
    isPdfExport?: boolean;
}

export interface LayoutProps extends TemplateRendererProps {
    blocks: {
        top: BlockDef[];
        main: BlockDef[];
        sidebar: BlockDef[];
        footer: BlockDef[];
    };
}

export interface BlockRendererProps {
    block: BlockDef;
    data: CVData;
    template: TemplateDef;
}
