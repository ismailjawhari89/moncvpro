import React from 'react';
import { LayoutProps, BlockDef } from '../types';
import { BlockMap } from '../components/blocks';
import { cn, getSpacingClass } from '../utils';

const renderBlocks = (blocks: BlockDef[], props: any) => {
    return blocks.map((block, i) => {
        const Component = BlockMap[block.type];
        if (!Component) return null;
        return <Component key={i} block={block} {...props} />;
    });
};

export const OneColumnLayout: React.FC<LayoutProps> = (props) => {
    const { template, blocks } = props;
    const { background, text } = template.palette;
    const spacing = getSpacingClass(template.spacing?.itemGap);

    return (
        <div className="min-h-full p-8" style={{ backgroundColor: background, color: text, fontFamily: template.typography?.body || 'Inter' }}>
            <div className="mb-6">{renderBlocks(blocks.top, props)}</div>
            <div className="mb-6">{renderBlocks(blocks.sidebar, props)}</div> {/* Render sidebar in main flow for single column */}
            <div className={spacing}>{renderBlocks(blocks.main, props)}</div>
            <div className="mt-8 pt-4 border-t border-gray-200">{renderBlocks(blocks.footer, props)}</div>
        </div>
    );
};

export const TwoColumnLayout: React.FC<LayoutProps> = (props) => {
    const { template, blocks } = props;
    const { background, text } = template.palette;
    const spacing = getSpacingClass(template.spacing?.sectionGap);

    return (
        <div className="min-h-full p-8" style={{ backgroundColor: background, color: text, fontFamily: template.typography?.body || 'Inter' }}>
            {/* Header matches background */}
            <div className="mb-8">{renderBlocks(blocks.top, props)}</div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-6">
                    {renderBlocks(blocks.main, props)}
                </div>
                <div className="col-span-4 space-y-6 border-l pl-6" style={{ borderColor: template.palette.muted + '20' }}>
                    {renderBlocks(blocks.sidebar, props)}
                </div>
            </div>

            <div className="mt-8">{renderBlocks(blocks.footer, props)}</div>
        </div>
    );
};

export const SidebarLayout: React.FC<LayoutProps> = (props) => {
    const { template, blocks } = props;
    const { background, text, primary } = template.palette;

    // Sidebar usually has primary or accent color background
    const sidebarBg = primary;

    return (
        <div className="min-h-full flex" style={{ backgroundColor: background, color: text, fontFamily: template.typography?.body || 'Inter' }}>
            <div className="w-1/3 min-h-full p-8 text-white space-y-6 shrink-0" style={{ backgroundColor: sidebarBg }}>
                {renderBlocks(blocks.top, props)}
                {renderBlocks(blocks.sidebar, props)}
            </div>
            <div className="w-2/3 p-8 space-y-6">
                {renderBlocks(blocks.main, props)}
                <div className="mt-auto pt-8">
                    {renderBlocks(blocks.footer, props)}
                </div>
            </div>
        </div>
    );
};
