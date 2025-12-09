import modern from './modern.json';
import classic from './classic.json';
import creative from './creative.json';
import { TemplateDef } from '../types';

export const templates: Record<string, TemplateDef> = {
    modern: modern as unknown as TemplateDef,
    classic: classic as unknown as TemplateDef,
    creative: creative as unknown as TemplateDef
};

export const getTemplate = (id: string): TemplateDef => {
    return templates[id] || templates.modern;
};

export const getTemplateIds = () => Object.keys(templates);
