package com.wizzmie.server_app.Controllers.Implements;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;



import com.wizzmie.server_app.Controllers.GenericController;
import com.wizzmie.server_app.Controllers.OptionalGenericController;
import com.wizzmie.server_app.DTO.Request.MenuRequest;
import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Services.Implements.MenuServiceImpl;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("api/menu")
public class MenuController implements GenericController<Menu, Integer>, OptionalGenericController<Menu, Integer> {

    private MenuServiceImpl menuServiceImpl;

    @Override
    @GetMapping("/public")
    public ResponseEntity<List<Menu>> getAll() {
        try {
            List<Menu> menus = menuServiceImpl.getAll();
            return new ResponseEntity<>(menus, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(new ArrayList<>() , e.getStatus());
        }
    }

    @Override
    @PostMapping("/admin/create")
    public ResponseEntity<String> createMenu(@RequestParam("name") String name,
    @RequestParam("description") String description,
    @RequestParam("price") Double price,
    @RequestParam("category_id") Integer categoryId,
    @RequestParam("isAvailable") Boolean isAvailable,
    @RequestParam("image") MultipartFile image) {
        try {
            MenuRequest request = new MenuRequest();
            request.setName(name);
            request.setDescription(description);
            request.setPrice(price);
            request.setCategoryId(categoryId);
            request.setIsAvailable(isAvailable);
            

            menuServiceImpl.CreateMenu(request, image);
            return new ResponseEntity<>("Menu Created!", HttpStatus.CREATED);
        }catch(ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }
    
    @Override
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<String> updateMenu(@PathVariable("id") Integer id, @RequestParam("name") String name,
        @RequestParam("description") String description,
        @RequestParam("price") Double price,
        @RequestParam("categoryId") Integer categoryId,
        @RequestParam("isAvailable") Boolean isAvailable,
        @RequestParam("image") MultipartFile image){

        try {
            MenuRequest request = new MenuRequest();
            request.setName(name);
            request.setDescription(description);
            request.setPrice(price);
            request.setCategoryId(categoryId);
            request.setIsAvailable(isAvailable);

            menuServiceImpl.UpdateMenu(id, request, image);
            return new ResponseEntity<>("Menu Update", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    @Override
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        try {
            menuServiceImpl.delete(id);
            return new ResponseEntity<>("Menu Deleted!", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    //Not Use
    @Override
    public ResponseEntity<Menu> create(Menu entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }


    //Not Use
    @Override
    public ResponseEntity<Map<String, Object>> update(Integer id, Menu entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    
}
