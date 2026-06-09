package com.backend.product_service.repository;

import com.backend.product_service.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByStockGreaterThan(int stock);

    @Query("SELECT p FROM Product p WHERE p.stock > 0")
    List<Product> findAllInStock();
}
