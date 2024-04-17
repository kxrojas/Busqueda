package co.edu.unbosque.controller;

import co.edu.unbosque.model.BMAlgorithm;
import co.edu.unbosque.service.BusquedaTextoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RestController
public class BusquedaTextoController {

    @Autowired
    private BusquedaTextoService busquedaTextoService;

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        StringBuilder fileContentBuilder = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            while ((line = br.readLine()) != null) {
                fileContentBuilder.append(line).append("\n");
            }
        }
        return fileContentBuilder.toString();
    }


    @PostMapping("/search")
    public String searchPattern(@RequestParam("file") MultipartFile file, @RequestParam("pattern") String pattern) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        String fileContent = uploadFile(file);

        String highlightedContent = busquedaTextoService.buscarTextoEnArchivo(fileContent, pattern);
        return highlightedContent;
    }

}
