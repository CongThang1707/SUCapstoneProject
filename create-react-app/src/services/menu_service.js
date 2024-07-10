import axios from 'axios';

class menuService {
  async getMenu(menuId) {
    try {
      const response = await axios.get(
        `https://ec2-3-1-81-96.ap-southeast-1.compute.amazonaws.com/api/Menus?brandId=${menuId}&pageNumber=1&pageSize=10`
      );

      return response.data;
    } catch (error) {
      console.log('Error message: ' + error.message);
    }
  }
}

export default menuService;
