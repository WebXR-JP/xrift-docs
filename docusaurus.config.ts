import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'XRift',
  tagline: 'Create Immersive WebXR Worlds',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://xrift-docs.vercel.app',
  baseUrl: '/',

  organizationName: 'WebXR-JP',
  projectName: 'xrift-docs',

  onBrokenLinks: 'throw',
  markdown: {
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      return result;
    },
  },

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/WebXR-JP/xrift-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['ja', 'en'],
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    image: 'img/ogp.png',
    navbar: {
      logo: {
        alt: 'XRift',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/WebXR-JP',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started/installation',
            },
            {
              label: 'ワールド開発',
              to: '/world-components/overview',
            },
            {
              label: 'アイテム開発',
              to: '/item/overview',
            },
          ],
        },
        {
          title: 'Repositories',
          items: [
            {
              label: 'xrift-cli',
              href: 'https://github.com/WebXR-JP/xrift-cli',
            },
            {
              label: 'xrift-world-components',
              href: 'https://github.com/WebXR-JP/xrift-world-components',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/WebXR-JP',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} WebXR-JP. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'glsl'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
