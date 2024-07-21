// assets
import { IconTemplate } from '@tabler/icons-react';

// constant
const icons = {
  IconTemplate
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const entities = {
  id: 'entities',
  title: 'Entities',
  type: 'group',
  children: [
    {
      id: 'entity-template',
      title: 'Template',
      type: 'item',
      url: '/entities/entity-template',
      icon: icons.IconTemplate,
      breadcrumbs: false
    }
  ]
};

export default entities;
