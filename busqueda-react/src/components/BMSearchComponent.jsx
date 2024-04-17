import React, { useState } from 'react';
import axios from 'axios';

const BMSearchComponent = () => {
    const [file, setFile] = useState(null);
    const [pattern, setPattern] = useState('');
    const [uploadStatus, setUploadStatus] = useState('Upload File');
    const [fileContent, setFileContent] = useState('');
    const [highlightedContent, setHighlightedContent] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePatternChange = (event) => {
        setPattern(event.target.value);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Por favor selecciona un archivo .txt para subir.');
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
                alert('Archivo cargado satisfactoriamente');
                if (Array.isArray(uploadResponse.data)) {
                    setFileContent(uploadResponse.data.join('\n'));
                } else {
                    setFileContent(uploadResponse.data);
                }
                setHighlightedContent('');
            } else {
                alert('Error al cargar el archivo.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error a la hora de cargar el archivo.');
        }
    };

    const handleSearch = async () => {
        if (!file || !pattern) {
            alert('Por favor ingresa alguna palabra letra o simbolo para buscar.');
            return;
        }
        

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pattern', pattern);

            const searchResponse = await axios.post('http://localhost:8080/search', formData);

            if (searchResponse.status === 200 && searchResponse.data) {
                const highlightedContent = searchResponse.data;
                setHighlightedContent(highlightedContent);
            } else {
                alert('No se ha encontrado ese patrón en el contenido del texto cargado.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during search');
        }
    };

    const handleReset = () => {
        setHighlightedContent(''); // Reiniciar el contenido subrayado
    };

    return (
        <div>
            <h2>Búsqueda de Patrones en Archivos</h2>

            <div>
                <label htmlFor="fileInput">Archivo .txt:</label>
                <input type="file" id="fileInput" accept=".txt" onChange={handleFileChange} />
            </div>

            <button onClick={handleUpload}>{uploadStatus}</button> <br />

            <div>
                <label htmlFor="patternInput">Patrón de búsqueda:</label>
                <input type="text" id="patternInput" value={pattern} onChange={handlePatternChange} />
            </div>

            <button onClick={handleSearch} disabled={uploadStatus !== 'Upload Complete'}>Buscar</button>

            <button onClick={handleReset}>Reiniciar</button>

            {fileContent && (
                <div>
                    <h4>Contenido del archivo</h4>
                    <div style={{ border: '1px solid #ccc', padding: '10px', overflow: 'auto', maxHeight: '300px' }}>
                        <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: highlightedContent || fileContent }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BMSearchComponent;
