
import { Font } from '@react-pdf/renderer';

export const registerPDFFonts = () => {
    // Check if fonts are already registered to avoid warnings in some environments
    // though @react-pdf/renderer usually handles this.
    Font.register({
        family: 'Cairo',
        fonts: [
            { src: 'https://fonts.gstatic.com/s/cairo/v28/SLXGc1nu6Hkv3HIkXfbsx7p0.ttf', fontWeight: 400 },
            { src: 'https://fonts.gstatic.com/s/cairo/v28/SLXHc1nu6Hkv3HIkSOf9u7p07V8.ttf', fontWeight: 700 },
        ]
    });

    Font.register({
        family: 'Inter',
        fonts: [
            { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-EkA.ttf', fontWeight: 400 },
            { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.ttf', fontWeight: 700 },
        ]
    });
};
