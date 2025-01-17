package com.wizzmie.server_app.Controllers.Implements;

import java.util.ArrayList;
import java.util.List;

import com.wizzmie.server_app.DTO.Request.UserRequest;
import com.wizzmie.server_app.DTO.Respon.UserResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wizzmie.server_app.Services.Implements.UserServiceImpl;

@RestController
@RequestMapping("api/admin")
public class UserController {
    
    private UserServiceImpl userServiceImpl;

    public UserController(UserServiceImpl userServiceImpl) {
        this.userServiceImpl = userServiceImpl;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAll(){
        try{
            List<UserResponse> users = userServiceImpl.getAll();
            if(users.isEmpty()){
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        }catch(ResponseStatusException e){
            return new ResponseEntity<>(new ArrayList<>(), e.getStatus());
        }
    }

    @PostMapping("/user/create")
    public ResponseEntity<String> create(@RequestBody UserRequest userRequest){
        try{
            userServiceImpl.create(userRequest);
            return new ResponseEntity<>("User Created!", HttpStatus.CREATED);
        }catch(ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    @PutMapping("/user/update/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id ,@RequestBody UserRequest userRequest){
        try{
            userServiceImpl.update(id, userRequest);
            return new ResponseEntity<>("User Updated!", HttpStatus.OK);
        }catch(ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    @DeleteMapping("/user/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id){
        try{
            userServiceImpl.delete(id);
            return new ResponseEntity<>("User Deleted!", HttpStatus.OK);
        }catch(ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }
}
