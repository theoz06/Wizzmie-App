package com.wizzmie.server_app.Services.Implements;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Repository.MenuRepository;


@Service
public class FileUploadServiceImpl {
    
    @Value("${upload.path}")
    private String uploadPath;

    @Autowired
    private MenuRepository menuRepository;

    public String saveImage(MultipartFile file) throws IOException{

        if(file.isEmpty()){
            throw new IllegalArgumentException("File cannot be empty.");
        }

        if(file.getSize() > 5 * 1024 * 1024){
            throw new IllegalArgumentException("File size cannot exceed 5MB.");
        }

        String contentType = file.getContentType();
        if(contentType == null || !contentType.startsWith("image/")){
            throw new IllegalArgumentException("Invalid file type. Only image files are allowed.");
        }

        String originalFileName = file.getOriginalFilename();
        String fileExstension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqFileName = UUID.randomUUID().toString() + fileExstension;

        Path uploadDir = Paths.get(uploadPath);
        if(!Files.exists(uploadDir)){
            Files.createDirectories(uploadDir);
        }

        Path filePath = uploadDir.resolve(uniqFileName);
        Files.copy(file.getInputStream(), filePath);

        return uniqFileName;
    }

    public void deleteImage(String fileName) throws IOException{
        Path filePath = Paths.get(uploadPath).resolve(fileName);
        Files.deleteIfExists(filePath);
    }

    public void updateImage(MultipartFile file, Integer menuId) throws IOException{
        Menu menu = menuRepository.findById(menuId).orElseThrow(() -> new RuntimeException("Menu Not Found"));

        if (menu.getImage() != null){
            deleteImage(menu.getImage());
        }

        String newFileName = saveImage(file);
        menu.setImage(newFileName);
        menuRepository.save(menu);
    }
}
