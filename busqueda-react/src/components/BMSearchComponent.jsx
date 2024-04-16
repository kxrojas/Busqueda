import React, { useState } from 'react';
import axios from 'axios';

const BMSearchComponent = () => {
    const [file, setFile] = useState(null);
    const [pattern, setPattern] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('Upload File');
    const [fileContent, setFileContent] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePatternChange = (event) => {
        setPattern(event.target.value);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (uploadResponse.status === 200) {
                setUploadStatus('Upload Complete');
                alert('File uploaded successfully');
                if (Array.isArray(uploadResponse.data)) {
                    setFileContent(uploadResponse.data.join('\n'));
                } else {
                    setFileContent(uploadResponse.data);
                }
            } else {
                alert('Failed to upload file');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during upload');
        }
    };

    const handleSearch = async () => {
        if (!file || !pattern) {
            alert('Please select a file and enter a search pattern');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pattern', pattern); // Agregar el patrón de búsqueda al FormData

            const searchResponse = await axios.post('http://localhost:8080/search', formData);

            if (searchResponse.status === 200 && searchResponse.data.highlightedContent) {
                const highlightedContent = searchResponse.data.highlightedContent;
                setFileContent(highlightedContent);
            } else {
                alert('Failed to perform search or search response does not contain highlighted content');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during search');
        }
    };

    return (
        <div>
            <h2>Búsqueda de Patrones en Archivos</h2>

            <div>
                <label htmlFor="fileInput">Archivo:</label>
                <input type="file" id="fileInput" onChange={handleFileChange} />
            </div>

            <button onClick={handleUpload}>{uploadStatus}</button> <br />

            <div>
                <label htmlFor="patternInput">Patrón de búsqueda:</label>
                <input type="text" id="patternInput" value={pattern} onChange={handlePatternChange} />
            </div>

            <button onClick={handleSearch} disabled={uploadStatus !== 'Upload Complete'}>Buscar</button>

            {fileContent && (
                <div>
                    <h4>Contenido del archivo</h4>
                    <pre>{fileContent}</pre>
                </div>
            )}

            {searchResults.length > 0 && (
                <div>
                    <h4>Resultados de búsqueda</h4>
                    <div>
                        {searchResults.map((result, index) => (
                            <div key={index}>{result}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BMSearchComponent;


