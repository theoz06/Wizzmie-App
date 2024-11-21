package com.wizzmie.server_app.Controllers.Implements;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wizzmie.server_app.Services.EnumRole;

@RestController
@RequestMapping("/api/role")
public class RoleEnumController {
    @GetMapping
    public List<String> getRoles() {
        return Arrays.stream(EnumRole.values())
                     .filter(role -> !"Customer".equalsIgnoreCase(role.getUsersRole()))
                     .map(EnumRole::getUsersRole) 
                     .collect(Collectors.toList());
    }
}
