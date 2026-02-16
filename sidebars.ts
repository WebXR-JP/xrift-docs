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
        'world-components/components/index',
      ],
    },
    {
      type: 'category',
      label: 'アイテム開発',
      items: [
        'item/overview',
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
  ],
};

export default sidebars;
