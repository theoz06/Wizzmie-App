package com.wizzmie.server_app.Services.Implements;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Request.UserRequest;
import com.wizzmie.server_app.Entity.Role;
import com.wizzmie.server_app.Entity.User;
import com.wizzmie.server_app.Repository.RoleRepository;
import com.wizzmie.server_app.Repository.UserRepository;


@Service
public class UserServiceImpl {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;



	public List<User> getAll() {
		return userRepository.findAll();
	}

	
	public User create(UserRequest userRequest ) {
		Optional<User> users = userRepository.findByNik(userRequest.getNik());
		
		if(users.isPresent()){
			throw new RuntimeException("users with nik : " + userRequest.getNik() + "already exist!");
		}

		User user = new User();
		user.setName(userRequest.getName());
		user.setNik(userRequest.getNik());

		Role role = roleRepository.findById(userRequest.getRole()).orElseThrow(()-> new RuntimeException("Role Not Found"));
		user.setRole(role);

		return userRepository.save(user);
	}

	
	public User update(Integer id, UserRequest userRequest) {
		User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User Not Found!"));

		user.setName(userRequest.getName());
		user.setNik(userRequest.getNik());

		Role role = roleRepository.findById(userRequest.getRole()).orElseThrow(()-> new RuntimeException("Role Not Found"));
		user.setRole(role);

		return userRepository.save(user);
	}

	public String delete(Integer id) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'delete'");
	}

    
}
