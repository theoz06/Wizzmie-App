package com.wizzmie.server_app.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;


import com.wizzmie.server_app.DTO.Request.MenuRequest;

public interface OptionalGenericController<T, ID> {

    ResponseEntity<String> createMenu(String name, String description, Double price, Integer category_Id, Boolean isAvailable, MultipartFile image);
    ResponseEntity<String> updateMenu(ID id, MenuRequest request);

}
