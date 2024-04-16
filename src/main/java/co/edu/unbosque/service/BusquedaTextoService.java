package co.edu.unbosque.service;

import org.springframework.stereotype.Service;

@Service
public class BusquedaTextoService {

    public int buscar(String palabra, String texto) {
        int count = 0;
        int longitudTexto = texto.length();
        int longitudPalabra = palabra.length();
        int[] malCaracter = heuristicaMalCaracter(palabra);

        int desplazamiento = 0;

        while (desplazamiento <= (longitudTexto - longitudPalabra)) {
            int j = longitudPalabra - 1;

            while (j >= 0 && palabra.charAt(j) == texto.charAt(desplazamiento+ j))
                j++;

            if (j < 0) { // si la palabra se encuentra
                count++;
                desplazamiento += (desplazamiento + longitudPalabra < longitudTexto) ? longitudPalabra -
                        malCaracter[texto.charAt(desplazamiento + longitudPalabra)] : 1;
            } else {
                desplazamiento += Math.max(1, j - malCaracter[texto.charAt(desplazamiento + j)]);
            }
        }
        return count;
    }

    public String resaltarPalabra(String palabra, String texto) {
        StringBuilder textoResaltado = new StringBuilder(texto);
        int longitudTexto = texto.length();
        int longitudPalabra = palabra.length();
        int[] malCaracter = heuristicaMalCaracter(palabra);

        int desplazamiento = 0;

        while (desplazamiento <= (longitudTexto - longitudPalabra)) {
            int j = longitudPalabra - 1;

            while (j >= 0 && palabra.charAt(j) == texto.charAt(desplazamiento + j))
                j--;

            if (j < 0) {
                for (int i = 0; i < longitudPalabra; i++) {
                    textoResaltado.setCharAt(desplazamiento + i,
                            Character.toUpperCase(texto.charAt(desplazamiento + i)));
                }
                desplazamiento += (desplazamiento + longitudPalabra < longitudTexto) ?
                        longitudPalabra - malCaracter[texto.charAt(desplazamiento + longitudPalabra)] : 1;
            } else {
                desplazamiento += Math.max(1, j - malCaracter[texto.charAt(desplazamiento + j)]);
            }
        }
        return textoResaltado.toString();
    }

    private int[] heuristicaMalCaracter(String palabra) {
        int m = palabra.length();
         int[] malCaracter = new int[256];

        for (int i = 0; i < 256; i++) {
            malCaracter[i] = -1;
        }

        for (int i = 0; i < m; i++) {
            malCaracter[palabra.charAt(i)] = i;
        }

        return malCaracter;
    }
}
