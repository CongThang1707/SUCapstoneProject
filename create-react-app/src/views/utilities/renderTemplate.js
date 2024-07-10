import React, { useEffect } from 'react';
import '../../assets/scss/renderTemplate.scss';
import boxService from 'services/box_service';
import layerService from 'services/layer_service';
import templateService from 'services/template_service';
import boxItemService from 'services/box_item_service';
import storeDeviceService from 'services/store_device_service';
import menuService from 'services/menu_service';
import collectionService from 'services/collection_service';
import displayService from 'services/display_service';
// import layerItemService from 'services/layer_item_service';

import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';

function GetTemplate() {
  const { editor, onReady } = useFabricJSEditor();

  const box_service = new boxService();
  const layer_service = new layerService();
  const template_service = new templateService();
  const box_item_service = new boxItemService();
  const store_device_service = new storeDeviceService();
  const menu_service = new menuService();
  const collection_service = new collectionService();
  const display_service = new displayService();
  //   const layer_item_service = new layerItemService();

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight('100%');
    editor.canvas.setWidth('100%');
    editor.canvas.renderAll();
    // createUserTemplate();
  }, []);

  useEffect(() => {
    getTemplate();
    getLayer();
    getBox();
    getBoxItem();
    getStoreDevice();
    getMenu();
    getCollection();
    createDisplay();
  }, []);

  const createDisplay = async () => {
    try {
      const id = await display_service.createDisplay(1, 11, 1, 100, 10);

      console.log('Collection data: ', JSON.stringify(id));

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const getCollection = async () => {
    try {
      const id = await collection_service.getCollection(1);

      console.log('Collection data: ', JSON.stringify(id));

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const getMenu = async () => {
    try {
      const id = await menu_service.getMenu(2);

      console.log('Menu data: ', JSON.stringify(id));

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const getStoreDevice = async () => {
    try {
      const id = await store_device_service.getStoreDevice(1);

      console.log('Store Device data: ', JSON.stringify(id));

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const getTemplate = async () => {
    try {
      const id = await template_service.getTemplate(12);

      console.log('Template data: ', id);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const getLayer = async () => {
    try {
      const id = await layer_service.getLayer(12);

      console.log('Layer data: ', id);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  //   const getLayerItem = async () => {
  //     try {
  //       const id = await layer_item_service.getLayerItem();

  //       console.log('layer-item data: ', id);

  //       return id;
  //     } catch (error) {
  //       console.log('Error message: ' + error.message);
  //     }
  //   };

  const getBox = async () => {
    try {
      const id = await box_service.getBox(12);

      console.log('Box data: ', id);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const getBoxItem = async () => {
    try {
      const id = await box_item_service.getBoxItem(30);

      console.log('box-item data: ', id);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  return (
    <div
      style={{
        width: '700px',
        height: '700px',
        background: '#f8f9fa',
        marginTop: '0%',
        border: '2px solid black'
      }}
    >
      <FabricJSCanvas className="sample-canvas" onReady={onReady} />
    </div>
  );
}

export default GetTemplate;
