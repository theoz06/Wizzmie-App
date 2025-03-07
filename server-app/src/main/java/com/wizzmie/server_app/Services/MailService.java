package com.wizzmie.server_app.Services;

import java.util.Map;

import com.wizzmie.server_app.DTO.Respon.MailResponse;

public interface MailService {
    MailResponse sendMail(Map<String, Object> model, String QrisURL);
}
