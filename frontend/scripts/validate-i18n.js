const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const DEFAULT_LOCALE = 'en';

function getFiles() {
    return fs.readdirSync(LOCALES_DIR).filter(file => file.endsWith('.json'));
}

function readJsonResult(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return { data: JSON.parse(content), error: null };
    } catch (e) {
        return { data: null, error: e.message };
    }
}

function getKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res;
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return [...res, ...getKeys(obj[el], prefix + el + '.')];
        }
        return [...res, prefix + el];
    }, []);
}

function validate() {
    console.log('🔍 Validating i18n files...');
    const files = getFiles();
    const results = {};

    // 1. Check valid JSON
    files.forEach(file => {
        const filePath = path.join(LOCALES_DIR, file);
        const { data, error } = readJsonResult(filePath);
        if (error) {
            console.error(`❌ [${file}] Invalid JSON: ${error}`);
            process.exit(1);
        }
        results[file] = data;
        console.log(`✅ [${file}] Valid JSON`);
    });

    const defaultData = results[`${DEFAULT_LOCALE}.json`];
    if (!defaultData) {
        console.error(`❌ Default locale file ${DEFAULT_LOCALE}.json not found!`);
        process.exit(1);
    }

    const defaultKeys = new Set(getKeys(defaultData));

    // 2. Check for missing keys
    let hasError = false;
    files.forEach(file => {
        if (file === `${DEFAULT_LOCALE}.json`) return;

        const currentData = results[file];
        const currentKeys = new Set(getKeys(currentData));
        const missingKeys = [...defaultKeys].filter(x => !currentKeys.has(x));

        if (missingKeys.length > 0) {
            console.warn(`⚠️  [${file}] Missing ${missingKeys.length} keys:`);
            missingKeys.forEach(k => console.warn(`   - ${k}`));
            hasError = true;
        } else {
            console.log(`✅ [${file}] All keys present`);
        }
    });

    if (hasError) {
        console.log('\n⚠️  Validation finished with warnings.');
    } else {
        console.log('\n🎉 Validation passed successfully!');
    }
}

validate();
