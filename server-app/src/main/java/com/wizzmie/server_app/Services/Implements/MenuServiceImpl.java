package com.wizzmie.server_app.Services.Implements;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Request.MenuRequest;
import com.wizzmie.server_app.Entity.Category;
import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Repository.CategoryRepository;
import com.wizzmie.server_app.Repository.MenuRepository;
import com.wizzmie.server_app.Services.GenericService;
import com.wizzmie.server_app.Services.OptionalGenericService;

@Service
public class MenuServiceImpl implements GenericService<Menu, Integer>, OptionalGenericService<Menu, Integer> {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private CategoryRepository categoryRepository; 

    @Override
    public List<Menu> getAll() {
        return menuRepository.findAll();
    }


    //Not Use
    @Override
    public Menu create(Menu entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'CreateMenu'");
    }

    //Not Use 
    @Override 
    public Menu update(Integer id, Menu entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'Update'");
    }

    @Override
    public String delete(Integer id) {

        Menu menu = menuRepository.findById(id)
                    .orElseThrow(()-> new RuntimeException("Menu doesn't exist!"));
        menuRepository.delete(menu);
        return ("Menu Deleted!");
    }



    @Override
    public Menu CreateMenu(MenuRequest request) {
        Menu menu = new Menu();

        Optional<Menu> savedMenu = menuRepository.findByName(request.getName());
        if(savedMenu.isPresent()){
            throw new RuntimeException("Menu with name : " + request.getName() + "already exist!");
        }

        menu.setName(request.getName());
        menu.setDescription(request.getDescription());
        menu.setImage(request.getImage());
        menu.setPrice(request.getPrice());
        menu.setIsAvailable(request.getIsAvailable());


        Category category = categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(()-> new RuntimeException("Id Not Found!"));

        menu.setCategory(category);
        
        return menuRepository.save(menu);
    
    }


    @Override
    public Menu UpdateMenu(Integer id, MenuRequest request) {
        Menu menu = menuRepository.findById(id).orElseThrow(()-> new RuntimeException("Menu Not Found"));
        
        menu.setName(request.getName());
        menu.setDescription(request.getDescription());
        menu.setImage(request.getImage());
        menu.setPrice(request.getPrice());

        Category category = categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(()-> new RuntimeException("Category Not Found"));

        menu.setCategory(category);

        return menuRepository.save(menu);
    }
    
}
