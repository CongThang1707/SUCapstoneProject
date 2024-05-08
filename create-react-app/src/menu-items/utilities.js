// assets
import { IconUsers, IconBuildingStore, IconBrandMedium, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconBuildingStore,
  IconBrandMedium,
  IconWindmill
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
