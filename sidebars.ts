import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'ワールド開発',
      items: [
        'guides/create-first-world',
        'guides/configuration',
        'guides/triplex',
        'guides/shared-dependencies',
        'world-components/components/index',
      ],
    },
    {
      type: 'category',
      label: 'アイテム開発',
      items: [
        'item/create-first-item',
        'item/configuration',
      ],
    },
    {
      type: 'category',
      label: 'CLI (xrift-cli)',
      items: [
        'cli/overview',
        'cli/commands',
      ],
    },
    {
      type: 'category',
      label: 'SDK (@xrift/sdk)',
      items: [
        'sdk/overview',
        'sdk/api-reference',
      ],
    },
    'public-api/v1',
  ],
};

export default sidebars;
