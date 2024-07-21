import { useEffect, useState } from 'react';
import menuService from 'services/menu_service';
import storeDeviceService from 'services/store_device_service';
// import displayService from 'services/display_service';
const Display = () => {
  const [menus, setMenus] = useState([]);
  const [storeDevices, setStoreDevices] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [selectedStoreDevice, setSelectedStoreDevice] = useState('');

  const menu_service = new menuService();
  const store_device = new storeDeviceService();
  //   const display_service = new displayService();
  //   const [display, setDisplay] = useState(null);

  useEffect(() => {
    getAllMenus();
    getAllStoreDevice();
    // getDisplayById();
  }, []);

  //   const getDisplayById = async () => {
  //     await display_service.getDisplayById(302).then((data) => {
  //       setDisplay(data);
  //     });
  //   };

  const getAllMenus = async () => {
    await menu_service.getAllByBrand(1).then((data) => {
      setMenus(data);
      console.log('menus: ', menus);
    });
  };

  const getAllStoreDevice = async () => {
    await store_device.getAllStoreDevice().then((data) => {
      setStoreDevices(data);
      console.log('devices: ', storeDevices);
    });
  };

  const handleMenuChange = (e) => {
    setSelectedMenu(e.target.value);
    console.log('Selected Menu ID:', selectedMenu);
  };

  const handleStoreDeviceChange = (e) => {
    setSelectedStoreDevice(e.target.value);
    console.log('Selected Store Device ID:', selectedStoreDevice);
  };

  return (
    <div>
      <div>
        <label htmlFor="menuSelect">Select Menu:</label>
        <select id="menuSelect" onChange={handleMenuChange}>
          {menus.map((menu) => (
            <option key={menu.menuId} value={menu.menuId}>
              {menu.menuName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="deviceSelect">Select Store Device:</label>
        <select id="deviceSelect" onChange={handleStoreDeviceChange}>
          {storeDevices.map((device) => (
            <option key={device.storeDeviceId} value={device.storeDeviceId}>
              {device.storeDeviceName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Display;
