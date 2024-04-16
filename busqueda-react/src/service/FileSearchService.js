import axios from "axios"

const baseUrl = 'http://localhost:8080';

class FileSearchService {
    
    uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post(`${baseUrl}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    searchPattern(fileContent, pattern) {
        return axios.post(`${baseUrl}/search?pattern=${pattern}`, fileContent);
    }
}

export default new FileSearchService();