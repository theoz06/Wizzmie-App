package com.wizzmie.server_app.DTO.Request;

import lombok.Data;

@Data
public class MailRequest {
    private String to = "t.ziraluo@gmail.com";
    private String from = "t.ziraluo@yahoo.com"; 
    private String subject = "URL QRIS";
}
