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

const SidebarContent: MenuItem[] = [
  // ==================== NON-PRO SECTIONS ====================
  {
    // heading: 'Out Patient',
    children: [
      {
        name: 'Out patient',
        icon: 'solar:chart-2-linear',
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
        name: 'Laboratory',
        icon: 'solar:test-tube-linear',
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
        name: 'Radiology',
        icon: 'solar:scanner-linear',
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
        name: 'Emergency',
        icon: 'solar:emergency-linear',
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
        name: 'Physiotherapy',
        icon: 'solar:physiotherapy-linear',
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
        name: 'Pharmacy',
        icon: 'solar:pill-linear',
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
        name: 'Drug Store',
        icon: 'solar:drug-store-linear',
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
        name: 'Inventory',
        icon: 'solar:buildings-2-outline',
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
        name: 'General Ledger',
        icon: 'solar:notebook-bookmark-line-duotone',
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
        name: 'Insurance',
        icon: 'solar:shield-plus-linear',
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
        name: 'Statistics',
        icon: 'solar:chart-2-linear',
        id: uniqueId(),
        url: '/',
        isPro: false,
        children: [
          {
            name: 'Holy Capital Hospital Statistics',
            icon: 'solar:hospital-linear',
            id: uniqueId(),
            url: '/statistics/holy-capital-hospital',
            isPro: false,
          },
          {
            name: 'Doctor Statistics',
            icon: 'solar:doctor-linear',
            id: uniqueId(),
            url: '#',
            isPro: false,
          },
        ],
      },
    ],
  },
  {
    // heading: 'Administration',
    children: [
      {
        name: 'Administration',
        icon: 'solar:user-circle-linear',
        id: uniqueId(),
        url: '/',
        isPro: false,
        children: [
          {
            name: 'Users',
            icon: 'solar:user-circle-linear',
            id: uniqueId(),
            url: '/admin/users',
            isPro: false,
          },
        ],
      },
    ],
  },
];

export default SidebarContent;

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
