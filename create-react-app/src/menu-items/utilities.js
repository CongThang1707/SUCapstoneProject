// assets
import { IconUsers, IconBuildingStore, IconBrandMedium, IconWindmill, IconPackage, IconTemplate } from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconBuildingStore,
  IconBrandMedium,
  IconWindmill,
  IconPackage,
  IconTemplate
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Users',
      type: 'item',
      url: '/utils/util-typography',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'util-color',
      title: 'Brands',
      type: 'item',
      url: '/utils/util-color',
      icon: icons.IconBrandMedium,
      breadcrumbs: false
    },
    {
      id: 'util-shadow',
      title: 'Stores',
      type: 'item',
      url: '/utils/util-shadow',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },

    {
      id: 'util-product',
      title: 'Products',
      type: 'item',
      url: '/utils/util-product',
      icon: icons.IconPackage,
      breadcrumbs: false
    },
    {
      id: 'util-make-new-template',
      title: 'Templates',
      type: 'item',
      url: 'pages/template',
      icon: icons.IconTemplate,
      breadcrumbs: false
    },
    {
      id: 'util-display',
      title: 'Display',
      type: 'item',
      url: 'pages/choose-template',
      icon: icons.IconWindmill,
      breadcrumbs: false
    },
    {
      id: 'icons',
      title: 'Icons',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'tabler-icons',
          title: 'Tabler Icons',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'material-icons',
          title: 'Material Icons',
          type: 'item',
          external: true,
          target: '_blank',
          url: 'https://mui.com/material-ui/material-icons/',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default utilities;
