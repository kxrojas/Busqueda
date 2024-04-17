import React, { useState } from 'react';
import axios from 'axios';

const BMSearchComponent = () => {
    const [file, setFile] = useState(null);
    const [pattern, setPattern] = useState('');
    const [uploadStatus, setUploadStatus] = useState('Upload File');
    const [fileContent, setFileContent] = useState('');
    const [highlightedContent, setHighlightedContent] = useState('');
    const [caseSensitive, setCaseSensitive] = useState(false);

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
            alert('Por favor ingresa alguna palabra, letra o símbolo para buscar.');
            return;
        }
        

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pattern', pattern);
            formData.append('caseSensitive', caseSensitive); 

            const searchResponse = await axios.post('http://localhost:8080/search', formData);

            if (searchResponse.status === 200 && searchResponse.data) {
                const highlightedContent = searchResponse.data;
                setHighlightedContent(highlightedContent);
            } else {
                alert('No se ha encontrado ese patrón en el contenido del texto cargado.');
            }
        } catch (error) {
            console.error(error);
            alert('Error durante la búsqueda del patrón');
        }
    };

    const handleReset = () => {
        setHighlightedContent(''); 
    };

    return (
        <div>
            <h2>Búsqueda de Patrones en Archivos</h2><br />
            <div class="container text-center py-2">
                <div class="row">
                    <div class="col">
                        <div class="input-group mb-3">
                            <label class="input-group-text" htmlFor="patternInput">Upload</label>
                            <input type="file" class="form-control" id="fileInput" accept=".txt" onChange={handleFileChange} />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col py-3">
                        <button onClick={handleUpload}>{uploadStatus}</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Patrón de búsqueda</span>
                            <input type="text" class="form-control" placeholder="Buscar" aria-label="Username" aria-describedby="basic-addon1" id="patternInput" value={pattern} onChange={handlePatternChange}/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="d-grid gap-3 col-6 mx-auto">
                            <button onClick={handleSearch} disabled={uploadStatus !== 'Upload Complete'}>Buscar</button>
                            <button onClick={handleReset}>Reiniciar</button>
                            <div class="form-check form-switch">
                                <label class="form-check-label" for="flexSwitchCheckDefault">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="flexSwitchCheckDefault"
                                        checked={caseSensitive}
                                        onChange={(e) => setCaseSensitive(e.target.checked)}
                                    />
                                    Case Sensitive
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                    
                    </div>
                </div>
            </div>

            {fileContent && (
                <div>
                    <h4>Contenido del archivo</h4>
                    <div style={{ border: '1px solid #ccc', padding: '10px', overflow: 'auto', maxHeight: '300px' }}>
                        <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: highlightedContent || fileContent }} />
                    </div>
                    {occurrenceCount !== null && (
                        <div>
                            <p>La palabra buscada aparece {occurrenceCount === 1 ? '1 vez' : `${occurrenceCount} veces`}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BMSearchComponent;
