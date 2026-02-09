export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: string;
  children?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  disabled?: boolean;
  subtitle?: string;
  badge?: boolean;
  badgeType?: string;
  isPro?: boolean;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: string;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: string;
  disabled?: boolean;
  subtitle?: string;
  badgeType?: string;
  badge?: boolean;
  isPro?: boolean;
}

import { uniqueId } from 'lodash';
import type { TFunction } from 'i18next';

const getSidebarContent = (t: TFunction, isAdmin: boolean): MenuItem[] => [
  // ==================== NON-PRO SECTIONS ====================
  {
    // heading: 'Out Patient',
    children: [
      {
        name: t('sidebar.outPatient'),
        icon: 'chart',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Laboratory',
    children: [
      {
        name: t('sidebar.laboratory'),
        icon: 'testTube',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Radiology',
    children: [
      {
        name: t('sidebar.radiology'),
        icon: 'scanner',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Emergency',
    children: [
      {
        name: t('sidebar.emergency'),
        icon: 'ambulance',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Physiotherapy',
    children: [
      {
        name: t('sidebar.physiotherapy'),
        icon: 'activity',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Pharmacy',
    children: [
      {
        name: t('sidebar.pharmacy'),
        icon: 'pill',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Drug Store',
    children: [
      {
        name: t('sidebar.drugStore'),
        icon: 'store',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Inventory',
    children: [
      {
        name: t('sidebar.inventory'),
        icon: 'building',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'General Ledger',
    children: [
      {
        name: t('sidebar.generalLedger'),
        icon: 'bookMarked',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Insurance',
    children: [
      {
        name: t('sidebar.insurance'),
        icon: 'shieldPlus',
        id: uniqueId(),
        url: '#',
        isPro: false,
      },
    ],
  },
  {
    // heading: 'Statistics',
    children: [
      {
        name: t('sidebar.statistics'),
        icon: 'chart',
        id: uniqueId(),
        url: '/',
        isPro: false,
        children: [
          {
            name: t('sidebar.holyCapitalHospitalStatistics'),
            icon: 'hospital',
            id: uniqueId(),
            url: '/statistics/holy-capital-hospital',
            isPro: false,
          },
          {
            name: t('sidebar.doctorStatistics'),
            icon: 'stethoscope',
            id: uniqueId(),
            url: '/statistics/doctors',
            isPro: false,
          },
        ],
      },
    ],
  },
  ...(isAdmin
    ? [
        {
          children: [
            {
              name: t('sidebar.administration'),
              icon: 'userCircle',
              id: uniqueId(),
              url: '/',
              isPro: false,
              children: [
                {
                  name: t('sidebar.users'),
                  icon: 'userCircle',
                  id: uniqueId(),
                  url: '/admin/users',
                  isPro: false,
                },
              ],
            },
          ],
        },
      ]
    : []),
];

export default getSidebarContent;

// {
//   heading: 'Home',
//   children: [
//     {
//       name: 'Modern',
//       icon: 'solar:widget-2-linear',
//       id: uniqueId(),
//       url: '/',
//       isPro: false,
//     },
//   ],
// },
// {
//   heading: 'pages',
//   children: [
//     {
//       name: 'Tables',
//       icon: 'solar:server-linear',
//       id: uniqueId(),
//       url: '/utilities/table',
//     },
//     {
//       name: 'Form',
//       icon: 'solar:document-add-linear',
//       id: uniqueId(),
//       url: '/utilities/form',
//     },
//     {
//       id: uniqueId(),
//       name: 'User Profile',
//       icon: 'solar:user-circle-linear',
//       url: '/user-profile',
//       isPro: false,
//     },
//   ],
// },
// {
//   heading: 'Apps',
//   children: [
//     {
//       id: uniqueId(),
//       name: 'Notes',
//       icon: 'solar:notes-linear',
//       url: '/apps/notes',
//       isPro: false,
//     },
//     {
//       id: uniqueId(),
//       name: 'Tickets',
//       icon: 'solar:ticker-star-linear',
//       url: '/apps/tickets',
//       isPro: false,
//     },
//     {
//       name: 'Blogs',
//       id: uniqueId(),
//       icon: 'solar:sort-by-alphabet-linear',
//       children: [
//         {
//           id: uniqueId(),
//           name: 'Blog Post',
//           url: '/apps/blog/post',
//           isPro: false,
//         },
//         {
//           id: uniqueId(),
//           name: 'Blog Detail',
//           url: '/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
//           isPro: false,
//         },
//       ],
//     },
//   ],
// },
