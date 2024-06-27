package it.epicode.capstone.initializer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.epicode.capstone.entity.Product;
import it.epicode.capstone.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.List;

@Component
public class DataInitializer {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public DataInitializer(ProductRepository productRepository, ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        if (productRepository.count() == 0) {
            List<Product> products = loadProductsFromJSON("src/main/resources/products.json");
            if (products != null) {
                productRepository.saveAll(products);
            }
        }
    }

    private List<Product> loadProductsFromJSON(String filePath) {
        try {
            return objectMapper.readValue(new File(filePath), new TypeReference<List<Product>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
