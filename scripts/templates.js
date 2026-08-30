import { getMetadata, toClassName } from './aem.js';

const TEMPLATE_RULES = {
  'adc-webu-generic-page': {
    requiredAnyBlocks: ['hero', 'hero-banner', 'adc-cta-banner'],
  },
};

function parseTemplateValues(rawTemplateValue) {
  return rawTemplateValue
    .split(',')
    .map((value) => toClassName(value.trim()))
    .filter(Boolean);
}

export default function applyTemplateContract(main) {
  const rawTemplateValue = getMetadata('template');
  if (!rawTemplateValue) return;

  const templates = parseTemplateValues(rawTemplateValue);
  templates.forEach((templateName) => {
    const templateRule = TEMPLATE_RULES[templateName];
    if (!templateRule) {
      // eslint-disable-next-line no-console
      console.warn(`[EDS Template] Unsupported template '${templateName}'. Add a rule in scripts/templates.js.`);
      return;
    }

    if (templateRule.requiredAnyBlocks?.length) {
      const selector = templateRule.requiredAnyBlocks
        .map((blockName) => `.block.${blockName}`)
        .join(', ');
      if (!main.querySelector(selector)) {
        // eslint-disable-next-line no-console
        console.warn(`[EDS Template] '${templateName}' expects one of: ${templateRule.requiredAnyBlocks.join(', ')}`);
      }
    }
  });
}
