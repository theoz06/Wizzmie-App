package com.wizzmie.server_app.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import lombok.Data;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String name;
    private Integer nik;
    private String role;
}
