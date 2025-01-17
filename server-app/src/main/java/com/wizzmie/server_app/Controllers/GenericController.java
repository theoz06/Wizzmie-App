package com.wizzmie.server_app.Controllers;

import java.util.List;
import java.util.Map;


import org.springframework.http.ResponseEntity;

public interface GenericController<T, ID> {
    ResponseEntity<List<T>> getAll();
    ResponseEntity<T> create (T entity);
    ResponseEntity<Map<String, Object>> update (ID id, T entity);
    ResponseEntity<String> delete (ID id);
}
