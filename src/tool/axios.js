const axios = require('axios');
require('dotenv').config();
const getDetailEmployee = async (nip) => {
    try {
        const erpApi = process.env.ERP_API;
        const result = await axios(`${erpApi}/detail_employee?nip=${nip}`)
        if (!result.data.state) {
            throw result.data.message
        }
        return result.data.data;
    } catch (error) {
        throw error.message;
    }
}

module.exports = {
    getDetailEmployee
}