package com.wizzmie.server_app.Services;

import java.util.List;


public interface GenericService<T, ID> {
    List<T> getAll();
    T create (T entity);
    T update (ID id, T entity);
    String delete (ID id);
}
