package com.wizzmie.server_app.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;


public interface OptionalGenericController<T, ID> {

    ResponseEntity<String> createMenu(String name, String description, Double price, Integer category_Id, Boolean isAvailable, MultipartFile image);
    ResponseEntity<String> updateMenu(ID id, String name, String description, Double price, Integer category_Id, Boolean isAvailable, MultipartFile image);

}
