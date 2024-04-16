package co.edu.unbosque.controller;

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

@Controller
@CrossOrigin("*")
public class BusquedaTextoController {

    @Autowired
    private BusquedaTextoService busquedaTextoService;

    @GetMapping("/")
    public String index() {
        return "index1";
    }

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file, Model model) {
        if (file.isEmpty()) {
            model.addAttribute("error", "Por favor seleccione un archivo para subir");
            return "index1";
        }

        try {
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            model.addAttribute("content", content);
            return "redirect:/showText"; // Redirigir a la página showText
        } catch (IOException e) {
            model.addAttribute("error", "Fallo al leer el archivo");
            return "error";
        }
    }

    @PostMapping("/search")
    public String search(@RequestParam("word") String word, @RequestParam("text") String text, Model model) {
        int count = busquedaTextoService.buscar(word, text);
        model.addAttribute("count", count);
        model.addAttribute("highlightedText", busquedaTextoService.resaltarPalabra(word, text));
        return "index1";
    }

    /*
    @GetMapping("/showText")
    public String showText(@ModelAttribute("content") String content) {
        return "showText";
    }
     */

    @GetMapping("/showText")
    public String showText(Model model) {
        String content = "Hola";
        model.addAttribute("content", content);
        return "showText";
    }
}
