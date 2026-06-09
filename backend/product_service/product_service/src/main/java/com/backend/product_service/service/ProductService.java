package com.backend.product_service.service;

import com.backend.product_service.exception.InsufficientStockException;
import com.backend.product_service.exception.ProductNotFoundException;
import com.backend.product_service.model.Product;
import com.backend.product_service.repository.ProductRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.naming.InsufficientResourcesException;
import java.util.List;
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(()->new ProductNotFoundException(id));
    }

    public List<Product> getInStockProducts() {
        return productRepository.findAllInStock();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    public Product createProduct(@Valid Product product) {
        log.info("Creating new product: {}",product.getName());
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, @Valid Product updated) {
        Product existing=getProductById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setStock(updated.getStock());
        existing.setImageUrl(updated.getImageUrl());
        log.info("Updated product id: {}",id);
        return productRepository.save(existing);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if(!productRepository.existsById(id)){
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
        log.info("Deleted product id: {}",id);
    }

    @Transactional
    public Boolean reduceStock(Long id, int quantity) {
        Product product=getProductById(id);
        if(product.getStock()<quantity){
            throw new InsufficientStockException(id,quantity,product.getStock());
        }
        product.setStock(product.getStock()-quantity);
        productRepository.save(product);
        log.info("Reduced stock of product {} by {},Remanining: {}",product,quantity,product.getStock());
        return true;
    }
}
