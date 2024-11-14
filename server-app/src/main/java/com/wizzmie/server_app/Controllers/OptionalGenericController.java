package com.wizzmie.server_app.Controllers;

import org.springframework.http.ResponseEntity;

import com.wizzmie.server_app.DTO.Request.MenuRequest;

public interface OptionalGenericController<T, ID> {

    ResponseEntity<String> createMenu(MenuRequest request);
    ResponseEntity<String> updateMenu(ID id, MenuRequest request);

}
