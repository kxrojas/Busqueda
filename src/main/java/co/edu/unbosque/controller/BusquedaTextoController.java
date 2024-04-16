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
    private BMAlgorithm bmAlgorithm;

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
    public String searchPattern(@RequestParam("fileContent") String fileContent, @RequestParam("pattern") String pattern) throws IOException {
        List<Integer> offsets = new ArrayList<>();
        BMAlgorithm bmAlgorithm = new BMAlgorithm();

        // Convert pattern to char array
        char[] patternChars = pattern.toCharArray();

        // Perform search using Boyer-Moore algorithm
        bmAlgorithm.search(fileContent, String.valueOf(patternChars));
        offsets.addAll(bmAlgorithm.offsets);

        // Highlight the pattern in the file content
        String highlightedContent = fileContent;
        for (Integer offset : offsets) {
            highlightedContent = highlightPattern(highlightedContent, pattern, offset);
        }

        return highlightedContent;
    }

    private String highlightPattern(String fileContent, String pattern, int offset) {
        StringBuilder highlightedContent = new StringBuilder(fileContent);
        highlightedContent.insert(offset + pattern.length(), "</span>");
        highlightedContent.insert(offset, "<span style=\"background-color: yellow\">");
        return highlightedContent.toString();
    }
}
