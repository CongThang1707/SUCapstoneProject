import React, { useState, useEffect } from 'react';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import '../../assets/scss/template.scss';

import { Button } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import boxService from 'services/box_service';
import layerService from 'services/layer_service';
import templateService from 'services/template_service';
import boxItemService from 'services/box_item_service';
import layerItemService from 'services/layer_item_service';

function Template() {
  const [activeTab, setActiveTab] = useState(null);
  const { editor, onReady } = useFabricJSEditor();
  const [color, setColor] = useState('#35363a');
  const [templateId, setTemplateId] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const box_service = new boxService();
  const layer_service = new layerService();
  const template_service = new templateService();
  const box_item_service = new boxItemService();
  const layer_item_service = new layerItemService();

  // const cloudName = import.meta.env.VITE_CLOUD_NAME;
  // const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  const cloudName = 'dchov8fes';
  const uploadPreset = 'ml_default';

  const handleTabClick = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const createUserTemplate = async () => {
    try {
      const id = await template_service.createTemplate(
        2,
        'Demo',
        'Demo description',
        700,
        700,
        'https://t4.ftcdn.net/jpg/05/56/81/55/360_F_556815523_AYrXaaLIUESVAphY1jQ02wGJ5M8qMtTs.jpg'
      );

      setTemplateId(id);
      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const createLayer = async (layerType) => {
    try {
      const id = await layer_service.createLayer(templateId, 'LayerName', layerType);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const createLayerItem = async (layerId, layerItemValue) => {
    try {
      const id = await layer_item_service.createLayerItem(layerId, layerItemValue);

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const createBox = async (layerId, boxType) => {
    try {
      const id = await box_service.createBox(layerId, 200, 200, 200, 200, boxType, 100);
      // setBoxId(id);
      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const createBoxItem = async (boxId, textFormat, boxType) => {
    try {
      const id = await box_item_service.createBoxItem(boxId, 1, 20, textFormat, boxType, '#FFFFFF');

      return id;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const updateLayerItem = async (layerItemType, layerItemValue, layerItemId) => {
    try {
      const response = await layer_item_service.updateLayerItem(layerItemType, layerItemValue, layerItemId);

      console.log('Response: ', JSON.stringify(response));
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  const updateBox = async (boxId, boxPositionX, boxPositionY, boxWidth, boxHeight, boxMaxCapacity) => {
    try {
      const response = await box_service.updateBox(boxId, boxPositionX, boxPositionY, boxWidth, boxHeight, boxMaxCapacity);

      console.log('Response update box: ', JSON.stringify(response));
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  };

  useEffect(() => {
    createUserTemplate();

    document.addEventListener('keydown', detectKeydown);

    const uwScript = document.getElementById('uw');
    if (!loaded && !uwScript) {
      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('id', 'uw');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.addEventListener('load', () => setLoaded(true));
      document.body.appendChild(script);
    }
  }, []);

  // const detectKeydown = (e) => {
  //   console.log('key: ', e.key);
  // };

  const detectKeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      if (e.shiftKey) {
        // Redo (Ctrl + Shift + Z or Cmd + Shift + Z)
        console.log('Redo action');
        // Implement your redo functionality here
      } else {
        // Undo (Ctrl + Z or Cmd + Z)
        console.log('Undo action');
        // Implement your undo functionality here
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      // Redo (Ctrl + Y or Cmd + Y)
      console.log('Redo action');
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      // Treat Backspace and Delete as the same (Delete)
      console.log('Delete action');
      // Implement your redo functionality here
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      // Copy (Ctrl + C or Cmd + C)
      console.log('Copy action');
      // Implement your copy functionality here
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      console.log('Paste action');
    } else {
      console.log('key: ', e.key);
    }
  };

  // function Copy() {
  //   // clone what are you copying since you
  //   // may want copy and paste on different moment.
  //   // and you do not want the changes happened
  //   // later to reflect on the copy.
  //   canvas.getActiveObject().clone(function(cloned) {
  //     _clipboard = cloned;
  //   });
  // }

  // function Paste() {
  //   // clone again, so you can do multiple copies.
  //   _clipboard.clone(function(clonedObj) {
  //     canvas.discardActiveObject();
  //     clonedObj.set({
  //       left: clonedObj.left + 10,
  //       top: clonedObj.top + 10,
  //       evented: true,
  //     });
  //     if (clonedObj.type === 'activeSelection') {
  //       // active selection needs a reference to the canvas.
  //       clonedObj.canvas = canvas;
  //       clonedObj.forEachObject(function(obj) {
  //         canvas.add(obj);
  //       });
  //       // this should solve the unselectability
  //       clonedObj.setCoords();
  //     } else {
  //       canvas.add(clonedObj);
  //     }
  //     _clipboard.top += 10;
  //     _clipboard.left += 10;
  //     canvas.setActiveObject(clonedObj);
  //     canvas.requestRenderAll();
  //   });
  // }

  // const undo = () => {
  //   if (editor.canvas._objects.length > 0) {
  //     history.push(editor.canvas._objects.pop());
  //   }
  //   editor.canvas.renderAll();
  // };
  // const redo = () => {
  //   if (history.length > 0) {
  //     editor.canvas.add(history.pop());
  //   }
  // };

  // const removeSelectedObject = () => {
  //   editor.canvas.remove(editor.canvas.getActiveObject());
  // };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight('100%');
    editor.canvas.setWidth('100%');
    editor.canvas.renderAll();
    // createUserTemplate();
  }, []);

  const addBackgroundImage = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        img.scale(0.75);
        img.scaleX = editor.canvas.width / img.width;
        img.scaleY = editor.canvas.height / img.height;
        editor.canvas.add(img);
        editor.canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // const url = URL.createObjectURL(file);

      addBackgroundImage(file);
      // console.log('File url:', url);
      // console.log('File Name:', file.name);
      // console.log('File Type:', file.type);
      // console.log('File Size:', file.size);
      const layerId = await createLayer(templateId, 'BackGroundImage', 0);
      const layerItemId = await createLayerItem(layerId, file.name);
      console.log('layerId: ', layerId);
      console.log('layerItemId: ', layerItemId);
    }
  };

  const addImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        img.scale(0.75);
        editor.canvas.add(img);
        editor.canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // const url = URL.createObjectURL(file);

      addImage(file);
      // console.log('File url:', url);
      // console.log('File Name:', file.name);
      // console.log('File Type:', file.type);
      // console.log('File Size:', file.size);
      const layerId = await createLayer(1);
      const layerItemId = await createLayerItem(layerId, file.name);
      const boxId = await createBox(layerId, 0);
      console.log('layerId: ', layerId);
      console.log('layerItemId: ', layerItemId);
      console.log('boxId: ', boxId);
    }
  };

  const changeColor = (e) => {
    setColor(e.target.value);
    console.log(color);
    const o = editor.canvas.getActiveObject();
    o.set('fill', color);
    editor?.setStrokeColor(color);
    editor.canvas.renderAll();
  };

  const addText = async (title) => {
    console.log(title);
    setColor(color);
    const text = new fabric.Textbox('Text', {
      top: 300,
      left: 300,
      fill: color,
      width: 100,
      fontSize: 20,
      height: 100
    });

    editor.canvas.add(text);

    const layerId = await createLayer(3);
    const layerItemId = await createLayerItem(layerId, 'Text');
    const boxId = await createBox(layerId, 1);
    const boxItemId = await createBoxItem(boxId, 1, 0);
    console.log('Layer id: ', layerId);
    console.log('layer item id: ', layerItemId);
    console.log('Box id: ', boxId);
    console.log('Box item id: ', boxItemId);

    // editor.canvas.requestRenderAll();

    // text.on('changed', function () {
    //   console.log('Text changed to: ', text.text);
    //   // console.log('Left: ' + text.left + ' Top: ' + text.top);
    //   // console.log('Box id: ', boxId);
    //   // console.log('Layer id: ', layerId);
    //   // console.log('Box item id: ', boxItemId);
    //   // console.log('Layer item id: ', layerItemID);
    // });

    text.on('modified', function () {
      console.log('Left: ' + text.left + ' Top: ' + text.top);
      console.log('Text changed to: ', text.text);
      updateLayerItem(3, text.text, layerItemId);
      updateBox(boxId, text.left, text.top, text.width, text.height, 100);
    });

    console.log('Initial position: ', text.left, text.top);
    editor.canvas.renderAll();
  };

  const addRenderLayer = async () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'white',
      borderColor: 'dark',
      width: 200,
      height: 200
    });

    editor.canvas.add(rect);

    const layerId = await createLayer(2);
    const boxId = await createBox(layerId, 1);
    const box1 = await createBoxItem(boxId, 1, 0);
    const box2 = await createBoxItem(boxId, 0, 1);
    console.log('Layer id: ', layerId);
    console.log('Box id: ', boxId);
    console.log('Box item id: ', box1);
    console.log('Box item id: ', box2);
    // editor.canvas.renderAll();
  };

  const addMenuCollection = async () => {
    console.log('Added Menu Collection');

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#FFC5CB',
      borderColor: 'dark',
      width: 200,
      height: 200
    });

    editor.canvas.add(rect);

    const layerId = await createLayer(4);

    const boxId = await createBox(layerId, 1);
    const boxItemId = await createBoxItem(boxId, 1, 0);
    console.log('Layer id: ', layerId);
    console.log('Box id: ', boxId);
    console.log('Box item id: ', boxItemId);
  };

  const uploadWidget = () => {
    setIsDisabled(true);
    window.cloudinary.openUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url'],
        tags: ['myphotoalbum-react'],
        clientAllowedFormats: ['image'],
        resourceType: 'image'
      }
      // processResults
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Canva Clone: templateId: {templateId}</div>
        <div className="actions">
          <button className="save-btn">Save</button>
          <button className="share-btn">Share</button>

          <div className="profile">User</div>
        </div>
      </header>
      <div className="toolbar">
        <label htmlFor="font-size">Font Size:</label>
        <select id="font-size">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <label htmlFor="font-color">Font Color:</label>
        <input type="color" id="font-color" onChange={(e) => changeColor(e)} />
      </div>
      <div className="main">
        <div className="sidebar-container">
          <aside className="sidebar">
            <Button onClick={() => handleTabClick('text')} startIcon={<TextFieldsIcon />}>
              Text
            </Button>
            <Button onClick={() => handleTabClick('background')} startIcon={<ViewModuleIcon />}>
              Background
            </Button>
            <Button onClick={() => handleTabClick('images')} startIcon={<ImageIcon />}>
              Images
            </Button>
            <Button onClick={() => handleTabClick('elements')} startIcon={<CategoryIcon />}>
              Elements
            </Button>
            <Button onClick={() => handleTabClick('uploads')} startIcon={<CloudUploadIcon />}>
              Uploads
            </Button>
            <Button onClick={() => handleTabClick('renderLayer')} startIcon={<CloudUploadIcon />}>
              Render Layer
            </Button>
            <Button onClick={() => handleTabClick('menuCollection')} startIcon={<CloudUploadIcon />}>
              Menu Collection
            </Button>
          </aside>

          <div className={`tab-container ${activeTab ? 'open' : ''}`}>
            {activeTab === 'text' && (
              <div className="tab">
                <h4>Select a text style</h4>
                <button onClick={() => addText('Heading')}>Heading</button>
                <button onClick={() => addText('Subheading')}>Subheading</button>
                <button onClick={() => addText('Body Text')}>Body Text</button>
              </div>
            )}
            {activeTab === 'background' && (
              <div className="tab">
                <h4>Select a background image</h4>
                <input type="file" accept="image/*" onChange={handleBackgroundImageUpload} />
                <button
                  disabled={isDisabled}
                  className={`btn btn-primary ${isDisabled ? 'btn-disabled' : ''}`}
                  type="button"
                  onClick={uploadWidget}
                >
                  {isDisabled ? 'Opening Widget' : 'Upload Image'}
                </button>
              </div>
            )}
            {activeTab === 'images' && (
              <div className="tab">
                <h4>Select an image</h4>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
            )}
            {activeTab === 'elements' && (
              <div className="tab">
                <h4>Select an element</h4>
                <button>Element 1</button>
                <button>Element 2</button>
                <button>Element 3</button>
              </div>
            )}
            {activeTab === 'uploads' && (
              <div className="tab">
                <h4>Upload files</h4>
                <button>Upload 1</button>
                <button>Upload 2</button>
                <button>Upload 3</button>
              </div>
            )}
            {activeTab === 'renderLayer' && (
              <div className="tab">
                <h4>Render Layer</h4>
                <button
                  onClick={() => {
                    addRenderLayer();
                  }}
                >
                  CREATE RENDER LAYER
                </button>
              </div>
            )}
            {activeTab === 'menuCollection' && (
              <div className="tab">
                <h4>Menu Collection</h4>
                <button
                  onClick={() => {
                    addMenuCollection();
                  }}
                >
                  CREATE MENU COLLECTION
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={`canvas-area ${activeTab ? 'sidebar-open' : ''}`}>
          <div
            style={{
              width: '65%',
              height: '65%',
              background: '#f8f9fa'
            }}
          >
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Template;
