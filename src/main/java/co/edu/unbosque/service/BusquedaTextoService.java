package co.edu.unbosque.service;

import co.edu.unbosque.model.BMAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Stack;

@Service
public class BusquedaTextoService {

    private BMAlgorithm bmAlgorithm;

    public BusquedaTextoService() {
        this.bmAlgorithm = new BMAlgorithm();
    }

    public String buscarTextoEnArchivo(String textoArchivo, String textoABuscar, boolean caseSensitive) {
        if (!caseSensitive) {
            textoArchivo = textoArchivo.toLowerCase();
            textoABuscar = textoABuscar.toLowerCase();
        }

        bmAlgorithm.search(textoArchivo, textoABuscar);
        Stack<Integer> offsets = bmAlgorithm.offsets;
        StringBuilder resultadoResaltado = new StringBuilder(textoArchivo);

        if (offsets.isEmpty()) {
            return null;
        }

        while (!offsets.isEmpty()) {
            int indiceEncontrado = offsets.pop();
            resultadoResaltado = new StringBuilder(resaltarTexto(resultadoResaltado.toString(), indiceEncontrado, textoABuscar.length()));
        }

        return resultadoResaltado.toString();
    }


    private String resaltarTexto(String texto, int indiceEncontrado, int longitudPatron) {
        StringBuilder textoResaltado = new StringBuilder();
        textoResaltado.append(texto.substring(0, indiceEncontrado));
        textoResaltado.append("<span style=\"background-color: yellow;\">");
        textoResaltado.append(texto.substring(indiceEncontrado, indiceEncontrado + longitudPatron));
        textoResaltado.append("</span>");
        textoResaltado.append(texto.substring(indiceEncontrado + longitudPatron));
        return textoResaltado.toString();
    }
}
