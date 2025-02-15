package com.wizzmie.server_app.Services.Implements;

import java.util.Map;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Request.MailRequest;
import com.wizzmie.server_app.DTO.Respon.MailResponse;
import com.wizzmie.server_app.Services.MailService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender sender;

    @Override
    public MailResponse sendMail(Map<String, Object> model, String QrisURL) {
        MailResponse mailResponse = new MailResponse();
        MimeMessage message = sender.createMimeMessage();
        MailRequest mailRequest = new MailRequest();


        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(mailRequest.getFrom());
            helper.setTo(mailRequest.getTo());
            helper.setSubject(mailRequest.getSubject());
            helper.setText(QrisURL, true);
            sender.send(message);

            mailResponse.setMessage("Mail sent successfully");
            mailResponse.setSuccess(Boolean.TRUE);

        } catch (Exception e) {
            return new MailResponse("Mail sending failed : " +e.getMessage(), false);
        }

        return mailResponse;
    }
    
}
