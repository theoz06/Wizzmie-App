package com.wizzmie.server_app.Services.Implements;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.DTO.Request.UserRequest;
import com.wizzmie.server_app.DTO.Respon.UserResponse;
import com.wizzmie.server_app.Entity.User;
import com.wizzmie.server_app.Repository.UserRepository;
import com.wizzmie.server_app.Services.EnumRole;



@Service
public class UserServiceImpl {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;


	public List<UserResponse> getAll() {
		List<User> users = userRepository.findAll();
		return users.stream().map(
            (user) -> new UserResponse(
                user.getId(),
                user.getName(),
                user.getNik(),
                user.getRole().getUsersRole().toUpperCase() 
            )
        ).collect(Collectors.toList());

	}

	
	public User create(UserRequest userRequest ) {
		String generatedNik = generateEmployeeNik();
		Optional<User> users = userRepository.findByNik(generatedNik);
		
		if(users.isPresent()){
			throw new RuntimeException("users with nik : " + userRequest.getNik() + "already exist!");
		}

		User user = new User();
		user.setName(userRequest.getName());
		user.setNik(generatedNik.toString());
		user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

		EnumRole role = EnumRole.fromString(userRequest.getRole());
		user.setRole(role);

		return userRepository.save(user);
	}

	
	public User update(Integer id, UserRequest userRequest) {
		User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User Not Found!"));

		user.setName(userRequest.getName());

		EnumRole role = EnumRole.fromString(userRequest.getRole().toUpperCase());
		user.setRole(role);

		return userRepository.save(user);
	}

	public String delete(Integer id) {
		User user = userRepository.findById(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found!"));
		userRepository.delete(user);
		return ("User Deleted!");
	}

	private String generateEmployeeNik(){
		String nik;
		do{
			nik = String.valueOf((int) ((Math.random() * 999999) + 1000));
		}while(userRepository.findByNik(nik).isPresent());
		return nik;
	}

    
}
