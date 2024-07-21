import axios from 'axios';

class displayService {
  async getDisplayById(displayId) {
    try {
      const response = await axios.get(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Displays/V2/${displayId}/image`);
      const result = response.data;
      console.log('Display data: ', result);
      return result;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }

  async createDisplay(storeDeviceId, menuId, collectionId, templateId, activeHour) {
    const reqBody = {
      storeDeviceId: storeDeviceId,
      menuId: menuId,
      collectionId: collectionId,
      templateId: templateId,
      activeHour: activeHour
    };

    try {
      const response = await axios.post(`https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Displays`, reqBody);

      return response.data;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }
}

export default displayService;