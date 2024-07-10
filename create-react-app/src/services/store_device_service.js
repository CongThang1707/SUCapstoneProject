import axios from 'axios';

class storeDeviceService {
  async getStoreDevice(storeId) {
    try {
      const response = await axios.get(
        `https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/StoreDevices?storeId=${storeId}&pageNumber=1&pageSize=10`
      );

      return response.data;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }
}

export default storeDeviceService;
