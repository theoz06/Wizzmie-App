package com.wizzmie.server_app.Services;

import org.springframework.web.multipart.MultipartFile;

import com.wizzmie.server_app.DTO.Request.MenuRequest;

public interface OptionalGenericService<T, ID> {

    T CreateMenu(MenuRequest request, MultipartFile image);
    T UpdateMenu(ID id, MenuRequest request, MultipartFile image);
}
