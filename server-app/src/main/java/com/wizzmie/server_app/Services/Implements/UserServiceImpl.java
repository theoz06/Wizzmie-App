package com.wizzmie.server_app.Services.Implements;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.DTO.Request.UserRequest;
import com.wizzmie.server_app.DTO.Respon.RoleResponse;
import com.wizzmie.server_app.DTO.Respon.UserResponse;
import com.wizzmie.server_app.Entity.User;
import com.wizzmie.server_app.Repository.UserRepository;
import com.wizzmie.server_app.Services.EnumRole;



@Service
public class UserServiceImpl {

	@Autowired
	private UserRepository userRepository;


	public List<UserResponse> getAll() {
		List<User> users = userRepository.findAll();
		return users.stream().map(
            (user) -> new UserResponse(
                user.getId(),
                user.getName(),
                user.getNik(),
                user.getRole().getUsersRole() 
            )
        ).collect(Collectors.toList());

	}

	
	public User create(UserRequest userRequest ) {
		Integer generatedNik = generateEmployeeNik();
		Optional<User> users = userRepository.findByNik(userRequest.getNik());
		
		if(users.isPresent()){
			throw new RuntimeException("users with nik : " + userRequest.getNik() + "already exist!");
		}

		User user = new User();
		user.setName(userRequest.getName());
		user.setNik(generatedNik);

		EnumRole role = EnumRole.fromString(userRequest.getRole());
		user.setRole(role);

		return userRepository.save(user);
	}

	
	public User update(Integer id, UserRequest userRequest) {
		User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User Not Found!"));

		user.setName(userRequest.getName());
		user.setNik(userRequest.getNik());

		EnumRole role = EnumRole.fromString(userRequest.getRole());
		user.setRole(role);

		return userRepository.save(user);
	}

	public String delete(Integer id) {
		User user = userRepository.findById(id).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found!"));
		userRepository.delete(user);
		return ("User Deleted!");
	}

	private Integer generateEmployeeNik(){
		Integer nik;
		do{
			nik = (int) ((Math.random() * 999999) + 1000);
		}while(userRepository.findByNik(nik).equals(nik));
		return nik;
	}

    
}
