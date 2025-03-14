package com.wizzmie.server_app.Services.Implements;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.wizzmie.server_app.DTO.Request.MenuRequest;
import com.wizzmie.server_app.Entity.Category;
import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Repository.CategoryRepository;
import com.wizzmie.server_app.Repository.MenuRepository;
import com.wizzmie.server_app.Services.GenericService;
import com.wizzmie.server_app.Services.OptionalGenericService;

@Service
@Transactional
public class MenuServiceImpl implements GenericService<Menu, Integer>, OptionalGenericService<Menu, Integer> {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private CategoryRepository categoryRepository; 

    @Autowired
    private FileUploadServiceImpl fileUploadServiceImpl;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;



    @Override
    public List<Menu> getAll() {
        return menuRepository.findAll();
    }


    @Override
    public String delete(Integer id) {

        Menu menu = menuRepository.findById(id)
                    .orElseThrow(()-> new RuntimeException("Menu doesn't exist!"));
        
        try{
            fileUploadServiceImpl.deleteImage(menu.getImage());
        }catch(IOException e){
            throw new RuntimeException("Error deleting image: " + e.getMessage());
        }
        menuRepository.delete(menu);
        return ("Menu Deleted!");
    }



    @Override
    public Menu CreateMenu(MenuRequest request, MultipartFile image) {
        Menu menu = new Menu();

        Optional<Menu> savedMenu = menuRepository.findByName(request.getName());
        if(savedMenu.isPresent()){
            throw new RuntimeException("Menu with name : " + request.getName() + "already exist!");
        }


        menu.setName(request.getName());
        menu.setDescription(request.getDescription());
        menu.setPrice(request.getPrice());
        menu.setIsAvailable(request.getIsAvailable());

        if (image != null && !image.isEmpty()) {
            try {
                String fileName = fileUploadServiceImpl.saveImage(image);
                menu.setImage(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Error saving image: " + e.getMessage());
            }
        }
        Category category = categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(()-> new RuntimeException("Id Not Found!"));

        menu.setCategory(category);
        
        return menuRepository.save(menu);
    
    }


    @Override
    public Menu UpdateMenu(Integer id, MenuRequest request, MultipartFile image) {
        Menu menu = menuRepository.findById(id).orElseThrow(()-> new RuntimeException("Menu Not Found"));
        
        menu.setName(request.getName());
        menu.setDescription(request.getDescription());
        menu.setPrice(request.getPrice());
        menu.setIsAvailable(request.getIsAvailable());

        if(image != null && !image.isEmpty()){
            try {
                fileUploadServiceImpl.updateImage(image, id);
            } catch (IOException e) {
                throw new RuntimeException("Error updating image: " + e.getMessage());
            }
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(()-> new RuntimeException("Category Not Found"));

        menu.setCategory(category);

        return menuRepository.save(menu);
    }


    public void updateAvailablelity(Integer id, Boolean isAvailable){
       
        if(isAvailable == null){
            throw new IllegalArgumentException("Availablelity cannot be null");
        }

        Integer updateRow = menuRepository.updateMenuAvailablelity(isAvailable, id);
        System.out.println(updateRow);

        if(updateRow == 1){
            Menu menu  = menuRepository.findById(id).orElseThrow(()-> new RuntimeException("Menu Not Found"));
            messagingTemplate.convertAndSend("/public/menu-update",menu);
        }else{
            throw new RuntimeException("Menu Not Found");
        }
    } 


        /******************************************************************************************************* */
        //Not Use
        @Override
        public Menu create(Menu entity) {
            // TODO Auto-generated method stub
            throw new UnsupportedOperationException("Unimplemented method 'CreateMenu'");
        }
    
        
        //Not Use
        @Override 
        public Menu update(Integer id, Menu entity) {
            Menu menu = menuRepository.findById(id).orElseThrow(()-> new RuntimeException("Menu Not Found"));
            
            if (entity.getIsAvailable() == null){
                throw new IllegalArgumentException("Availablelity cannot be null");
            }
    
            menu.setIsAvailable(entity.getIsAvailable());
            
            return menuRepository.save(menu);
        }
    
}
