package com.wizzmie.server_app.Services;

import com.wizzmie.server_app.DTO.Request.MenuRequest;

public interface OptionalGenericService<T, ID> {

    T CreateMenu(MenuRequest request);
    T UpdateMenu(ID id, MenuRequest request);
}
