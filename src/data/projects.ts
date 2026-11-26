export type Platform = 'chrome' | 'firefox' | 'vscode' | 'web'

export interface ProjectLink {
  label: string
  href: string
  platform: Platform
  internal?: boolean
}

export interface Project {
  id: string
  unitCode: string
  name: string
  summary: string
  icon?: string
  platforms: Platform[]
  category: 'extension' | 'web'
  githubRepo?: string
  badgeUrl?: string
  links: ProjectLink[]
}

export const PROJECTS: Project[] = [
  {
    id: 'hex-to-tailwind',
    unitCode: 'MOD-01',
    name: 'Hex to Tailwind',
    summary:
      'Convert hex to the closest Tailwind preset using the Delta E color-distance algorithm.',
    icon: '/img/htt-icon.png',
    platforms: ['web', 'vscode'],
    category: 'extension',
    links: [
      {
        label: 'Web App',
        href: 'https://tailwind-color-finder.vercel.app/',
        platform: 'web',
      },
      {
        label: 'VS Code',
        href: 'https://marketplace.visualstudio.com/items?itemName=TedisAgolli.hex-to-tailwind',
        platform: 'vscode',
      },
    ],
  },
  {
    id: 'runneth',
    unitCode: 'MOD-02',
    name: 'Runneth',
    summary:
      'A bookmark manager that forces you to prioritize by capping you at 5 active bookmarks.',
    icon: 'https://github.com/TedisAgolli/runneth/raw/master/public/runneth_128.png',
    platforms: ['chrome', 'firefox'],
    category: 'extension',
    githubRepo: 'TedisAgolli/runneth',
    badgeUrl:
      'https://chrome-extension-badge.vercel.app/api/installs/dmihmacgmljciebmenpanbfkllboajkl.svg',
    links: [
      {
        label: 'Chrome',
        href: 'https://chrome.google.com/webstore/detail/dmihmacgmljciebmenpanbfkllboajkl',
        platform: 'chrome',
      },
      {
        label: 'Firefox',
        href: 'https://addons.mozilla.org/en-US/firefox/addon/runneth/?src=search',
        platform: 'firefox',
      },
    ],
  },
  {
    id: 'readwise-new-tab',
    unitCode: 'MOD-03',
    name: 'Readwise New Tab',
    summary:
      'Show a random quote from your Readwise account every time you open a new tab.',
    icon: '/img/readwiseNewTabIcon.png',
    platforms: ['chrome'],
    category: 'extension',
    badgeUrl:
      'https://chrome-extension-badge.vercel.app/api/installs/iigdkhmjendealedklplakommgjpnhpg.svg',
    links: [
      {
        label: 'Chrome',
        href: 'https://chrome.google.com/webstore/detail/readwise-new-tab/iigdkhmjendealedklplakommgjpnhpg?hl=en&authuser=0',
        platform: 'chrome',
      },
    ],
  },
  {
    id: 'tailwind-eyedropper',
    unitCode: 'MOD-04',
    name: 'Tailwind Eyedropper',
    summary:
      'Pick colors straight from web pages and convert them to a Tailwind preset.',
    icon: '/img/tailwindEyedropper.png',
    platforms: ['chrome'],
    category: 'extension',
    badgeUrl:
      'https://chrome-extension-badge.vercel.app/api/installs/nilniojlolabjlhbkhejlokeffohkanp.svg',
    links: [
      {
        label: 'Chrome',
        href: 'https://chrome.google.com/webstore/detail/tailwind-eye-dropper/nilniojlolabjlhbkhejlokeffohkanp',
        platform: 'chrome',
      },
    ],
  },
  {
    id: 'mailtosucks',
    unitCode: 'MOD-05',
    name: 'Mailtosucks',
    summary:
      'Set mailto link text to the actual email address and copy it to your clipboard on click.',
    icon: 'https://raw.githubusercontent.com/TedisAgolli/mailtosucks/master/email.png',
    platforms: ['chrome'],
    category: 'extension',
    githubRepo: 'TedisAgolli/mailtosucks',
    links: [
      {
        label: 'Chrome',
        href: 'https://chrome.google.com/webstore/detail/mailtosucks/fggephiinjbfhbdglakghlfmapinaefp',
        platform: 'chrome',
      },
    ],
  },
  {
    id: 'pay-builders',
    unitCode: 'MOD-06',
    name: 'Pay.Builders',
    summary:
      'Companies should provide funds for their developers to sponsor open-source projects.',
    icon: '/img/paybuilders.png',
    platforms: ['web'],
    category: 'web',
    links: [
      {
        label: 'Website',
        href: 'https://pay.builders',
        platform: 'web',
      },
    ],
  },
  {
    id: 'remix-conf-frames',
    unitCode: 'MOD-07',
    name: 'Remix Conf Frames',
    summary:
      "Put a frame around your profile picture to show you're attending Remix Conf.",
    icon: '/img/remix-profile-pic.png',
    platforms: ['web'],
    category: 'web',
    links: [
      {
        label: 'Website',
        href: 'https://remix-conf-profile-pic-generator.vercel.app/',
        platform: 'web',
      },
    ],
  },
  {
    id: 'commute-tile-generator',
    unitCode: 'MOD-08',
    name: 'Commute Tile Generator',
    summary:
      'Generate a live Shields.io badge that displays the commute time between two coordinates.',
    platforms: ['web'],
    category: 'web',
    links: [
      {
        label: 'Open Tool',
        href: '/commute-tile-generator',
        platform: 'web',
        internal: true,
      },
    ],
  },
]
